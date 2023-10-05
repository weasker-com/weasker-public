"use client";
import { BiMessageSquareError } from "react-icons/bi";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mt-[10%] sm:mt-[5%] flex flex-col gap-10 items-center">
      <BiMessageSquareError size={100} />
      <h1>Page Not Found</h1>
      <div className="flex flex-row gap-5">
        <button className="border shadow px-5 rounded" onClick={() => reset()}>
          Refresh
        </button>
        <Link className="border shadow p-2 rounded" href={"/"}>
          Home
        </Link>
      </div>
    </div>
  );
}
