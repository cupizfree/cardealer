"use client";

import { useState } from "react";
import Image from "next/image";
import type { ListingGalleryImage } from "@/data/listings";

// Matches ../aurexo/listing-details-2.html's gallery layout: one large "main" image plus a 2x2 grid
// of thumbnails (two `.flex.flex-col.gap-8` columns of 2), each wrapped in `data-fancybox="gallery"`
// anchors — a genuinely different DOM shape than `DetailsGallery`'s Swiper carousel (variant
// classification rule: separate component, not a prop). Source bundles the real jQuery Fancybox
// plugin for this, but pulling in jQuery + a lightbox library for one gallery isn't proportionate
// (same "Package Principle" call as `RangeSlider` hand-rolling the price slider) — this reproduces
// the actual click-to-enlarge/cycle-through-photos behavior with a small local lightbox instead of
// leaving it decorative, since (unlike "Play Video", which has no real source to play) "view the
// photo bigger" is a real, deliverable interaction.
export default function DetailsGalleryGrid({ images }: { images: ListingGalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [main, ...thumbnails] = images;

  return (
    <>
      <section className="max-w-1920 overflow-hidden mx-auto">
        <div className="container">
          <div className="listing-details-item-wrapper">
            <div className="listing-details-item main-item">
              <a
                className="image flex"
                href={main.src}
                onClick={(event) => {
                  event.preventDefault();
                  setLightboxIndex(0);
                }}
              >
                <Image src={main.src} alt={main.alt} width={960} height={640} />
              </a>

              <div className="listing-details-item--content">
                <a className="listing-details-item--button" href="#" onClick={(event) => event.preventDefault()}>
                  <Image src="/assets/icons/playcircle.svg" alt="play" width={20} height={20} />
                  Play Video
                </a>
                <a
                  className="listing-details-item--button"
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setLightboxIndex(0);
                  }}
                >
                  <Image src="/assets/icons/view-all-photo.svg" alt="play" width={20} height={20} />
                  View All Photo
                </a>
              </div>
            </div>

            {[thumbnails.slice(0, 2), thumbnails.slice(2, 4)].map((column, columnIndex) => (
              <div className="flex flex-col gap-8" key={columnIndex}>
                {column.map((image, i) => {
                  const index = columnIndex * 2 + i + 1;
                  return (
                    <div className="listing-details-item" key={index}>
                      <a
                        className="image flex"
                        href={image.src}
                        onClick={(event) => {
                          event.preventDefault();
                          setLightboxIndex(index);
                        }}
                      >
                        <Image src={image.src} alt={image.alt} width={480} height={320} />
                      </a>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        // No Fancybox CSS is loaded in this app (the plugin was never imported — see the component
        // header comment), so this overlay is styled inline rather than via new global CSS classes
        // that would only ever be used here.
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={(event) => {
              event.stopPropagation();
              setLightboxIndex(null);
            }}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image src="/assets/icons/X.svg" alt="close" width={20} height={20} />
          </button>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(event) => {
              event.stopPropagation();
              setLightboxIndex((prev) => (prev === null ? prev : (prev - 1 + images.length) % images.length));
            }}
            style={{
              position: "absolute",
              left: 24,
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: 28,
              lineHeight: 1,
            }}
          >
            ‹
          </button>
          <div onClick={(event) => event.stopPropagation()} style={{ maxWidth: "85vw", maxHeight: "85vh" }}>
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              width={1200}
              height={800}
              style={{ width: "100%", height: "auto", borderRadius: 12 }}
            />
          </div>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(event) => {
              event.stopPropagation();
              setLightboxIndex((prev) => (prev === null ? prev : (prev + 1) % images.length));
            }}
            style={{
              position: "absolute",
              right: 24,
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: 28,
              lineHeight: 1,
            }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
