import Image from "next/image";
import Link from "next/link";

const TITLE = "BMW Seri 5 2025 Dibanderol Mulai Rp 950 Juta; i5 EV Mulai Rp 1,1 Miliar";
const SLUG = "2025-bmw-5-series-priced";

// Migrated from ../aurexo/home-05.html lines 3696-3759 ("News & Reviews"). A genuinely different,
// static (non-swiper) layout from every other "News & Reviews" section built so far: one large
// `.post-style-2.radius-none` card (left column) + two stacked `.post-style-3` cards (right column) —
// all 3 repeat the same real placeholder title used by every other News/Reviews section on the site
// (`RelatedArticles.tsx`/`NewsAndReviewsSection.tsx`), so they link to the same real stub slug rather
// than inventing 3 more identical articles.
export default function NewsReviewsSplitSection() {
  return (
    <section className="py-100">
      <div className="container wow fadeIn" data-wow-delay="0.1s">
        <div className="title-section mb-30 wow fadeInDown" data-wow-delay="0.1s">
          <h2 className="capitalize">Berita & Ulasan</h2>
          <Link href="/blog-list" className="btn btn-line-style-2 effect-line-primary btn-large hover-fill-white">
            Lihat Semua
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z"
                fill="#1C1C1C"
              />
            </svg>
          </Link>
        </div>
        <div className="row">
          <div className="col-lg-6 md-mb-30">
            <Link href={`/blog-details-1/${SLUG}`} className="post-style-2 radius-none overflow-hidden">
              <Image className="post--img flex" src="/assets/images/blog/post-4.jpg" alt="news" width={410} height={280} />
              <div className="content">
                <p className="h5 text-white mb-8 title">{TITLE}</p>
                <div className="flex gap-8 justify-start">
                  <span className="text-white text-xs">oleh Admin</span>
                  <span className="text-white text-xs">5 Agu 2025</span>
                  <span className="text-xs text-highlight uppercase text-underline">Ulasan Ahli</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-lg-6">
            <Link href={`/blog-details-1/${SLUG}`} className="post-style-3 mb-20">
              <div className="post--img">
                <Image className="flex" src="/assets/images/blog/post-10.jpg" alt="news" width={200} height={140} />
              </div>
              <div className="content">
                <p className="h5 mb-8 title">{TITLE}</p>
                <div className="flex gap-8 justify-start">
                  <span className="text-xs">oleh Admin</span>
                  <span className="text-xs">5 Agu 2025</span>
                  <span className="text-xs text-highlight uppercase text-underline">BERITA</span>
                </div>
              </div>
            </Link>
            <Link href={`/blog-details-1/${SLUG}`} className="post-style-3">
              <div className="post--img">
                <Image className="flex" src="/assets/images/blog/post-11.jpg" alt="news" width={200} height={140} />
              </div>
              <div className="content">
                <p className="h5 mb-8 title">{TITLE}</p>
                <div className="flex gap-8 justify-start">
                  <span className="text-xs">oleh Admin</span>
                  <span className="text-xs">5 Agu 2025</span>
                  <span className="text-xs text-highlight uppercase text-underline">BERITA</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
