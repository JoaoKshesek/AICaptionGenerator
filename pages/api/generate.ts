import redis from "../../utils/redis";
import requestIp from "request-ip";

import { Ratelimit } from "@upstash/ratelimit";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = string;
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    imageUrl: string;
  };
}

// Create a new ratelimiter, that allows 3 requests every 15 minutes
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.fixedWindow(5, "1440 m"),
      analytics: true,
    })
  : undefined;

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  // Rate Limiter Code
  if (ratelimit) {
    const identifier = requestIp.getClientIp(req);
    const result = await ratelimit.limit(identifier!);
    res.setHeader("X-RateLimit-Limit", result.limit);
    res.setHeader("X-RateLimit-Remaining", result.remaining);

    if (!result.success) {
      res
        .status(429)
        .json("Too many uploads in 1 day. Please try again after 24 hours.");
      return;
    }
  }

  const imageUrl = req.body.imageUrl;
  let startResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.REPLICATE_API_KEY,
    },
    body: JSON.stringify({
      version:
        "2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
      input: {
        image: imageUrl,
        task: "image_captioning",
      },
    }),
  });

  let jsonStartResponse = await startResponse.json();
  let endpointUrl = jsonStartResponse.urls.get;

  // GET request to get the status of the image restoration process & return the result when it's ready
  let caption: string | null = null;
  while (!caption) {
    // Loop in 1s intervals until the alt text is ready
    console.log("polling for result...");
    let finalResponse = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_KEY,
      },
    });
    let jsonFinalResponse = await finalResponse.json();

    if (jsonFinalResponse.status === "succeeded") {
      caption = jsonFinalResponse.output;
    } else if (jsonFinalResponse.status === "failed") {
      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  res.status(200).json(caption ? caption : "Failed to generate caption");
}
