"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";

// Migrated from ../aurexo/blog-list.html lines 483-613. `.post-style-7` is a plain `<div>` here, NOT an
// anchor like `.post-style-2`/`.post-style-6` on blog-standard.html — only the title itself is a real
// link (matching source's real `<a class="title">` href) and "Baca Selengkapnya" is source's own literal dead
// `href="#"` (confirmed via grep, no backing JS anywhere), reproduced as inert rather than wired to the
// same real destination the title already has. All 5 titles here exactly match existing `allBlogPosts`
// entries (ids 1/5/6/7/8, all previously added while migrating blog-standard.html) — no new stub posts
// needed this time. Each occurrence still carries its own real, distinct image/category/excerpt (all 3
// genuinely differ from both the canonical `allBlogPosts` record AND blog-standard.html's own occurrence
// of the same title) — the same recurring "same conceptual article, inconsistent per-page presentation"
// pattern, preserved as literal local card data rather than reconciled.
const POSTS = [
  {
    slug: "hybrid-vs-electric-cars",
    image: "/assets/images/blog/post-44.jpg",
    category: "ULASAN AHLI",
    date: "21 Agu 2025",
    title: "Mobil Hibrida vs. Listrik: Mana yang Harus Anda Pilih?",
    excerpt: "Bandingkan kelebihan dan kekurangan mobil hibrida dan listrik untuk membantu Anda menentukan pilihan yang tepat...",
  },
  {
    slug: "compact-suv-vs-full-size-suv",
    image: "/assets/images/blog/post-20.jpg",
    category: "PERFORMANCE",
    date: "21 Agu 2025",
    title: "Compact SUV vs. Full-Size SUV: What’s the Difference?",
    excerpt: "Ketahui perbedaan SUV kompak dan SUV besar, termasuk ruang, efisiensi bahan bakar, dan fitur untuk memilih...",
  },
  {
    slug: "sports-cars-vs-luxury-cars",
    image: "/assets/images/blog/post-23.jpg",
    category: "MEWAH",
    date: "21 Agu 2025",
    title: "Sports Cars vs. Luxury Cars: Finding Your Perfect Match",
    excerpt: "Bandingkan mobil sport dan mobil mewah untuk menemukan yang paling sesuai gaya hidup Anda, dengan mempertimbangkan pengalaman berkendara, teknologi...",
  },
  {
    slug: "diesel-vs-gasoline-engines",
    image: "/assets/images/blog/post-21.jpg",
    category: "DESIGN",
    date: "21 Agu 2025",
    title: "Diesel vs. Gasoline Engines: Pros and Cons Explained",
    excerpt: "Pahami perbedaan mesin diesel dan bensin, termasuk kelebihan dan kekurangannya, agar bisa mengambil pilihan yang tepat...",
  },
  {
    slug: "manual-vs-automatic-transmission",
    image: "/assets/images/blog/post-22.jpg",
    category: "ULASAN",
    date: "21 Agu 2025",
    title: "Manual vs. Matic: Mana yang Lebih Baik untuk Anda?",
    excerpt: "Ketahui perbedaan transmisi otomatis untuk membantu Anda menentukan yang sesuai gaya mengemudi Anda...",
  },
];

const POSTS_PER_PAGE = 2;

export default function BlogListContent() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(POSTS.length / POSTS_PER_PAGE);
  const pagePosts = POSTS.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <div className="innerpage__content md-mb-30">
      <div className="grid grid-cols-1 gap-y-39 gap-x-30 mb-40">
        {pagePosts.map((post, index) => (
          <div key={`${post.slug}-${index}`}>
            <div className="post-style-7 overflow-hidden">
              <div className="image">
                <Image className="post--img flex" src={post.image} alt="news" width={410} height={280} />
              </div>
              <div className="content">
                <div className="flex gap-12 justify-start mb-16">
                  <span className="text-sm">oleh Admin</span>
                  <span className="text-sm">{post.date}</span>
                  <span className="text-sm text-highlight uppercase text-underline">{post.category}</span>
                </div>
                <Link href={`/blog-details-1/${post.slug}`} className="title h4 mb-20">
                  {post.title}
                </Link>
                <p className="clamp clamp-3 text-secondary mb-20">{post.excerpt}</p>
                <a href="#" className="read-more" onClick={(event) => event.preventDefault()}>
                  Baca Selengkapnya
                </a>
              </div>
            </div>
            {index < pagePosts.length - 1 && <div className="divider" />}
          </div>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
