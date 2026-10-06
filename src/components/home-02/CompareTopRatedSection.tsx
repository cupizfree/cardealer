"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useModal } from "@/components/common/ModalProvider";

export type CompareTopRatedPair = {
  images: [string, string];
  /** `title` accepts any ReactNode — home-09.html's own pairs 2/3 have a literal mid-string `<br>`
   *  ("2022 Jeep Grand <br> Cherokee Overland", confirmed via source diff). */
  left: { brand: string; title: React.ReactNode; price: string };
  right: { brand: string; title: React.ReactNode; price: string };
  /** home-03.html's own first pair has a real `<a href="compare.html">` CTA instead of the
   *  `open-modal`→`#CardModal` span every other pair (here and on home-02.html) uses — confirmed via
   *  source diff. When set, renders a plain link instead of the modal-opener. */
  ctaHref?: string;
};

// Migrated from ../aurexo/home-02.html lines 3935-4086 (`.swiper-card-2`, `.card-box-style-4`). Fixed,
// static teaser pairs — NOT the user's live compare list (that's `compare/CompareTable.tsx`, driven by
// `CompareProvider`). Source's own brand labels don't match either car in a pair ("TESLA" shown under
// both a Tesla AND a Ford; "Honda"/"Camry" under a Jeep/Toyota pair) and "2022 Toyota 4Runner Limited"
// here uses a different image/price than the real listing of the same title elsewhere on this page —
// real, disclosed template bugs, preserved verbatim rather than reconciled against `allListings`. Only
// 2 distinct pairs exist; source repeats them across 4 slides — reproduced as 2 slides, not duplicated.
// "Bandingkan" opens the same static `#CardModal` every "Bandingkan Unit Terbaik"/"Trending" card
// already opens elsewhere in the app (its own content is fixed regardless of trigger, confirmed via
// source read) — no new modal needed.
//
// home-03.html reuses this exact section with a 3rd pair, its own `card-box-style-7 style2`/
// `swiper-card-3` classes (not `card-box-style-4`/`swiper-card-2`), and pair 1's CTA as a real link —
// all exposed as props below rather than forking the component (see `home-03/page.tsx`'s own usage).
//
// Retroactive fix: the Swiper breakpoints were hardcoded (`767: {slidesPerView: 2}`) and `spaceBetween`
// was wrong (16) for BOTH variants. Real configs (`assets/js/swiper.js`): `.swiper-card-2` (home-02) is
// `spaceBetween: 30`, 1 column until 991px then 2 — NOT 2 at 767px as previously hardcoded.
// `.swiper-card-3` (home-03) is also `spaceBetween: 30`, 1 column until 767px, 2 from 767px, and a real
// 3rd column from 1199px that the previous hardcoded breakpoints never reached at all (capped at 2 on
// every viewport). Now a `breakpoints` prop (defaulting to `.swiper-card-2`'s real config) lets
// home-03.html's page pass its own distinct `.swiper-card-3` breakpoints instead of sharing home-02's.
//
// RETROACTIVE FIX (found while checking home-06's own "Bandingkan Unit Terbaik" button): the "View
// All" link never rendered its real icon — confirmed present (the same circular-arrow SVG used
// elsewhere) in EVERY page's own source that reuses this component: home-02.html (line 3942, the
// component's own base), home-03.html, home-06.html, home-09.html, home-10.html — all byte-identical.
// Fixed once (new `VIEW_ALL_ICON` constant), fixing all 5 pages at once. 5th occurrence of this exact
// missing-icon bug pattern this session.
//
// SECOND retroactive fix, same investigation: home-03.html's/home-06.html's own real `title-section` is
// `mb-42 wow fadeInDown` (confirmed via source diff) — NOT this component's own default `mb-40 wow
// fadeInUp`, which is only correct for home-02.html itself. Neither page's `page.tsx` was passing
// `titleSectionClassName` at all, so both silently inherited the wrong (home-02-only) default. Fixed by
// passing the real value explicitly from both pages (home-09/home-10 were already doing this correctly
// with their own distinct values, `mb-12`/`mb-14 wow fadeInDown`).
const DEFAULT_BREAKPOINTS = { 991: { slidesPerView: 2, slidesPerGroup: 2 } };

