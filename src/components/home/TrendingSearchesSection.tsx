"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import ListingCardDark from "@/components/listing/ListingCardDark";
import { allListings } from "@/data/listings";
import type { ListingCardData } from "@/data/listings";

const l13 = allListings.find((l) => l.id === 13)!;
const l14 = allListings.find((l) => l.id === 14)!;
const l15 = allListings.find((l) => l.id === 15)!;

// Migrated from ../aurexo/index.html lines 2576-3095 (`.swiper-card`, `.card-box-style-2`). Source's
// 6 slides are really only 4 distinct cards: slides 1/5 both repeat id 13, slides 2/6 both repeat id
// 14 (confirmed via full source read) — those 2 literal repeats are collapsed here rather than
// rendered twice. The 4th slide is a genuine, disclosed one-off source content bug: it reuses id 14's
// title text ("Mercedes-AMG C-Class") over a different image/brand/price (card-10.jpg/Porsche/
// $18.200,00) that matches no real canonical record — rendered as its own literal `ListingCardData`
// override rather than invented into `allListings` as a 4th record.
const mercedesTitleOverSourceMismatch: ListingCardData = {
  ...l14,
  image: "/assets/images/card/card-10.jpg",
  brandLabel: "Porsche",
  badge: undefined,
  price: "Rp 273.000.000",
};

const SLIDES: ListingCardData[] = [l13, l14, l15, mercedesTitleOverSourceMismatch];

// home-09.html reuses this exact same section with its own 5-slide sequence (l13, l14, l15, l14, l14 —
// confirmed via title read, no 4th "Mercedes over mismatch" content-bug slide here), a lowercase
// heading ("Pencarian populer di sekitar Anda", not "Trending Searches Near You"), and its own real `radius-40`
// section modifier (same page-wide signature as its other sections) — exposed via `heading`/`slides`/
// `sectionExtraClassName` props. Its own cards also use `divider-blur mb-14` (not `mb-16`, confirmed via
// source diff) — threaded through via `ListingCardDark`'s own `dividerClassName` prop. Source's
// per-card title/view-details links here are a real, chaotic mix of working `listing-details-1.html`
// and literal dead `#` hrefs (confirmed via source read, no consistent pattern) — treated as decorative
// demo noise and not reproduced at the link level, same class of simplification already applied to
// other repeated-placeholder sections in this migration (e.g. this component's own existing
// `mercedesTitleOverSourceMismatch` handling).
//
// Retroactive fix: this `.swiper-card` config had wrong breakpoints (`575/767/1280` → `2/3/4`) and
// wrong `spaceBetween` (16) — the real config (`assets/js/swiper.js` lines 79-118) is
// `spaceBetween: 30` with breakpoints `767/991/1280` → `2/3/4` (each paired with a matching
// `slidesPerGroup`), same copy-paste error found and fixed identically in
// `home-02/PopularSearchesSection.tsx` and `home-03/PopularSearchesCarousel.tsx`.
//
// Retroactive fix: the "Lihat Semua" button was missing its real icon (a circular-arrow SVG, confirmed
// present in index.html's own source) — added back as the default `viewAllIcon`.
const VIEW_ALL_ICON = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 1.875C8.39303 1.875 6.82214 2.35152 5.486 3.24431C4.14985 4.1371 3.10844 5.40605 2.49348 6.8907C1.87852 8.37535 1.71762 10.009 2.03112 11.5851C2.34463 13.1612 3.11846 14.6089 4.25476 15.7452C5.39106 16.8815 6.8388 17.6554 8.4149 17.9689C9.99099 18.2824 11.6247 18.1215 13.1093 17.5065C14.594 16.8916 15.8629 15.8502 16.7557 14.514C17.6485 13.1779 18.125 11.607 18.125 10C18.1227 7.84581 17.266 5.78051 15.7427 4.25727C14.2195 2.73403 12.1542 1.87727 10 1.875ZM13.5672 10.4422L11.0672 12.9422C10.9499 13.0595 10.7909 13.1253 10.625 13.1253C10.4592 13.1253 10.3001 13.0595 10.1828 12.9422C10.0655 12.8249 9.99966 12.6659 9.99966 12.5C9.99966 12.3341 10.0655 12.1751 10.1828 12.0578L11.6164 10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H11.6164L10.1828 7.94219C10.0655 7.82491 9.99966 7.66585 9.99966 7.5C9.99966 7.33415 10.0655 7.17509 10.1828 7.05781C10.3001 6.94054 10.4592 6.87465 10.625 6.87465C10.7909 6.87465 10.9499 6.94054 11.0672 7.05781L13.5672 9.55781C13.6253 9.61586 13.6714 9.68479 13.7029 9.76066C13.7343 9.83654 13.7505 9.91787 13.7505 10C13.7505 10.0821 13.7343 10.1635 13.7029 10.2393C13.6714 10.3152 13.6253 10.3841 13.5672 10.4422Z"
      fill="white"
    />
  </svg>
);

export default function TrendingSearchesSection({
  heading = "Pencarian Populer di Sekitar Anda",
  slides = SLIDES,
  sectionExtraClassName,
  cardDividerClassName,
}: {
  heading?: string;
  slides?: ListingCardData[];
  sectionExtraClassName?: string;
  cardDividerClassName?: string;
}) {
  return (
    <section className={`py-100 bg-primary${sectionExtraClassName ? ` ${sectionExtraClassName}` : ""}`}>
      <div className="container wow fadeIn" data-wow-delay="0.3s">
        <div className="title-section mb-40 wow fadeInUp" data-wow-delay="0.1s">
          <h2 className="text-white">{heading}</h2>
          <Link href="/listing-grid4-columns" className="btn btn-line-blur effect-line-white hover-fill-primary font-weight-600 btn-large">
            Lihat Semua
            {VIEW_ALL_ICON}
          </Link>
        </div>

        <div className="swiper-container swiper-card">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            slidesPerGroup={1}
            spaceBetween={30}
            pagination={{ el: ".pagination-swiper-card", clickable: true }}
            breakpoints={{
              767: { slidesPerView: 2, slidesPerGroup: 2 },
              991: { slidesPerView: 3, slidesPerGroup: 3 },
              1280: { slidesPerView: 4, slidesPerGroup: 4 },
            }}
          >
            {slides.map((listing, index) => (
              <SwiperSlide key={index}>
                <ListingCardDark listing={listing} dividerClassName={cardDividerClassName} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-pagination pagination-white pagination-style pagination-swiper-card mt-38" />
        </div>
      </div>
    </section>
  );
}
