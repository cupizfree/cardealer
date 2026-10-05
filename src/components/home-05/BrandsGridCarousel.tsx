"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";

const BRANDS = [
  { name: "BMW", image: "/assets/images/brand/brand-1.png", vehicles: 18 },
  { name: "Mercedes", image: "/assets/images/brand/brand-2.png", vehicles: 22 },
  { name: "Audi", image: "/assets/images/brand/brand-3.png", vehicles: 38 },
  { name: "Honda", image: "/assets/images/brand/brand-4.png", vehicles: 29 },
  { name: "Toyota", image: "/assets/images/brand/brand-5.png", vehicles: 23 },
  { name: "Volvo", image: "/assets/images/brand/brand-6.png", vehicles: 32 },
  { name: "Ford", image: "/assets/images/brand/brand-7.png", vehicles: 24 },
  { name: "Huyndai", image: "/assets/images/brand/brand-8.png", vehicles: 22 },
  { name: "Kia", image: "/assets/images/brand/brand-9.png", vehicles: 14 },
  { name: "Mazda", image: "/assets/images/brand/brand-10.png", vehicles: 32 },
  { name: "Ferrari", image: "/assets/images/brand/brand-11.png", vehicles: 24 },
  { name: "Tesla", image: "/assets/images/brand/brand-12.png", vehicles: 27 },
];

// Migrated from ../aurexo/home-05.html lines 1571-1706 ("Explore Our Brands", `.swiper-outbrand-3`).
// A genuinely different variant from `home/BrandsSection.tsx`'s own `.swiper-outbrand` (6 brands,
// `.out-brand` card): 12 brands (including a real, disclosed source typo "Huyndai" for brand-8.png,
// kept verbatim), a different card class (`.out-brand-2`), and a real 2-row grid — `swiper.js`'s
// `.swiper-outbrand-3` config uses `slidesPerColumn: 2`/`slidesPerColumnFill: "row"` with breakpoints
// `375/575/767/991/1280` → `2/2/4/5/6` columns and `spaceBetween: 30`, reproduced via Swiper's `Grid`
// module (same pattern as #76/#78/#82/#84).
export default function BrandsGridCarousel() {
  return (
    <section className="bg-white py-100">
      <div className="container">
        <div className="title-section mb-42 wow fadeInDown" data-wow-delay="0.1s">
          <h2 className="">Jelajahi Merek Kami</h2>
          <Link href="/listing-grid4-columns" className="btn btn-line-style-2 effect-line-primary btn-large hover-fill-white">
            Lihat Semua Merek
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z"
                fill="#1C1C1C"
              />
            </svg>
          </Link>
        </div>
        <div className="swiper-container swiper-outbrand-3 wow fadeIn" data-wow-delay="0.1s">
          <Swiper
            modules={[Grid, Pagination]}
            slidesPerView={1}
            spaceBetween={30}
            grid={{ rows: 2, fill: "row" }}
            pagination={{ el: ".pagination-swiper-outbrand-3", clickable: true }}
            breakpoints={{
              375: { slidesPerView: 2 },
              767: { slidesPerView: 4 },
              991: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
          >
            {BRANDS.map((brand) => (
              <SwiperSlide key={brand.name}>
                <Link href="/listing-grid4-columns" className="out-brand-2">
                  <Image className="out-brand--img mb-8" src={brand.image} alt="brand" width={160} height={160} />
                  <p className="h5">{brand.name}</p>
                  <p className="text-muted text-sm">{brand.vehicles} Vehicles</p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-pagination pagination-dark pagination-style pagination-swiper-outbrand-3 mt-35" />
        </div>
      </div>
    </section>
  );
}
