"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Controller, EffectFade, Pagination, Parallax } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";

const BANNERS = ["banner-4.jpg", "banner-2.jpg", "banner-3.jpg", "banner-5.jpg"];

// Migrated from ../aurexo/home-04.html lines 452-576 (`.page-title.page-title-style-1`). Genuinely
// different hero from `home/HeroSearchSection.tsx` — no search-filter bar at all, just a title/
// subtitle/CTA over a real photo carousel plus a 4-item spec badge row. Real behavior per
// `assets/js/swiper.js`: `.sw-single` (background, real parallax at 75% swiper width — same mechanism
// already reproduced in `HeroSearchSection.tsx`) is synced via Swiper's own `controller` module to a
// second `.sw-single-thumb` swiper holding the title/subtitle/CTA content (`swiperSingle.controller.
// control = swiperThumb` and vice versa). Source's own 4 content slides are byte-identical text
// ("Mercedes-Benz GLC Coupe 2024" every time) — kept as a real controlled 2-swiper sync (not collapsed
// to static content) since other home variants sharing this exact `page-title-style-1` markup
// (home-05/06/09/10/11.html, not yet migrated) may need genuinely different per-slide text later.
export default function HeroBannerSlider() {
  const [bgSwiper, setBgSwiper] = useState<SwiperClass | null>(null);
  const [thumbSwiper, setThumbSwiper] = useState<SwiperClass | null>(null);
  const [parallaxValue, setParallaxValue] = useState<number | null>(null);

  return (
    <section className="page-title flex h-800 page-title-style-1 effect-content-slide effect-2">
      <div className="swiper-container page-title--slider sw-single">
        <Swiper
          modules={[Autoplay, Controller, Pagination, Parallax]}
          loop
          speed={1000}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ el: ".pagination-page-title--slider-1", clickable: true }}
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
        <div className="swiper-pagination pagination-white pagination-style pagination-page-title--slider-1" />
      </div>

      <div className="page-title--content thumb effect-zoom-item">
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
              <h1 className="page-title--title text-white mb-16 effect-item effect-left delay-3">
                Mercedes-Benz GLC Coupe 2024
              </h1>
              <p className="h3 sub-title text-white mb-36 capitalize effect-item effect-left delay-4">
                $490/Month for 24 mont <span className="h7 font-weight-500 text-white">(0% APR Representativ)</span>
              </p>
              <Link
                href="/listing-grid4-columns"
                className="btn btn-white text-primary btn-large-2 font-weight-600 max-w-min capitalize effect-item effect-left delay-5"
              >
                Discovery Now
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="page-title--post-list">
        <Link href="/listing-grid4-columns" className="item wow fadeInUp">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.5 30L40.5 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M10.5825 30C10.5276 29.5019 10.5 29.0011 10.5 28.5C10.5018 26.3575 11.0131 24.2462 11.9917 22.3403C12.9702 20.4343 14.388 18.7884 16.128 17.5384C17.868 16.2884 19.8803 15.47 21.9988 15.1509C24.1174 14.8318 26.2815 15.0211 28.3125 15.7031"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M41.367 19.6208C42.5697 21.9806 43.2809 24.5601 43.4575 27.2029C43.6342 29.8457 43.2725 32.4969 42.3945 34.9958C42.2919 35.2903 42.1001 35.5456 41.8457 35.7261C41.5913 35.9066 41.287 36.0032 40.9751 36.0027H7.02446C6.71197 36.0013 6.40761 35.903 6.15337 35.7213C5.89914 35.5396 5.70756 35.2835 5.60508 34.9883C4.85514 32.8558 4.48145 30.6093 4.50071 28.3489C4.58321 17.6258 13.4501 8.90515 24.1882 9.00078C27.2148 9.02507 30.1939 9.75572 32.8882 11.1345"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="h5 item-title">125 KW/170 KS</p>
        </Link>
        <Link href="/listing-grid4-columns" className="item wow fadeInUp" data-wow-delay="0.2s">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M39 7.5H9C8.17157 7.5 7.5 8.17157 7.5 9V39C7.5 39.8284 8.17157 40.5 9 40.5H39C39.8284 40.5 40.5 39.8284 40.5 39V9C40.5 8.17157 39.8284 7.5 39 7.5Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M33 4.5V10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 4.5V10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 16.5H40.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M24 26.625C25.0355 26.625 25.875 25.7855 25.875 24.75C25.875 23.7145 25.0355 22.875 24 22.875C22.9645 22.875 22.125 23.7145 22.125 24.75C22.125 25.7855 22.9645 26.625 24 26.625Z"
              fill="white"
            />
            <path
              d="M32.25 26.625C33.2855 26.625 34.125 25.7855 34.125 24.75C34.125 23.7145 33.2855 22.875 32.25 22.875C31.2145 22.875 30.375 23.7145 30.375 24.75C30.375 25.7855 31.2145 26.625 32.25 26.625Z"
              fill="white"
            />
            <path
              d="M15.75 34.125C16.7855 34.125 17.625 33.2855 17.625 32.25C17.625 31.2145 16.7855 30.375 15.75 30.375C14.7145 30.375 13.875 31.2145 13.875 32.25C13.875 33.2855 14.7145 34.125 15.75 34.125Z"
              fill="white"
            />
            <path
              d="M24 34.125C25.0355 34.125 25.875 33.2855 25.875 32.25C25.875 31.2145 25.0355 30.375 24 30.375C22.9645 30.375 22.125 31.2145 22.125 32.25C22.125 33.2855 22.9645 34.125 24 34.125Z"
              fill="white"
            />
            <path
              d="M32.25 34.125C33.2855 34.125 34.125 33.2855 34.125 32.25C34.125 31.2145 33.2855 30.375 32.25 30.375C31.2145 30.375 30.375 31.2145 30.375 32.25C30.375 33.2855 31.2145 34.125 32.25 34.125Z"
              fill="white"
            />
          </svg>
          <p className="h5 item-title">2022</p>
        </Link>
        <Link href="/listing-grid4-columns" className="item wow fadeInUp" data-wow-delay="0.3s">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.5 40.5V10.5C10.5 9.70435 10.8161 8.94129 11.3787 8.37868C11.9413 7.81607 12.7044 7.5 13.5 7.5H28.5C29.2956 7.5 30.0587 7.81607 30.6213 8.37868C31.1839 8.94129 31.5 9.70435 31.5 10.5V40.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M6 40.5H36" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M31.5 21H36C36.7956 21 37.5587 21.3161 38.1213 21.8787C38.6839 22.4413 39 23.2044 39 24V31.5C39 32.2956 39.3161 33.0587 39.8787 33.6213C40.4413 34.1839 41.2044 34.5 42 34.5C42.7956 34.5 43.5587 34.1839 44.1213 33.6213C44.6839 33.0587 45 32.2956 45 31.5V16.2431C45.0001 15.8489 44.9224 15.4586 44.7715 15.0944C44.6207 14.7302 44.3995 14.3993 44.1206 14.1206L40.5 10.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M25.5 21H16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="h5 item-title">Diesel</p>
        </Link>
        <Link href="/listing-grid4-columns" className="item wow fadeInUp" data-wow-delay="0.4s">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4.5 33V28.7119C4.5 17.9344 13.1531 9.0375 23.9306 9C26.4972 8.99087 29.0404 9.48851 31.4143 10.4644C33.7881 11.4403 35.946 12.8752 37.7641 14.6868C39.5822 16.4985 41.0247 18.6512 42.009 21.0216C42.9933 23.392 43.5 25.9334 43.5 28.5V33C43.5 33.3978 43.342 33.7794 43.0607 34.0607C42.7794 34.342 42.3978 34.5 42 34.5H6C5.60218 34.5 5.22064 34.342 4.93934 34.0607C4.65804 33.7794 4.5 33.3978 4.5 33Z"
              stroke="#F7F7F7"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M24 9V15" stroke="#F7F7F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19.5 34.5L31.5 18" stroke="#F7F7F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M37.5 25.5H43.2712" stroke="#F7F7F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.76172 25.5H10.5011" stroke="#F7F7F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="h5 item-title">45000 Km</p>
        </Link>
      </div>
    </section>
  );
}
