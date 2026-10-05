"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";

// Migrated from ../aurexo/blog-grid-style-2.html lines 484-839. Real tab switch (`app.js`'s `tabs()`
// binds unconditionally to any `.flat-tabs .menu-tab` child, no gating class — same confirmed-real
// pattern as sell-your-car.html's License Plate/VIN tabs). All 3 tabs' post sets are literal, disjoint-
// looking subsets of the SAME underlying 9 titles (Tab 2 is exactly tab 1's last 6, Tab 3 is exactly the
// middle 3 of those) — reproduced as 3 separate literal arrays matching source exactly, not derived via
// `.slice()`, since nothing in source guarantees that relationship holds beyond a coincidence. Every
// title here already exists in `allBlogPosts` (ids 1-8 and 14) — no new stub posts needed. `post-19.jpg`
// is a new real image for "Hybrid vs. Electric Cars..." (every other page used `post-44.jpg` for this
// title), continuing the recurring "same conceptual article, inconsistent per-page image" pattern.
const TAB_POSTS = [
  {
    label: "Ulasan Mobil",
    posts: [
      { slug: "hybrid-vs-electric-cars", image: "/assets/images/blog/post-19.jpg", category: "ULASAN AHLI", title: "Mobil Hibrida vs. Listrik: Mana yang Harus Anda Pilih?" },
      { slug: "compact-suv-vs-full-size-suv", image: "/assets/images/blog/post-20.jpg", category: "PERFORMANCE", title: "Compact SUV vs. Full-Size SUV: What’s the Difference?" },
      { slug: "sports-cars-vs-luxury-cars", image: "/assets/images/blog/post-18.jpg", category: "MEWAH", title: "Sports Cars vs. Luxury Cars: Finding Your Perfect Match" },
      { slug: "diesel-vs-gasoline-engines", image: "/assets/images/blog/post-21.jpg", category: "DESIGN", title: "Diesel vs. Gasoline Engines: Pros and Cons Explained" },
      { slug: "manual-vs-automatic-transmission", image: "/assets/images/blog/post-30.jpg", category: "ULASAN", title: "Manual vs. Matic: Mana yang Lebih Baik untuk Anda?" },
      { slug: "electric-vs-ice-cars", image: "/assets/images/blog/post-24.jpg", category: "TREND", title: "Electric vs. Internal Combustion Engine (ICE) Cars" },
      { slug: "luxury-suvs-vs-crossovers", image: "/assets/images/blog/post-32.jpg", category: "PERAWATAN", title: "SUV Mewah vs. Crossover: Mana yang Tepat untuk Anda?" },
      { slug: "truck-vs-minivan", image: "/assets/images/blog/post-31.jpg", category: "BERITA", title: "Pikap vs. Minibus: Mana yang Lebih Baik untuk Keluarga?" },
      { slug: "tires-all-season-vs-summer-vs-winter", image: "/assets/images/blog/post-23.jpg", category: "TIPS", title: "Ban: Segala Musim vs. Musim Panas vs. Musim Dingin – Yang Perlu Anda Tahu" },
    ],
  },
  {
    label: "Tips Perawatan",
    posts: [
      { slug: "diesel-vs-gasoline-engines", image: "/assets/images/blog/post-21.jpg", category: "DESIGN", title: "Diesel vs. Gasoline Engines: Pros and Cons Explained" },
      { slug: "manual-vs-automatic-transmission", image: "/assets/images/blog/post-30.jpg", category: "ULASAN", title: "Manual vs. Matic: Mana yang Lebih Baik untuk Anda?" },
      { slug: "electric-vs-ice-cars", image: "/assets/images/blog/post-24.jpg", category: "TREND", title: "Electric vs. Internal Combustion Engine (ICE) Cars" },
      { slug: "luxury-suvs-vs-crossovers", image: "/assets/images/blog/post-32.jpg", category: "PERAWATAN", title: "SUV Mewah vs. Crossover: Mana yang Tepat untuk Anda?" },
      { slug: "truck-vs-minivan", image: "/assets/images/blog/post-31.jpg", category: "BERITA", title: "Pikap vs. Minibus: Mana yang Lebih Baik untuk Keluarga?" },
      { slug: "tires-all-season-vs-summer-vs-winter", image: "/assets/images/blog/post-23.jpg", category: "TIPS", title: "Ban: Segala Musim vs. Musim Panas vs. Musim Dingin – Yang Perlu Anda Tahu" },
    ],
  },
  {
    label: "Buying Guides",
    posts: [
      { slug: "diesel-vs-gasoline-engines", image: "/assets/images/blog/post-21.jpg", category: "DESIGN", title: "Diesel vs. Gasoline Engines: Pros and Cons Explained" },
      { slug: "manual-vs-automatic-transmission", image: "/assets/images/blog/post-30.jpg", category: "ULASAN", title: "Manual vs. Matic: Mana yang Lebih Baik untuk Anda?" },
      { slug: "electric-vs-ice-cars", image: "/assets/images/blog/post-24.jpg", category: "TREND", title: "Electric vs. Internal Combustion Engine (ICE) Cars" },
    ],
  },
];

const POSTS_PER_PAGE = 3;

export default function BlogGridStyle2Content() {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);

  const posts = TAB_POSTS[activeTab].posts;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const pagePosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <div className="container flat-tabs">
      <div className="overflow-x-auto mb-60">
        <ul className="menu-tab menu-tab-style6 text-white justify-center mx-auto md-justify-start">
          {TAB_POSTS.map((tab, index) => (
            <li
              key={tab.label}
              className={index === activeTab ? "active" : undefined}
              onClick={() => {
                setActiveTab(index);
                setPage(1);
              }}
            >
              <span className="h4 text-white font-weight-600">{tab.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="content-tab">
        <div className="content-inner active">
          <div className="grid grid-cols-3 lg-grid-cols-2 md-grid-cols-1 gap-y-40 gap-x-30 mb-40">
            {pagePosts.map((post, index) => (
              <Link href={`/blog-details-1/${post.slug}`} className="post-style-8 overflow-hidden" key={`${post.slug}-${index}`}>
                <div className="image">
                  <Image className="post--img flex" src={post.image} alt="news" width={410} height={280} />
                </div>
                <div className="content">
                  <p className="h5 title capitalize mb-12 text-white mb-8">{post.title}</p>
                  <div className="flex gap-12 justify-start">
                    <span className="text-xs text-white">oleh Admin</span>
                    <span className="text-xs text-white">21 Agu 2025</span>
                    <span className="text-xs text-highlight uppercase text-underline">{post.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
    </div>
  );
}
