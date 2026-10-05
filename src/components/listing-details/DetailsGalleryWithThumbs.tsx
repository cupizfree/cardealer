"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import type { ListingGalleryImage } from "@/data/listings";

// Matches ../aurexo/listing-details-3.html's gallery: a main image swiper synced to a separate
// thumbnail-strip swiper (`assets/js/swiper.js`'s `swiperMain`/`swiperThumbs`, linked via Swiper's
// `thumbs` module) — a third distinct gallery shape alongside `DetailsGallery` (single carousel) and
// `DetailsGalleryGrid` (2x2 grid + lightbox), hence its own component per the variant classification
// rule. Config mirrors source exactly: main slider `loop: false`, `initialSlide: 1`, thumbs
// `slidesPerView: "auto"`, `spaceBetween: 12`, `watchSlidesProgress`.
//
// Source's own main slides are a content bug, not a real dataset — every one of the 7 main slides
// shows the SAME image (`slide-listing-details-5.jpg`) while the 7 thumbnails show 7 different
// images (6,5,7,8,9,10,11), so clicking a thumbnail in source wouldn't actually change the main
// photo shown. Since thumb-to-main syncing is real, load-bearing behavior (not decorative, unlike
// "Putar Video"), this renders the SAME `images` array for both sliders so they genuinely stay in
// sync — not a re-transcription of the broken pairing.
export default function DetailsGalleryWithThumbs({ images }: { images: ListingGalleryImage[] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <>
      <Swiper
        modules={[Navigation, Thumbs]}
        navigation={{ nextEl: ".navigation-next", prevEl: ".navigation-prev" }}
        thumbs={{ swiper: thumbsSwiper }}
        initialSlide={1}
        spaceBetween={16}
        speed={500}
        className="swiper swiper-listing-details-main"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="listing-details-item main-item relative">
              <Image className="img-main" src={image.src} alt={image.alt} width={960} height={640} />
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

        {/* Navigation arrows — MUST be siblings of `.swiper-wrapper` inside the swiper root (exactly
            where source places them, see listing-details-3.html lines ~640-653): their styling comes
            from the descendant selector `.swiper-listing-details-main .swiper-button` in
            assets/scss/component/page-title.scss (frosted-glass round button, absolutely positioned
            relative to the swiper container). Rendered outside this subtree they'd match no CSS rule
            at all and show as bare unstyled text+SVG. */}
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

      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        watchSlidesProgress
        freeMode={false}
        slidesPerView="auto"
        spaceBetween={12}
        className="swiper swiper-listing-details-thumbs pb-60 overflow-hidden"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="listing-details-thumb">
              <Image src={image.src} alt="thumbnail" width={120} height={80} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
