export default function Footer() {
  return (
    <footer className="text-center text-white h-24 sm:h-20 w-full sm:pt-2 pt-4 mt-5 flex sm:flex-row flex-col justify-between items-center px-3 space-y-3 sm:mb-0 mb-3">
      <div>
        Powered by{" "}
        <a
          href="https://replicate.com/"
          target="_blank"
          rel="noreferrer"
          className="font-bold transition hover:text-white/50"
        >
          Replicate,{" "}
        </a>
        <a
          href="https://upstash.com/"
          target="_blank"
          rel="noreferrer"
          className="font-bold transition hover:text-white/50"
        >
          Upstash Redis{" "}
        </a>
        and{" "}
        <a
          href="https://vercel.com/"
          target="_blank"
          rel="noreferrer"
          className="font-bold transition hover:text-white/50"
        >
          Vercel.
        </a>
      </div>
    </footer>
  );
}
