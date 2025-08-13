'use client';

import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";

export default function CopyLinkButton({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}${pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`
      : "";

  return (
    <button
      type="button"
      className={`rounded border px-3 py-2 text-sm hover:bg-gray-50 ${className}`}
      onClick={() => {
        const text = url || (typeof window !== "undefined" ? window.location.href : "");
        navigator.clipboard?.writeText(text);
        alert("Link copied!");
      }}
    >
      Copy link
    </button>
  );
}
