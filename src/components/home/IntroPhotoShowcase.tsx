"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type IntroPhoto = {
  url: string;
  author: string;
  placeName: string;
};

export default function IntroPhotoShowcase({ photos }: { photos: IntroPhoto[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [photos.length]);

  if (photos.length === 0) return null;

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-2xl sm:h-full sm:min-h-96">
      {photos.map((photo, i) => (
        <div
          key={photo.url}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={photo.url}
            alt={photo.placeName}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        </div>
      ))}
      <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-brand-800 shadow">
        @{photos[index].author}
      </span>
    </div>
  );
}
