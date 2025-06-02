"use client";

import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="h-screen w-screen">
        <div className="flex h-screen w-full justify-center items-center flex-col">
          <h1 className="relative text-8xl font-bold text-center">Order Up!</h1>
          <div className="my-10">
            <Link
              href={`/dashboard`}
              className="m-1.5 p-3 bg-gray-500 cursor-pointer rounded-md"
            >
              Start
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
