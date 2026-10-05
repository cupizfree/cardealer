"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { ListingGalleryImage } from "@/data/listings";

// Matches ../aurexo/listing-details-5.html's gallery (`.swiper-listing-details-5`): a single-slide
// carousel, config mirrors `assets/js/swiper.js`'s `swiperListingDetails5Config` exactly
// (`slidesPerView: 1`, `loop: false`, `speed: 800`, `initialSlide: 1`, no responsive breakpoint bump
// — unlike `DetailsGallery`'s `.swiper-listing-details`, which loops and goes to 2-up at 767px).
// A 4th distinct single-carousel config, hence its own component per the variant classification
// rule rather than another prop on `DetailsGallery`.
//
// Real dual-navigation behavior: source wires up BOTH the breadcrumb's Prev/Next AND the nav buttons
// rendered here (inside the swiper) to the SAME swiper instance, by giving both pairs a shared
// `navigation-prev`/`navigation-next` class and letting Swiper's selector-based navigation bind every
// matching element (see `ListingDetailsBreadcrumb`'s `interactiveNav` prop, which this gallery
// requires be set to `true` by its page). Swiper's `nextEl`/`prevEl` selectors below intentionally
// match both locations at once instead of scoping to only the buttons rendered in this component.
//
// Unlike `DetailsGallery`/`DetailsGalleryWithThumbs`/`DetailsGalleryAccordion`, there's no
// `.img-main { height: ...; object-fit: cover }` override for `.swiper-listing-details-5` in
// assets/scss/component/page-title.scss — only the base `img { max-width: 100%; height: auto }`
// reset applies, so the `width`/`height` passed to next/image directly sets the rendered aspect
// ratio (no CSS crop hides a wrong hint here). The actual source stills
// (slide-listing-details-18/19/20.jpg, and every listing's own card photo) are all a real 4:3 —
// confirmed via `file` on the originals — so these must stay 4:3 or the photo renders stretched.
//
// `overflow-visible` on the Swiper matches source's actual rendered behavior (verified by opening
// ../aurexo/listing-details-5.html directly): the swiper itself is centered at 930px, narrower than
// the viewport, and — since nothing clips it to that width — the adjacent (also 930px-wide) slides
// visibly peek in from both sides. Swiper's own base CSS defaults the container to
// `overflow: hidden`, which would crop that peek away; this utility class (already used the same way
// by `DetailsGallery`) overrides it back to source's actual look.
export default function DetailsGalleryCarousel({ images }: { images: ListingGalleryImage[] }) {
  return (
    <section className="max-w-1920 overflow-hidden mx-auto">
      <div className="container">
        <Swiper
          modules={[Navigation]}
          navigation={{ nextEl: ".navigation-next", prevEl: ".navigation-prev" }}
          // Swiper's top-level `uniqueNavElements` option defaults to `true`, which (when a selector
          // matches multiple elements globally but exactly one inside the swiper root) binds ONLY the
          // in-swiper match and silently drops the others. That would leave the breadcrumb's Prev/Next
          // inert, defeating the whole point of sharing the `navigation-prev`/`-next` class with them
          // (see `ListingDetailsBreadcrumb`'s `interactiveNav` prop) — disabling it lets both pairs
          // drive this swiper, matching source.
          uniqueNavElements={false}
          spaceBetween={20}
          slidesPerView={1}
          loop={false}
          initialSlide={1}
          speed={800}
          className="swiper swiper-listing-details-5 overflow-visible"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="listing-details-item radius-28">
                <Image className="img-main" src={image.src} alt={image.alt} width={1200} height={900} />
                <div className="listing-details-item--content">
                  <a className="listing-details-item--button" href="#" onClick={(event) => event.preventDefault()}>
                    <Image src="/assets/icons/playcircle.svg" alt="play" width={20} height={20} />
                    Putar Video
                  </a>
                  <a className="listing-details-item--button" href="#" onClick={(event) => event.preventDefault()}>
                    <Image src="/assets/icons/view-all-photo.svg" alt="view" width={20} height={20} />
                    Lihat Semua Foto
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Navigation arrows — nested inside the swiper root so `.swiper-listing-details-5
              .swiper-button` (assets/scss/component/page-title.scss) actually applies. */}
          <p className="swiper-button navigation-prev swiper-listing-details-main-prev">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.9487 2.71258C14.2097 2.97026 14.2335 3.37348 14.0199 3.65762L13.9487 3.73903L7.60622 10L13.9487 16.261C14.2097 16.5186 14.2335 16.9219 14.0199 17.206L13.9487 17.2874C13.6877 17.5451 13.2792 17.5685 12.9913 17.3577L12.9088 17.2874L6.04609 10.5132C5.78505 10.2555 5.76132 9.85232 5.9749 9.56818L6.04609 9.48678L12.9088 2.71258C13.196 2.42914 13.6615 2.42914 13.9487 2.71258Z"
                fill="white"
              />
            </svg>
          </p>
          <p className="swiper-button navigation-next swiper-listing-details-main-next">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.0513 17.2874C5.79025 17.0297 5.76652 16.6265 5.98011 16.3424L6.0513 16.261L12.3938 10L6.0513 3.73903C5.79025 3.48135 5.76652 3.07813 5.98011 2.79399L6.0513 2.71258C6.31235 2.45491 6.72084 2.43148 7.00869 2.64231L7.09116 2.71258L13.9539 9.48678C14.215 9.74446 14.2387 10.1477 14.0251 10.4318L13.9539 10.5132L7.09116 17.2874C6.80401 17.5709 6.33845 17.5709 6.0513 17.2874Z"
                fill="white"
              />
            </svg>
          </p>
        </Swiper>
      </div>
    </section>
  );
}
