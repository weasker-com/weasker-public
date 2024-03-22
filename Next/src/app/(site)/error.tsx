"use client";
import { BiMessageSquareError } from "react-icons/bi";
import { useEffect } from "react";
import { InternalLink } from "@/components/links/InternalLink";

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
      <h1>An Error Occurred</h1>
      <div className="flex flex-row gap-5">
        <button className="border shadow px-5 rounded" onClick={() => reset()}>
          Refresh
        </button>
        <InternalLink
          element="Home"
          href={"/"}
          className="border shadow p-2 rounded"
        />
      </div>
    </div>
  );
}
