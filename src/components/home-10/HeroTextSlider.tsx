"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

const BANNERS = ["banner-10.jpg", "banner-1.jpg", "banner-2.jpg", "banner-3.jpg"];

// Migrated from ../aurexo/home-10.html lines 449-525 (`.page-title.page-title-style-8`). Genuinely new
// hero shape — neither `home/HeroSearchSection.tsx`'s search-filter-bar layout nor
// `home-04/HeroBannerSlider.tsx`'s dual-synced background/content swipers: this is a SINGLE swiper
// where each slide bundles its own background image AND text/CTA overlay together (confirmed via
// source read — `.tp-showcase-slider-bg` and `.page-title--slider-content` are siblings inside the same
// `.swiper-slide`, not two separately-synced swipers). All 4 slides repeat the identical text/price/CTA
// ("Mercedes-Maybach S-Class Haute Voiture", "$490/Month for 24 mont (0% APR Representativ)" — both a
// real, disclosed source typo, kept verbatim — "Lihat Unit" → listing-details-1.html), only the
// background image differs (banner-10,1,2,3 — `banner-10.jpg` is a real, page-specific image not used
// elsewhere). No nav arrows (confirmed via grep — only bullet pagination). Wrapped in its own `.px-15`
// padding div and real `radius-20` rounded corners, matching source's own structure.
export default function HeroTextSlider() {
  return (
    <div className="px-15">
      <section className="page-title page-title-style-8 flex radius-20 mx-auto relative effect-content-slide effect-2 overflow-hidden">
        <div className="swiper-container page-title--slider sw-single radius-20">
          <Swiper
            modules={[Autoplay, Pagination]}
            loop
            speed={1000}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ el: ".pagination-page-title--slider-1", clickable: true }}
            className="h-full"
          >
            {BANNERS.map((file) => (
              <SwiperSlide key={file}>
                <div
                  className="tp-showcase-slider-bg"
                  style={{ backgroundImage: `url(/assets/images/page-title/${file})` }}
                />

                <div className="page-title--slider-content style-1 delay-3">
                  <h1 className="search-cars__title effect-item effect-left delay-4">
                    Toyota Fortuner VRZ <br className="lg-hidden" /> Diesel 2021
                  </h1>
                  <p className="h3 sub-title text-white mb-36 capitalize effect-item effect-left delay-5">
                    Rp 8.150.000/bulan, tenor 24 bulan <span className="h7 font-weight-500 text-white">(bunga 0%)</span>
                  </p>
                  <div className="btn-wrap effect-item effect-left delay-6">
                    <Link href="/listing-details/toyota-fortuner-vrz-2021" className="btn btn-white text-primary btn-large-2 font-weight-600 max-w-min capitalize">
                      Lihat Unit
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="swiper-pagination pagination-white pagination-style pagination-page-title--slider-1 mt-38" />
      </section>
    </div>
  );
}
