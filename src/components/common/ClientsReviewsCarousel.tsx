"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

export type ClientTestimonial = {
  name: string;
  title: string;
  avatar: string;
  text: string;
};

// Extracted out of `about-us/Testimonials.tsx` once index.html needed the exact same "Clients
// Reviews" widget (same heading/`/clients-reviews` link, same `.swiper-testimonior` config —
// `slidesPerView` 1/2/3, `spaceBetween` 30, `speed` 800, clickable dot pagination — verbatim in both
// sources) with its own distinct 8-testimonial content and its own star icon (`star.svg`, not
// about-us's `star-6.svg`) — same "extract into `common/` once a second page needs it" precedent as
// `Pagination`/`BlogListingSidebar`. The outer `<section>` was missing source's own real `py-100`
// class on every existing caller (a real, disclosed vertical-spacing gap, not intentional) — fixed
// here, benefiting index.html/home-02.html/about-us.html retroactively.
export default function ClientsReviewsCarousel({
  testimonials,
  starIcon = "star-6.svg",
  initialSlide,
  cardHref,
  children,
  sectionClassName = "py-100",
  swiperClassName = "swiper-testimonior",
  paginationClass = "pagination-swiper-testimonior",
  loop = false,
  breakpoints = { 0: { slidesPerView: 1, slidesPerGroup: 1 }, 767: { slidesPerView: 2, slidesPerGroup: 2 }, 991: { slidesPerView: 3, slidesPerGroup: 3 } },
}: {
  testimonials: ClientTestimonial[];
  starIcon?: string;
  initialSlide?: number;
  /** home-03.html's own testimonial cards are real `<a href="clients-reviews.html">` links (confirmed
   *  via source diff — index.html's/home-02.html's own are plain, non-linked divs). When set, renders
   *  each card as a link to this href instead of a plain div. */
  cardHref?: string;
  /** home-03.html's own "Ulasan Pelanggan" section also contains a promo banner after the testimonial
   *  carousel, inside the SAME `<section>` (confirmed via source diff) — rendered here rather than
   *  forcing callers to wrap this component in a redundant extra `<section>`. */
  children?: React.ReactNode;
  /** Retroactive fix: this section's own background class genuinely varies per page (confirmed via
   *  source diff) — home-05.html's own is `background-light py-100`, home-06.html's/home-07.html's own
   *  is `bg-white py-100` — but every existing caller was hardcoded to plain `py-100` regardless,
   *  silently dropping the real background on home-05/home-06. Defaults to the previously-hardcoded
   *  value so index.html/home-02.html/home-03.html/about-us.html (all real `py-100`, no bug) are
   *  unaffected. */
  sectionClassName?: string;
  /** home-09.html's own "Ulasan Pelanggan" reuse is a real, distinct `.swiper-testimonior-2` config
   *  (confirmed via `assets/js/swiper.js`): real `loop: true` (not present on the base config) and a
   *  max of 2 columns at 767px (never reaches 3 columns like the base config does at 991px). Exposed
   *  via `swiperClassName`/`paginationClass`/`loop`/`breakpoints` rather than forking the component. */
  swiperClassName?: string;
  paginationClass?: string;
  loop?: boolean;
  breakpoints?: Record<number, { slidesPerView: number; slidesPerGroup?: number }>;
}) {
  const CardTag = cardHref ? Link : "div";

  // Tidak ada ulasan asli -> tidak ada seksi. Menampilkan carousel kosong dengan
  // judul "Ulasan Pelanggan" di atasnya hanya memberi kesan ada ulasan yang gagal
  // dimuat. Sembunyikan seluruhnya sampai ada isinya.
  if (testimonials.length === 0) return null;

  return (
    <section className={sectionClassName}>
      <div className="container wow fadeIn" data-wow-delay="0.3s">
        <div className="title-section mb-40">
          <h2 className="">Ulasan Pelanggan</h2>
          <Link href="/clients-reviews" className="btn btn-line-style-2 effect-line-primary hover-fill-white btn-large">
            Lihat Semua
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z" fill="#1C1C1C" />
            </svg>
          </Link>
        </div>
      <div className="swiper-testimonior">
        <Swiper
          modules={[Pagination]}
          slidesPerGroup={1}
          slidesPerView={1}
          speed={800}
          spaceBetween={30}
          loop={loop}
          initialSlide={initialSlide}
          pagination={{ el: `.${paginationClass}`, clickable: true }}
          breakpoints={breakpoints}
          className={`swiper-container  ${swiperClassName}`}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <CardTag className="testimonior-box" href={cardHref as string}>
                <div className="flex items-center gap-4 mb-16">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Image key={starIndex} src={`/assets/icons/${starIcon}`} alt="testimonior" width={16} height={16} />
                  ))}
                </div>
                <p className="testimonior-box--desc mb-16">{item.text}</p>
                <div className="testimonior-box--user">
                  <Image className="testimonior--img" src={item.avatar} alt="avatar" width={56} height={56} />
                  <div className="testimonior-box--user-content">
                    <p className="h5 title">{item.name}</p>
                    <p className="desc">{item.title}</p>
                  </div>
                </div>
              </CardTag>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

        <div className={`swiper-pagination pagination-dark pagination-style ${paginationClass} mt-35`} />
      </div>
      <div className="tf-spacing"></div>
      {children}
    </section>
  );
}
