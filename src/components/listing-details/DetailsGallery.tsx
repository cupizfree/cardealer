"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { ListingGalleryImage } from "@/data/listings";

// Matches ../aurexo/assets/js/swiper.js's `.swiper-listing-details` config exactly: slidesPerView
// 1 (→2 at 767px), spaceBetween 20, loop, custom prev/next (the breadcrumb row's
// `.swiper-listing-details-prev/next`), speed 2000. "Play Video"/"View All Photo" are decorative in
// the source too (href="#", no fancybox/lightbox or video-player JS found anywhere in app.js/
// plugin.js for `.listing-details-item--button`) — left as non-interactive here to match, not left
// unwired due to a gap on our side.
function GallerySlideContent({ image }: { image: ListingGalleryImage }) {
  return (
    <div className="listing-details-item radius-24">
      <Image src={image.src} alt={image.alt} width={960} height={640} />
      <div className="listing-details-item--content">
        <a className="listing-details-item--button" href="#">
          <Image src="/assets/icons/playcircle.svg" alt="play" width={20} height={20} />
          Play Video
        </a>
        <a className="listing-details-item--button" href="#">
          <Image src="/assets/icons/view-all-photo.svg" alt="play" width={20} height={20} />
          View All Photo
        </a>
      </div>
    </div>
  );
}

export default function DetailsGallery({ images }: { images: ListingGalleryImage[] }) {
  // Listings without a real `gallery` (11 of 12 — see LISTING_DATA_MAP.md) fall back to a single
  // synthesized slide (the card image). Looping a 1-slide carousel is meaningless and Swiper warns
  // loudly about it ("number of slides is not enough for loop mode") — skip the carousel apparatus
  // entirely in that case rather than pass `loop` to a track that can't loop.
  if (images.length <= 1) {
    return (
      <section className="max-w-1920 mx-auto">
        <div className="container">
          <div className="swiper-listing-details">
            <GallerySlideContent image={images[0]} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-1920 mx-auto">
      <div className="container">
        <Swiper
          modules={[Navigation]}
          navigation={{ nextEl: ".swiper-listing-details-next", prevEl: ".swiper-listing-details-prev" }}
          loop
          speed={2000}
          initialSlide={1}
          spaceBetween={20}
          breakpoints={{ 0: { slidesPerView: 1 }, 767: { slidesPerView: 2 } }}
          className="swiper-listing-details overflow-visible"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <GallerySlideContent image={image} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
