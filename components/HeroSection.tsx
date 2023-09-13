import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

import { HiOutlineClipboardDocument } from "react-icons/hi2";

export default function HeroSection() {
  const [buttonText, setButtonText] = useState("Copiar");

  const copyToClipboard = (caption: string) => {
    navigator.clipboard.writeText(caption!);

    setButtonText("Copiado!"); // set the button text to "Copied!" when text is copied
    setTimeout(() => {
      setButtonText("Copiar"); // set the button text back to "Copy" after 2 seconds
    }, 2000);
  };

  return (
    <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-10">
      <div className="flex justify-between items-center w-full flex-col text-white">
        <div className="flex flex-col mb-16">
          <div className="flex sm:space-x-10 sm:flex-row flex-col">
            <div className="w-full md:w-1/2">
              <h2 className="mb-1 font-medium text-lg">Foto original</h2>
              <Image
                alt="Dog and blue building"
                src="/example.jpg"
                className="w-96 h-96 rounded-2xl"
                width={300}
                height={300}
              />
            </div>

            <div className="sm:mt-0 mt-8 w-full md:w-1/2">
              <h2 className="mb-1 font-medium text-lg">Descrição gerada</h2>
              <textarea
                className="w-full h-32 p-2 text-gray-700 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring"
                placeholder="Enter text here..."
                value="a brown dog standing on top of a blue building"
              />
              <button
                className="px-4 py-2 text-white bg-[#5a5cd1] rounded-md hover:bg-[#3f4194] focus:outline-none focus:ring"
                onClick={() =>
                  copyToClipboard(
                    "a brown dog standing on top of a blue building"
                  )
                }
              >
                <div className="flex flex-row items-center justify-center">
                  <HiOutlineClipboardDocument className="w-5 h-5 mr-1" />
                  {buttonText}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <Link
          className="bg-[#4b4cb7] rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-4 hover:bg-[#4b4cb7]/80"
          href="/caption"
        >
          Criar uma descrição
        </Link>
      </div>
    </main>
  );
}
