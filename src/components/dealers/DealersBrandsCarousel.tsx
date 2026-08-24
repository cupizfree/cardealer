"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Migrated from ../aurexo/dealers-listing.html lines 869-975. `.out-brand-3` (image + name + address,
// wrapped as one link) is a genuinely different card shape from about-us.html's `.out-brand-4`
// (`Brands.tsx`, image + name only) — a separate component, not a variant. Config matches
// `.swiper-outbrand-4` in ../aurexo/assets/js/swiper.js verbatim (spaceBetween 20, speed 800,
// responsive slidesPerView 1/1/2/3/5). Source repeats the same 5 brands twice (10 slides total, BMW
// through Volvo twice) — preserved as-is, not deduplicated, matching the demo-repeat precedent already
// established for about-us's testimonial slides.
const brands = [
  { name: "BMW", image: "/assets/images/brand/brand-13.png", address: "245 Bowery St, NY" },
  { name: "Mercedes", image: "/assets/images/brand/brand-14.png", address: "89 Rivington St, NY" },
  { name: "Audi", image: "/assets/images/brand/brand-15.png", address: "310 East Houston St, NY" },
  { name: "Toyota", image: "/assets/images/brand/brand-16.png", address: "402 Stanton St, LA" },
  { name: "Volvo", image: "/assets/images/brand/brand-17.png", address: "537 Orchard St, LA" },
  { name: "BMW", image: "/assets/images/brand/brand-13.png", address: "245 Bowery St, NY" },
  { name: "Mercedes", image: "/assets/images/brand/brand-14.png", address: "89 Rivington St, NY" },
  { name: "Audi", image: "/assets/images/brand/brand-15.png", address: "310 East Houston St, NY" },
  { name: "Toyota", image: "/assets/images/brand/brand-16.png", address: "402 Stanton St, LA" },
  { name: "Volvo", image: "/assets/images/brand/brand-17.png", address: "537 Orchard St, LA" },
];

export default function DealersBrandsCarousel() {
  return (
    <>
      <div className="container wow fadeInUp" data-wow-delay="0.1s">
        <div className="flex justify-center mb-40">
          <h2 className="">Dealers Brands</h2>
        </div>
      </div>
      <div className="container wow fadeIn" data-wow-delay="0.3s">
        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          speed={800}
          spaceBetween={20}
          pagination={{ el: ".pagination-swiper-outbrand-4", clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            400: { slidesPerView: 1, slidesPerGroup: 1 },
            600: { slidesPerView: 2, slidesPerGroup: 2 },
            991: { slidesPerView: 3, slidesPerGroup: 3 },
            1280: { slidesPerView: 5, slidesPerGroup: 5 },
          }}
          className="swiper-container swiper-outbrand-4"
        >
          {brands.map((brand, index) => (
            <SwiperSlide key={index}>
              <Link href="/listing-grid4-columns" className="out-brand-3">
                <Image className="out-brand--image" src={brand.image} alt="brand" width={436} height={280} />
                <p className="h5 mb-4">{brand.name}</p>
                <p className="text-secondary text-sm">{brand.address}</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-pagination pagination-dark pagination-style pagination-swiper-outbrand-4 mt-38" />
      </div>
    </>
  );
}
