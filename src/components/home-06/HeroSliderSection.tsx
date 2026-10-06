"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Controller, EffectFade, Navigation, Pagination, Parallax } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";

const BANNERS = ["banner-6.jpg", "banner-2.jpg", "banner-3.jpg", "banner-5.jpg"];

// Migrated from ../aurexo/home-06.html lines 572-648 (`.page-title.page-title-style-4.style-3`). A
// real 2-swiper Controller sync + real nav arrows, same mechanism as
// `home-05/HeroSearchSliderSection.tsx` — but genuinely simpler: NO filter bar at all inside this
// section (confirmed via source diff — home-06.html moves its tabs/filters into a wholly separate
// `bg-primary py-40` section below the hero instead, see `FilterBarSection.tsx`). Just the title/
// subtitle/CTA, real parallax background, and pagination dots.
export default function HeroSliderSection() {
  const [bgSwiper, setBgSwiper] = useState<SwiperClass | null>(null);
  const [thumbSwiper, setThumbSwiper] = useState<SwiperClass | null>(null);
  const [parallaxValue, setParallaxValue] = useState<number | null>(null);

  return (
    <section className="page-title page-title-style-4 style-3 flex effect-content-slide effect-2">
      <p className="swiper-btn navigation-prev">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.9487 2.71258C14.2097 2.97026 14.2335 3.37348 14.0199 3.65762L13.9487 3.73903L7.60622 10L13.9487 16.261C14.2097 16.5186 14.2335 16.9219 14.0199 17.206L13.9487 17.2874C13.6877 17.5451 13.2792 17.5685 12.9913 17.3577L12.9088 17.2874L6.04609 10.5132C5.78505 10.2555 5.76132 9.85232 5.9749 9.56818L6.04609 9.48678L12.9088 2.71258C13.196 2.42914 13.6615 2.42914 13.9487 2.71258Z"
            fill="white"
          />
        </svg>
      </p>
      <p className="swiper-btn navigation-next">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.0513 17.2874C5.79025 17.0297 5.76652 16.6265 5.98011 16.3424L6.0513 16.261L12.3938 10L6.0513 3.73903C5.79025 3.48135 5.76652 3.07813 5.98011 2.79399L6.0513 2.71258C6.31235 2.45491 6.72084 2.43148 7.00869 2.64231L7.09116 2.71258L13.9539 9.48678C14.215 9.74446 14.2387 10.1477 14.0251 10.4318L13.9539 10.5132L7.09116 17.2874C6.80401 17.5709 6.33845 17.5709 6.0513 17.2874Z"
            fill="white"
          />
        </svg>
      </p>

      <div className="swiper-container page-title--slider sw-single">
        <Swiper
          modules={[Autoplay, Controller, Navigation, Pagination, Parallax]}
          loop
          speed={1000}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ el: ".pagination-page-title--slider-1", clickable: true }}
          navigation={{ prevEl: ".navigation-prev", nextEl: ".navigation-next" }}
          parallax
          controller={{ control: thumbSwiper ?? undefined }}
          onSwiper={setBgSwiper}
          onInit={(swiper) => setParallaxValue(swiper.width * 0.75)}
          className="h-full"
        >
          {BANNERS.map((file) => (
            <SwiperSlide key={file}>
              <div
                className="tp-showcase-slider-bg"
                data-swiper-parallax={parallaxValue ?? undefined}
                style={{ backgroundImage: `url(/assets/images/page-title/${file})` }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="search-cars container margin-auto pb-44 thumb effect-zoom-item">
        <Swiper
          modules={[Controller, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          allowTouchMove={false}
          speed={2000}
          controller={{ control: bgSwiper ?? undefined }}
          onSwiper={setThumbSwiper}
          className="sw-single-thumb"
        >
          {BANNERS.map((file) => (
            <SwiperSlide key={file}>
              <h1 className="search-cars__title effect-item effect-left delay-3">Toyota Fortuner VRZ 2021</h1>
              <p className="h3 sub-title text-white mb-36 capitalize effect-item effect-left delay-4">
                Rp 7.350.000/bulan selama 24 bulan <span className="h7 font-weight-500 text-white">(bunga 0%)</span>
              </p>
              <Link
                href="/listing-grid4-columns"
                className="btn btn-white text-primary btn-large-2 font-weight-600 max-w-min capitalize effect-item effect-left delay-5"
              >
                Lihat Unit
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="swiper-pagination pagination-white pagination-style pagination-page-title--slider-1 mt-38" />
    </section>
  );
}
