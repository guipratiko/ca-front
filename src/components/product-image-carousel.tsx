"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Carrossel com thumbs — inspirado no Thumbnail Slider (21st / Embla pattern). */
export function ProductImageCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const galleryKey = images.join("|");

  useEffect(() => {
    setIndex(0);
  }, [galleryKey]);

  if (!images.length) {
    return (
      <div className="prod-gallery prod-gallery--empty" aria-hidden="true">
        <span>Sem imagem</span>
      </div>
    );
  }

  const go = (next: number) => {
    const len = images.length;
    setIndex(((next % len) + len) % len);
  };

  return (
    <div className="prod-gallery">
      <div
        className="prod-gallery__stage"
        onTouchStart={(e) => {
          touchX.current = e.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={images[index]} src={images[index]} alt={alt} className="prod-gallery__img" />
        {images.length > 1 ? (
          <>
            <button
              type="button"
              className="prod-gallery__nav prod-gallery__nav--prev"
              aria-label="Imagem anterior"
              onClick={() => go(index - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="prod-gallery__nav prod-gallery__nav--next"
              aria-label="Próxima imagem"
              onClick={() => go(index + 1)}
            >
              <ChevronRight size={18} />
            </button>
            <div className="prod-gallery__dots" aria-hidden="true">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={i === index ? "is-active" : undefined}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="prod-gallery__thumbs" ref={trackRef} role="list">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              role="listitem"
              className={`prod-gallery__thumb${i === index ? " is-active" : ""}`}
              aria-label={`Ver imagem ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
