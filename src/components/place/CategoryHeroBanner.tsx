"use client";

import { useState } from "react";
import Image from "next/image";

export default function CategoryHeroBanner({
  photos,
  previousLabel,
  nextLabel,
}: {
  photos: { url: string; alt: string }[];
  previousLabel: string;
  nextLabel: string;
}) {
  const [index, setIndex] = useState(0);
  if (photos.length === 0) return null;
  const active = photos[index];

  function prev() {
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }
  function next() {
    setIndex((i) => (i + 1) % photos.length);
  }

  return (
    <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-brand-100 sm:h-80">
      <Image
        key={active.url}
        src={active.url}
        alt={active.alt}
        fill
        priority
        className="object-cover"
        sizes="(min-width: 1024px) 1152px, 100vw"
      />
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label={previousLabel}
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-800/80 text-white shadow-md transition-colors hover:bg-brand-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={nextLabel}
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-800/80 text-white shadow-md transition-colors hover:bg-brand-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((p, i) => (
              <span
                key={p.url}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
