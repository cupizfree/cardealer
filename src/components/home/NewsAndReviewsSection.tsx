"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Migrated from ../aurexo/index.html lines 3397-3458 (`.swiper-news`, `.post-effect-style-1`). All 3
// slides share the identical real title "2025 BMW 5 Series Priced From $59,375; i5 EV From $68,275"
// (confirmed via source read) — the same recurring article already added as id 13 in blogPosts.ts —
// so all 3 link to that one real slug. Own literal `post-1/2/3.jpg` images and NEWS/Expert Review
// category labels (distinct from `RelatedArticles.tsx`'s own post-4/5/6.jpg override for the same
// article, and from `post-style-2`'s dark-overlay skin — this section uses the lighter
// `post-effect-style-1` card, a genuine DOM difference, not duplicated by mistake).
const SLUG = "2025-bmw-5-series-priced";

// Retroactive fix: real `.swiper-news` config (`assets/js/swiper.js`) bumps to 3 columns at 991px, not
// 1280px as previously coded — same copy-paste breakpoint-threshold error already found and fixed for
// `.swiper-card`/`.swiper-car-box`/etc. (COMPONENT_MAP.md #81).
const SLIDES = [
  { image: "/assets/images/blog/post-1.jpg", category: "NEWS" },
  { image: "/assets/images/blog/post-2.jpg", category: "Expert Review" },
  { image: "/assets/images/blog/post-3.jpg", category: "Expert Review" },
];
const TITLE = "2025 BMW 5 Series Priced From $59,375; i5 EV From $68,275";

export default function NewsAndReviewsSection() {
  return (
    <section className="py-100">
      <div className="container wow fadeIn" data-wow-delay="0.3s">
        <div className="title-section mb-28 wow fadeInUp">
          <h2 className="">News & Reviews</h2>
          <Link href="/blog-list" className="btn btn-line-style-2 effect-line-primary hover-fill-white btn-large">
            View All
          </Link>
        </div>

        <div className="swiper-container swiper-news">
          <Swiper
            modules={[Pagination]}
            spaceBetween={30}
            pagination={{ el: ".pagination-swiper-news", clickable: true }}
            breakpoints={{
              0: { slidesPerView: 1 },
              767: { slidesPerView: 2 },
              991: { slidesPerView: 3 },
            }}
          >
            {SLIDES.map((slide, index) => (
              <SwiperSlide key={index}>
                <Link href={`/blog-details-1/${SLUG}`} className="post post-effect-style-1 overflow-hidden">
                  <Image className="post--img" src={slide.image} alt="news" width={410} height={280} />
                  <div className="content border-top-none border-light">
                    <p className="h5 mb-4 title clamp clamp-2">{TITLE}</p>
                    <div className="tags clamp clamp-1">
                      <span>by Admin</span>
                      <span>Aug. 5, 2025</span>
                      <span className="text-highlight uppercase">{slide.category}</span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-pagination pagination-dark pagination-style pagination-swiper-news mt-35" />
        </div>
      </div>
    </section>
  );
}
