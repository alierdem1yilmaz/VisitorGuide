"use client";

import { useState } from "react";
import Image from "next/image";

const SIZE = {
  hero: {
    container: "h-56 sm:h-80 rounded-2xl",
    arrow: "h-11 w-11",
    icon: "h-5 w-5",
    sizes: "(min-width: 1024px) 1152px, 100vw",
  },
  card: {
    container: "h-56 rounded-xl",
    arrow: "h-9 w-9",
    icon: "h-4 w-4",
    sizes: "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  },
} as const;

export default function PhotoCarousel({
  photos,
  previousLabel,
  nextLabel,
  variant = "hero",
  priority = false,
}: {
  photos: { url: string; alt: string }[];
  previousLabel: string;
  nextLabel: string;
  variant?: "hero" | "card";
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);
  if (photos.length === 0) return null;
  const size = SIZE[variant];

  function prev(e: React.MouseEvent) {
    e.preventDefault();
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }
  function next(e: React.MouseEvent) {
    e.preventDefault();
    setIndex((i) => (i + 1) % photos.length);
  }

  return (
    <div className={`relative w-full overflow-hidden bg-brand-100 ${size.container}`}>
      {photos.map((photo, i) => (
        <div
          key={photo.url}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={photo.url}
            alt={photo.alt}
            fill
            priority={priority && i === 0}
            className="object-cover"
            sizes={size.sizes}
          />
        </div>
      ))}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label={previousLabel}
            className={`absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-brand-800/80 text-white shadow-md transition-colors hover:bg-brand-800 ${size.arrow}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className={size.icon}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={nextLabel}
            className={`absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-brand-800/80 text-white shadow-md transition-colors hover:bg-brand-800 ${size.arrow}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className={size.icon}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
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