const DEFAULT_PAIRS: CompareTopRatedPair[] = [
  {
    images: ["/assets/images/card/card-21.png", "/assets/images/card/card-22.png"],
    left: { brand: "TESLA", title: "2024 Tesla Model Y", price: "Rp 674.000.000" },
    right: { brand: "TESLA", title: "2024 Ford Mustang Mach-E", price: "Rp 644.000.000" },
  },
  {
    images: ["/assets/images/card/card-23.png", "/assets/images/card/card-24.png"],
    left: { brand: "Honda", title: "2022 Jeep Grand Cherokee Overland", price: "Rp 674.000.000" },
    right: { brand: "Camry", title: "2022 Toyota 4Runner Limited", price: "Rp 644.000.000" },
  },
];

// Same circular-arrow icon reused for "Lihat Semua Merek" on `home/BrandsSection.tsx` and "Check All Car
// Type" on `home-03/BrowseByTypePhotoCards.tsx` — confirmed byte-identical SVG path across all 3.
const VIEW_ALL_ICON = (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z"
      fill="#1C1C1C"
    />
  </svg>
);

function CompareGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.875 10H13.125" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 6.875V13.125" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CompareTopRatedSection({
  pairs = DEFAULT_PAIRS,
  cardClassName = "card-box-style-4",
  titleClassName = "h7 mb-4",
  swiperClassName = "swiper-card-2",
  paginationClass = "pagination-swiper-card-2",
  breakpoints = DEFAULT_BREAKPOINTS,
  sectionClassName = "background-light py-100",
  titleSectionClassName = "mb-40 wow fadeInUp",
  contentClassName,
}: {
  pairs?: CompareTopRatedPair[];
  cardClassName?: string;
  titleClassName?: string;
  swiperClassName?: string;
  paginationClass?: string;
  breakpoints?: Record<number, { slidesPerView: number; slidesPerGroup?: number }>;
  /** home-09.html's own section is `bg-white py-100` (not `background-light`, confirmed via source
   *  diff — every other caller genuinely is `background-light`). */
  sectionClassName?: string;
  /** home-09.html's own title-section is `mb-12 wow fadeInDown` (not `mb-40 wow fadeInUp`, confirmed
   *  via source diff). */
  titleSectionClassName?: string;
  /** home-09.html's own `.content` div carries a real `style-2` modifier neither other caller has
   *  (confirmed via source diff). */
  contentClassName?: string;
}) {
  const { openModal } = useModal();

  return (
    <section className={sectionClassName}>
      <div className="container relative wow fadeIn" data-wow-delay="0.1s">
        <div className={`title-section ${titleSectionClassName}`}>
          <h2>Bandingkan Unit Terbaik</h2>
          <Link href="/listing-grid4-columns" className="btn btn-line-style-2 effect-line-primary btn-large hover-fill-white">
            Lihat Semua
            {VIEW_ALL_ICON}
          </Link>
        </div>

        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          slidesPerGroup={1}
          spaceBetween={30}
          pagination={{ el: `.${paginationClass}`, clickable: true }}
          breakpoints={breakpoints}
          className={`swiper-container ${swiperClassName}`}
        >
          {pairs.map((pair, index) => (
            <SwiperSlide key={index}>
              <div className={cardClassName}>
                <div className="image">
                  <Image className="w-full" src={pair.images[0]} alt="car" width={220} height={160} />
                  <Image className="w-full" src={pair.images[1]} alt="car" width={220} height={160} />
                </div>
                <div className={`content${contentClassName ? ` ${contentClassName}` : ""}`}>
                  <div className="flex justify-between gap-12 mb-10">
                    <div>
                      <p className="text-xs uppercase text-underline text-muted mb-4">{pair.left.brand}</p>
                      <p className={titleClassName}>{pair.left.title}</p>
                      <p className="h6">{pair.left.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase text-underline text-muted mb-4">{pair.right.brand}</p>
                      <p className={titleClassName}>{pair.right.title}</p>
                      <p className="h6">{pair.right.price}</p>
                    </div>
                  </div>
                  {pair.ctaHref ? (
                    <Link href={pair.ctaHref} className="btn btn-small btn-line-1 text-sm">
                      <CompareGlyph />
                      Bandingkan
                    </Link>
                  ) : (
                    <span
                      className="btn btn-small btn-line-1 text-sm cursor-pointer"
                      onClick={() => openModal("CardModal")}
                    >
                      <CompareGlyph />
                      Bandingkan
                    </span>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={`swiper-pagination pagination-dark pagination-style ${paginationClass} mt-35`} />
      </div>
    </section>
  );
}
