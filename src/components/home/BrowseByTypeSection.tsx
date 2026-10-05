"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import ParallaxImage from "@/components/common/ParallaxImage";
import { CAR_TYPE_ICONS } from "./carTypeIcons";

const CAR_TYPES = [
  "Listrik",
  "Sedan",
  "Hatchback",
  "SUV",
  "Crossover",
  "Pikap",
  "Coupe",
  "Konvertibel",
  "Wagon",
  "Minivan",
];

// Migrated from ../aurexo/index.html lines 2309-2509 (`.swiper-brand`). Source's `img.parallax`
// background gets a real scroll effect from `assets/js/simpleParallaxVanilla.umd.js` — see
// `common/ParallaxImage.tsx` for the reproduction.
export default function BrowseByTypeSection() {
  return (
    <section className="py-100 relative">
      <ParallaxImage src="/assets/images/brand/banner-brand.png" />

      <div className="container wow fadeIn relative" data-wow-delay="0.2s">
        <div className="title-section mb-40">
          <h2 className="text-white text-center">Cari Berdasarkan Tipe</h2>
          <Link href="/listing-grid4-columns" className="btn btn-blur hover-fill-primary font-weight-600 btn-large">
            Lihat Semua Tipe
          </Link>
        </div>

        <div className="swiper-brand-wrapper">
          <Swiper
            modules={[Pagination]}
            slidesPerView={2}
            spaceBetween={16}
            pagination={{ el: ".pagination-swiper-brand", clickable: true }}
            breakpoints={{
              575: { slidesPerView: 3 },
              767: { slidesPerView: 4 },
              991: { slidesPerView: 6 },
              1280: { slidesPerView: 8 },
            }}
            className="swiper-container swiper-brand"
          >
            {CAR_TYPES.map((type) => (
              <SwiperSlide key={type}>
                <Link className="brand-item" href="/listing-grid4-columns">
                  {CAR_TYPE_ICONS[type] ?? null}
                  {type}
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="swiper-pagination pagination-white pagination-style pagination-absolute pagination-swiper-brand" />
    </section>
  );
}
