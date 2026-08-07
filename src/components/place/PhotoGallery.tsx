"use client";

import { useState } from "react";
import Image from "next/image";

export default function PhotoGallery({
  photos,
  alt,
}: {
  photos: { id: string; url: string; caption: string | null }[];
  alt: string;
}) {
  const [selected, setSelected] = useState(0);

  if (photos.length === 0) {
    return <div className="h-72 w-full rounded-xl bg-paper-2 sm:h-96" />;
  }

  const active = photos[selected];

  return (
    <div>
      <div className="relative h-72 w-full overflow-hidden rounded-xl bg-paper-2 sm:h-96">
        <Image
          src={active.url}
          alt={active.caption ?? alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 60vw, 100vw"
          priority
        />
      </div>
      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === selected ? "border-gold" : "border-transparent"
              }`}
            >
              <Image
                src={photo.url}
                alt={photo.caption ?? alt}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
