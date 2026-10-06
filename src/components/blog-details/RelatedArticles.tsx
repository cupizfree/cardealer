"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Migrated from ../aurexo/blog-details-1.html lines 1043-1103, also reused verbatim by
// blog-details-2.html (byte-identical 3 slides — same images/categories/repeated title, confirmed via
// source diff — the only real difference is a centered heading there, exposed as the `centered` prop).
// Source's own 3 slides are byte-identical except for image and category label (all 3 titles read
// "BMW Seri 5 2025 Dibanderol Mulai Rp 950 Juta; i5 EV Mulai Rp 1,1 Miliar", confirmed via direct source read) — a
// single repeated placeholder article, not 3 distinct ones, so all 3 link to the ONE real stub entry
// added for it (id 13 in `blogPosts.ts`) rather than 3 needlessly-identical slugs. Per explicit user
// request (matching the same fix already applied to the "Artikel terbaru" sidebar widget), this replaces
// the previous literal `/blog-details-2` href — which, conveniently, is also blog-details-2.html's own
// real href for this exact widget (it points back at `blog-details-1.html`), so no per-page href
// variance was needed at all once this fix landed.
//
// Retroactive fix: real `.swiper-news` config (`assets/js/swiper.js`) bumps to 3 columns at 991px, not
// 1280px as previously coded — same copy-paste breakpoint-threshold error already found and fixed for
// `.swiper-card`/`.swiper-car-box`/etc. (COMPONENT_MAP.md #81).
const DEFAULT_SLIDES = [
  { image: "/assets/images/blog/post-4.jpg", category: "Ulasan Ahli" },
  { image: "/assets/images/blog/post-5.jpg", category: "BERITA" },
  { image: "/assets/images/blog/post-6.jpg", category: "BERITA" },
];
const TITLE = "BMW Seri 5 2025 Dibanderol Mulai Rp 950 Juta; i5 EV Mulai Rp 1,1 Miliar";
const SLUG = "2025-bmw-5-series-priced";

const DEFAULT_BREAKPOINTS = { 0: { slidesPerView: 1 }, 767: { slidesPerView: 2 }, 991: { slidesPerView: 3 } };

export default function RelatedArticles({
  centered = false,
  heading = "Artikel Terkait",
  viewAllHref,
  slides = DEFAULT_SLIDES,
  bare = false,
  swiperClassName = "swiper-news",
  paginationClass = "pagination-swiper-news",
  breakpoints = DEFAULT_BREAKPOINTS,
}: {
  centered?: boolean;
  heading?: string;
  /** home-02.html's own "News & Reviews" reuse of this exact widget swaps the subtitle paragraph for
   *  a "Lihat Semua" link instead (confirmed via source diff — same swiper/slide content otherwise). */
  viewAllHref?: string;
  /** home-04.html's own "News & Reviews" reuse of this exact widget has its own distinct image/category
   *  set (post-7/8/9.jpg, NEWS/Expert Review/NEWS — confirmed via source diff), same repeated-title
   *  placeholder pattern otherwise. Defaults to blog-details-1/2's own post-4/5/6 set. */
  slides?: { image: string; category: string }[];
  /** home-04.html's own "News & Reviews" reuse shares ONE `py-100 bg-white` section with the preceding
   *  promo banner + icon carousel (confirmed via source diff — a single `py-100` wraps all three, not
   *  three separately-padded sections). `bare` skips this component's own `<section>` wrapper so the
   *  caller can own that shared outer section instead. */
  bare?: boolean;
  /** home-06.html's own "News & Reviews" reuse is a real, distinct `.swiper-news-2` config (only 2
   *  slides, max 2 columns — `assets/js/swiper.js`'s own `.swiper-news-2` breakpoints are
   *  `0/400/767` → `1/1/2`) — exposed via these 3 props rather than forking the component. */
  swiperClassName?: string;
  paginationClass?: string;
  breakpoints?: Record<number, { slidesPerView: number }>;
}) {
  const content = (
    <>
      <div className="container">
        {viewAllHref ? (
          <div className="title-section mb-40 wow fadeInUp" data-wow-delay="0.1s">
            <h2 className="">{heading}</h2>
            <Link href={viewAllHref} className="btn btn-line-style-2 effect-line-primary hover-fill-white btn-large">
              Lihat Semua
            </Link>
          </div>
        ) : (
          <>
            <h2 className={centered ? "mb-12 text-center" : "mb-12"}>{heading}</h2>
            <p className={centered ? "h7 text-secondary mb-40 text-center" : "h7 text-secondary mb-40"}>
              Dapatkan wawasan terbaru, tips ahli, dan kabar terkini agar tetap update.
            </p>
          </>
        )}
        <div className={`swiper-container ${swiperClassName}`}>
          <Swiper
            modules={[Pagination]}
            spaceBetween={30}
            pagination={{ el: `.${paginationClass}`, clickable: true }}
            breakpoints={breakpoints}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <Link href={`/blog-details-1/${SLUG}`} className="post-style-2 overflow-hidden">
                  <Image className="post--img flex" src={slide.image} alt="news" width={410} height={280} />
                  <div className="content">
                    <p className="h5 text-white mb-8 title">{TITLE}</p>
                    <div className="flex gap-8 justify-start">
                      <span className="text-white text-xs">oleh Admin</span>
                      <span className="text-white text-xs">5 Agu 2025</span>
                      <span className="text-xs text-highlight uppercase text-underline">{slide.category}</span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={`swiper-pagination pagination-dark pagination-style ${paginationClass} mt-35`} />
        </div>
      </div>
    </>
  );

  return bare ? content : <section className="py-100">{content}</section>;
}
