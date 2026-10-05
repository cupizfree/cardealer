"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import type { ProductGalleryImage } from "@/data/products";

// Migrated from ../aurexo/product-details.html lines 494-545. Same main-swiper + thumbnail-strip
// swiper shape (and the exact same CSS classes: `swiper-listing-details-main`/
// `swiper-listing-details-thumbs`/`listing-details-item`/`listing-details-thumb`) as
// listing-details-3.html's own gallery — confirmed source reuses that template's markup wholesale for
// the shop page too. Not reusing `DetailsGalleryWithThumbs` verbatim though: this page's slides have NO
// "Putar Video"/"Lihat Semua Foto" overlay buttons at all (confirmed absent from source), so it's its own
// small component rather than adding a shop-specific prop to that already-focused listing-details
// component.
//
// Source's own gallery here is broken the same way listing-details-3's is: all 4 main-swiper slides
// show the identical `product-10.jpg` while the 4 thumbnails show 4 different images (only thumb 1
// actually matches). Since thumb-click-to-main-slide syncing is real, load-bearing behavior, this
// renders the SAME real image set for both sliders (`src/data/products.ts`'s `gallery` field) so
// clicking a thumbnail genuinely changes the main photo — not a re-transcription of the broken pairing.
export default function ProductGallery({ images }: { images: ProductGalleryImage[] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <>
      <Swiper
        modules={[Thumbs]}
        thumbs={{ swiper: thumbsSwiper }}
        spaceBetween={16}
        speed={500}
        className="swiper swiper-listing-details-main mb-20"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="listing-details-item main-item relative">
              <Image src={image.src} alt={image.alt} width={960} height={640} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        watchSlidesProgress
        slidesPerView={4}
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
