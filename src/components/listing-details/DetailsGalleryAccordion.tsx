"use client";

import { useState } from "react";
import Image from "next/image";
import type { ListingGalleryImage } from "@/data/listings";

// Matches ../aurexo/listing-details-4.html's gallery: a horizontal "accordion" of panels
// (`.slide-gallery-list .slide-gallery`) where the `.active` panel expands (`flex: 3.7`, later
// `flex: 9` on mobile per assets/scss/reponsive.scss) and the rest narrow to `flex: 1` — clicking a
// panel makes it active (assets/js/app.js's `hoverActiveGallery()`, despite the name it's a real
// click handler, not hover). Source's own default active panel is the 2nd of 6 (index 1) — kept as
// literal fidelity even though, unlike listing-details-1/2/3.html, all 6 images here are equally
// generic filler (no single "real photo" slide the default should favor instead).
//
// Each panel is also a real Fancybox lightbox link (`data-fancybox="gallery-listing-banner"`) —
// clicking opens the photo full-screen in source. Same "Package Principle" call as
// `DetailsGalleryGrid`: reproduces the click-to-enlarge/cycle-through-photos behavior with a small
// local lightbox instead of pulling in jQuery + Fancybox for one gallery.
//
// Source also ships a second, mobile-only `.swiper-listing-details-4` carousel (`hidden md-block`,
// shown only below the `md` breakpoint while this accordion is `md-hidden`) — NOT reproduced here:
// it's degenerate demo content (both its slides show the exact same image, unlike the 6 distinct
// images in the accordion), and `.slide-gallery-list .slide-gallery.active` already has its own
// mobile breakpoint rule (`flex: 9` at max-width 767px in reponsive.scss), so this one component
// degrades on its own without needing a broken duplicate. See docs/migration/COMPONENT_MAP.md #31.
export default function DetailsGalleryAccordion({ images }: { images: ListingGalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <section className="container-grid-gallery overflow-hidden mx-auto">
        <div className="max-w-1920 px-12 slide-gallery-list mx-auto">
          {images.map((image, index) => (
            <div
              className={`listing-details-item radius-24 slide-gallery${index === activeIndex ? " active" : ""}`}
              key={index}
            >
              <a
                className="w-full h-full"
                href={image.src}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveIndex(index);
                  setLightboxIndex(index);
                }}
              >
                <Image className="img-main" src={image.src} alt={image.alt} width={480} height={465} />
              </a>

              <div className="listing-details-item--content">
                <a className="listing-details-item--button" href="#" onClick={(event) => event.preventDefault()}>
                  <Image src="/assets/icons/playcircle.svg" alt="play" width={20} height={20} />
                  Putar Video
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
                  Lihat Semua Foto
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && (
        // No Fancybox CSS is loaded in this app — see `DetailsGalleryGrid`'s header comment for why
        // this overlay is styled inline rather than via new global CSS classes used only here.
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
            aria-label="Tutup"
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
            aria-label="Foto sebelumnya"
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
            aria-label="Foto berikutnya"
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
