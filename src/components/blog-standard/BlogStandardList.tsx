"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";

// Migrated from ../aurexo/blog-standard.html lines 475-628. The featured `.post-style-2` card sits
// above the paginated grid and isn't itself part of the paginated set (matches source's own DOM order
// — it's a sibling before the grid, not the grid's first item). Every card in source literally links to
// the same static `blog-details-1.html` file (confirmed via source grep) — routed here to each post's
// own real slug in `allBlogPosts` where the title matches (id 1 "Compact SUV..." appears twice with 2
// different images; the rest are new ids 5-8, added while migrating this exact page — see that file's
// own comment). Two titles repeat within this page's own grid with a DIFFERENT image/category each time
// ("Sports Cars..." here vs. its own featured-card instance; "Compact SUV..." twice) — a real, disclosed
// source inconsistency, preserved as literal separate card objects rather than deduplicated.
const FEATURED = {
  slug: "sports-cars-vs-luxury-cars",
  image: "/assets/images/blog/post-18.jpg",
  title: "Mobil Sport vs. Mobil Mewah: Menemukan yang Tepat untuk Anda",
  category: "MEWAH",
  date: "Aug. 11, 2025",
};

const GRID_POSTS = [
  {
    slug: "hybrid-vs-electric-cars",
    image: "/assets/images/blog/post-44.jpg",
    category: "ULASAN AHLI",
    date: "21 Agu 2025",
    title: "Mobil Hibrida vs. Listrik: Mana yang Harus Anda Pilih?",
    excerpt:
      "Bandingkan kelebihan dan kekurangan mobil hibrida dan listrik untuk membantu Anda menentukan pilihan yang tepat...",
  },
  {
    slug: "compact-suv-vs-full-size-suv",
    image: "/assets/images/blog/post-20.jpg",
    category: "PERFORMA",
    date: "21 Agu 2025",
    title: "Compact SUV vs. Full-Size SUV: Apa Bedanya?",
    excerpt:
      "Ketahui perbedaan SUV kompak dan SUV besar, termasuk ruang, efisiensi bahan bakar, dan fitur...",
  },
  {
    slug: "sports-cars-vs-luxury-cars",
    image: "/assets/images/blog/post-21.jpg",
    category: "ULASAN AHLI",
    date: "21 Agu 2025",
    title: "Mobil Sport vs. Mobil Mewah: Menemukan yang Tepat untuk Anda",
    excerpt:
      "Bandingkan kelebihan dan kekurangan mobil hibrida dan listrik untuk membantu Anda menentukan pilihan yang tepat...",
  },
  {
    slug: "diesel-vs-gasoline-engines",
    image: "/assets/images/blog/post-22.jpg",
    category: "PERFORMA",
    date: "21 Agu 2025",
    title: "Diesel vs. Bensin: Kelebihan dan Kekurangannya",
    excerpt:
      "Ketahui perbedaan SUV kompak dan SUV besar, termasuk ruang, efisiensi bahan bakar, dan fitur...",
  },
  {
    slug: "manual-vs-automatic-transmission",
    image: "/assets/images/blog/post-23.jpg",
    category: "ULASAN AHLI",
    date: "21 Agu 2025",
    title: "Manual vs. Matic: Mana yang Lebih Baik untuk Anda?",
    excerpt:
      "Bandingkan kelebihan dan kekurangan mobil hibrida dan listrik untuk membantu Anda menentukan pilihan yang tepat...",
  },
  {
    slug: "compact-suv-vs-full-size-suv",
    image: "/assets/images/blog/post-24.jpg",
    category: "PERFORMA",
    date: "21 Agu 2025",
    title: "Compact SUV vs. Full-Size SUV: Apa Bedanya?",
    excerpt:
      "Ketahui perbedaan SUV kompak dan SUV besar, termasuk ruang, efisiensi bahan bakar, dan fitur...",
  },
];

const POSTS_PER_PAGE = 2;

export default function BlogStandardList() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(GRID_POSTS.length / POSTS_PER_PAGE);
  const pagePosts = GRID_POSTS.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <div className="innerpage__content md-mb-30">
      <Link href={`/blog-details-1/${FEATURED.slug}`} className="post-style-2 overflow-hidden mb-40">
        <Image className="post--img flex" src={FEATURED.image} alt="news" width={1170} height={480} />
        <div className="content">
          <p className="h3 text-white mb-8 capitalize">{FEATURED.title}</p>
          <div className="flex gap-12 justify-start mb-2">
            <span className="text-white text-xs">oleh Admin</span>
            <span className="text-white text-xs">{FEATURED.date}</span>
            <span className="text-xs text-highlight uppercase text-underline">{FEATURED.category}</span>
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-2 md-grid-cols-1 gap-y-40 gap-x-30 mb-40">
        {pagePosts.map((post, index) => (
          <Link href={`/blog-details-1/${post.slug}`} className="post-style-6 overflow-hidden" key={`${post.slug}-${index}`}>
            <div className="image">
              <Image className="post--img flex" src={post.image} alt="news" width={570} height={380} />
            </div>
            <div className="content">
              <div className="flex gap-12 justify-start mb-12">
                <span className="text-sm">oleh Admin</span>
                <span className="text-sm">{post.date}</span>
                <span className="text-sm text-highlight uppercase text-underline">{post.category}</span>
              </div>
              <p className="h4 title mb-12">{post.title}</p>
              <p className="clamp clamp-2 text-secondary">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
