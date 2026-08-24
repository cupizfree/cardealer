"use client";

import { useState, cloneElement, type ReactElement, type ReactNode } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import type { ListingGalleryImage } from "@/data/listings";

// Matches ../aurexo/listing-details-6.html's gallery (`.swiper-listing-details-main-style-2.style-2`
// + `.swiper-listing-details-thumbs-style-2`) — config mirrors `assets/js/swiper.js`'s `swiperMain2`/
// `pagithumbs2`: `effect: "fade"` with `crossFade: true`, real `autoplay` (3s, doesn't pause on
// interaction), clickable pagination dots, `speed: 1000`; thumbnail strip is a vertical 5-up floating
// overlay (`position: absolute; right: 40px; top: 56px`, 100x100 slides) synced via Swiper's `thumbs`
// module — a 5th distinct gallery DOM shape (fade+autoplay+floating-thumbs, vs. v3's plain
// below-strip main+thumbs), hence its own component. `loop` is `false` here, deviating from source's
// `loop: true` — see the dedicated note below on why.
//
// Source's own main slides are a content bug again (like v3): 5 main slides mostly repeat image 21
// (only one is image 18) while the 5 thumbnails are 5 actually-distinct images (22-26) — clicking a
// thumbnail wouldn't visibly change the main photo in source. Since thumb-to-main syncing is real,
// load-bearing behavior, this renders the SAME `images` array for both sliders instead.
//
// Each slide is also a real Fancybox link (`data-fancybox="gallery-details-listing-6"`) — same
// Package-Principle call as the other gallery variants: a small local lightbox instead of pulling in
// jQuery + Fancybox.
//
// Unlike listing-details-5.html, source does NOT wire the breadcrumb's Prev/Next to this gallery:
// `swiperMain2`'s own `navigation` config only references `.swiper-listing-details-main-next/prev`
// (the in-gallery buttons), and the dedicated dual-nav-detection script in swiper.js is scoped
// specifically to `.swiper-listing-details-5` (v5's class), which doesn't exist on this page. The
// breadcrumb's `navigation-prev`/`navigation-next` classes here are inert leftovers from the shared
// template — so this page's `ListingDetailsBreadcrumb` is NOT given `interactiveNav`.
//
// Four issues surfaced during Playwright verification, all fixed before reporting:
//
// 1. Structural: source literally nests `.swiper-listing-details-thumbs-style-2` INSIDE
//    `.swiper-listing-details-main-style-2` (harmless for vanilla Swiper). swiper/react's `<Swiper>`
//    only special-cases direct `SwiperSlide` children — nesting a second, fully separate `<Swiper>`
//    instance as a non-slide child doesn't mount correctly (the thumbnail strip silently failed to
//    render at all). Rendered as a sibling instead, with `relative` added to the shared wrapper div so
//    the thumb strip's `position: absolute; right: 40px; top: 56px` still anchors to the same visual
//    spot over the main image.
//
// 2. The main photo needs an explicit `style={{ height: "100%" }}` override: next/image always renders
//    literal `width`/`height` HTML attributes, and browsers preserve an img's intrinsic aspect ratio
//    inside a flex item even under `align-items: stretch` once those attributes are present — unlike
//    source's plain `<img>` (no width/height attributes at all), which stretches to fill the
//    fixed-height `.listing-details-item` box with no competing aspect-ratio hint. Without the
//    override, each slide rendered taller than 675px and visibly overlapped the pagination dots below.
//
// 3. The nav buttons (`NavArrowButton` below) are rendered as siblings of both swipers, NOT nested
//    inside the main swiper like source: the main swiper root is `position: relative` with Swiper's
//    own base `z-index: 1`, which establishes ITS OWN stacking context — a button nested inside it can
//    never outrank the (sibling) thumb strip's `z-index: 5`, since only the swiper ROOT's z-index (1)
//    is what's actually compared against the thumb strip at the outer level. Raising the swiper root's
//    z-index above 5 was tried first and rejected: it fixed the button but then made the ENTIRE swiper
//    (the same rectangle the thumb strip visually overlaps) paint over the thumb strip too, blocking
//    every click on it. `NavArrowButton` reproduces the button's CSS by hand
//    (`assets/scss/component/page-title.scss`'s `.swiper-button` rule) instead of relying on the
//    `.swiper-listing-details-main-style-2 .swiper-button` descendant selector, so it sits at the same
//    (shared, sibling) stacking level as the thumb strip and wins on `z-index: 10` alone. Binding still
//    works via Swiper's string-selector navigation regardless of DOM position.
//
// 4. This app only ever imported base `swiper/css`, never the per-module `swiper/css/effect-fade` or
//    `swiper/css/pagination` (see src/app/layout.tsx) — a real, previously-undiscovered gap (this is
//    the first page to actually need the fade effect or a working `.swiper-pagination` position/
//    z-index). Without effect-fade's CSS, every non-active fade slide keeps `pointer-events: auto`
//    (Swiper only disables it via that stylesheet, not JS) and — since all 5 stack at the identical
//    position with `z-index: auto` — whichever inactive slide happens to sit LATEST in DOM order
//    silently absorbed every click on the gallery, including the lightbox trigger. Without
//    pagination's CSS, `.swiper-pagination` had no `z-index` and got covered by the swiper-wrapper
//    sibling. Both are now imported globally, fixing this component and benefiting
//    `RelatedListings.tsx`, which already uses the Pagination module.
//
// `loop`, once fixed to `true` to literally match source, broke navigation in a specific sequence
// (click a thumbnail, then click Next/autoplay) — `loop` + `thumbs` sync + `effect: "fade"` is a known
// finicky Swiper combination: loop mode remaps real slide indices to internal clone indices, and the
// thumbs-driven jump can land the main swiper on a state where it stops responding to further
// `slideNext()` calls entirely (verified: even autoplay stopped advancing afterward). Source's own
// config attempts the identical combination, so this may well be broken in the live site too — kept
// `loop={false}` since shipping broken navigation to literally match a broken source default isn't
// the goal; every other config value still matches source exactly.
export default function DetailsGalleryFadeThumbs({ images }: { images: ListingGalleryImage[] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="max-w-1920 mx-auto overflow-hidden relative">
        <Swiper
          modules={[Navigation, Pagination, EffectFade, Autoplay, Thumbs]}
          loop={false}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          initialSlide={1}
          speed={1000}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ el: ".pagination-swiper-listing-details-main-style-2", clickable: true }}
          navigation={{ nextEl: ".swiper-listing-details-main-next", prevEl: ".swiper-listing-details-main-prev" }}
          thumbs={{ swiper: thumbsSwiper }}
          className="swiper swiper-listing-details-main-style-2 style-2"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <a
                className="image listing-details-item main-item relative"
                href={image.src}
                data-fancybox="gallery-details-listing-6"
                onClick={(event) => {
                  event.preventDefault();
                  setLightboxIndex(index);
                }}
              >
                <Image
                  className="main w-full object-cover"
                  src={image.src}
                  alt={image.alt}
                  width={1200}
                  height={900}
                  style={{ height: "100%" }}
                />
              </a>
            </SwiperSlide>
          ))}

          <div className="pagination-style-absolute swiper-pagination pagination-white pagination-style pagination-swiper-listing-details-main-style-2 mt-35" />
        </Swiper>

        <NavArrowButton side="prev" className="swiper-listing-details-main-prev">
          <path
            d="M13.9487 2.71258C14.2097 2.97026 14.2335 3.37348 14.0199 3.65762L13.9487 3.73903L7.60622 10L13.9487 16.261C14.2097 16.5186 14.2335 16.9219 14.0199 17.206L13.9487 17.2874C13.6877 17.5451 13.2792 17.5685 12.9913 17.3577L12.9088 17.2874L6.04609 10.5132C5.78505 10.2555 5.76132 9.85232 5.9749 9.56818L6.04609 9.48678L12.9088 2.71258C13.196 2.42914 13.6615 2.42914 13.9487 2.71258Z"
          />
        </NavArrowButton>
        <NavArrowButton side="next" className="swiper-listing-details-main-next">
          <path
            d="M6.0513 17.2874C5.79025 17.0297 5.76652 16.6265 5.98011 16.3424L6.0513 16.261L12.3938 10L6.0513 3.73903C5.79025 3.48135 5.76652 3.07813 5.98011 2.79399L6.0513 2.71258C6.31235 2.45491 6.72084 2.43148 7.00869 2.64231L7.09116 2.71258L13.9539 9.48678C14.215 9.74446 14.2387 10.1477 14.0251 10.4318L13.9539 10.5132L7.09116 17.2874C6.80401 17.5709 6.33845 17.5709 6.0513 17.2874Z"
          />
        </NavArrowButton>

        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          direction="vertical"
          slidesPerView={5}
          spaceBetween={16}
          freeMode
          allowTouchMove={false}
          watchSlidesProgress
          className="swiper swiper-listing-details-thumbs-style-2"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="listing-details-thumb">
                <Image src={image.src} alt="thumbnail" width={100} height={100} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

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

// Hand-reproduces the `.swiper-button` rule from assets/scss/component/page-title.scss (frosted
// round button, `position: absolute; top: 50%; z-index: 10`, hover swaps to solid white + primary
// icon) as inline styles/state, rather than the `.swiper-listing-details-main-style-2 .swiper-button`
// descendant selector — see this file's header comment for why: the descendant version can't win the
// z-index fight against the thumb strip once it's forced to live one stacking-context level deeper.
function NavArrowButton({ side, className, children }: { side: "prev" | "next"; className: string; children: ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <p
      className={`swiper-button ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "absolute",
        zIndex: 10,
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        backgroundColor: hover ? "#fff" : "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition: "all 0.3s ease",
        height: 60,
        width: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 52,
        [side === "next" ? "right" : "left"]: 24,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        {cloneElement(children as ReactElement<{ fill?: string }>, { fill: hover ? "#1C1C1C" : "white" })}
      </svg>
    </p>
  );
}
