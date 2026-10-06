"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";

// Migrated from ../aurexo/blog-grid-style-1.html lines 483-664. No sidebar on this page (full-width
// 3-column grid, confirmed via source — genuinely different layout from blog-standard.html/blog-list.html,
// which both have an `.innerpage__sidebar`). 8 of these 9 titles exactly match existing `allBlogPosts`
// entries (ids 1-8); only "Mobil Listrik vs. Mesin Bensin (ICE)" is new (id 14). Every
// occurrence still carries its own distinct real image/category/excerpt — a 4th real, disclosed instance
// of the "same conceptual article, inconsistent per-page presentation" pattern already seen on
// blog-standard.html/blog-list.html, preserved as literal local card data rather than reconciled.
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
    category: "PERFORMA",
    date: "21 Agu 2025",
    title: "Compact SUV vs. Full-Size SUV: Apa Bedanya?",
    excerpt: "Ketahui perbedaan SUV kompak dan SUV besar, termasuk ruang, efisiensi bahan bakar, dan fitur...",
  },
  {
    slug: "sports-cars-vs-luxury-cars",
    image: "/assets/images/blog/post-18.jpg",
    category: "MEWAH",
    date: "21 Agu 2025",
    title: "Mobil Sport vs. Mobil Mewah: Menemukan yang Tepat untuk Anda",
    excerpt: "Bandingkan mobil sport dan mobil mewah untuk menemukan yang paling sesuai gaya hidup Anda, dengan mempertimbangkan pengalaman berkendara...",
  },
  {
    slug: "diesel-vs-gasoline-engines",
    image: "/assets/images/blog/post-21.jpg",
    category: "DESAIN",
    date: "21 Agu 2025",
    title: "Diesel vs. Bensin: Kelebihan dan Kekurangannya",
    excerpt: "Pahami perbedaan mesin diesel dan bensin, termasuk kelebihan dan kekurangannya, agar bisa mengambil...",
  },
  {
    slug: "manual-vs-automatic-transmission",
    image: "/assets/images/blog/post-30.jpg",
    category: "ULASAN",
    date: "21 Agu 2025",
    title: "Manual vs. Matic: Mana yang Lebih Baik untuk Anda?",
    excerpt: "Ketahui perbedaan transmisi otomatis untuk membantu Anda menentukan yang sesuai gaya mengemudi Anda...",
  },
  {
    slug: "electric-vs-ice-cars",
    image: "/assets/images/blog/post-24.jpg",
    category: "TREN",
    date: "21 Agu 2025",
    title: "Mobil Listrik vs. Mesin Bensin (ICE)",
    excerpt: "Bandingkan mobil listrik (EV) dengan mobil mesin pembakaran biasa (ICE) untuk memahami...",
  },
  {
    slug: "luxury-suvs-vs-crossovers",
    image: "/assets/images/blog/post-32.jpg",
    category: "PERAWATAN",
    date: "21 Agu 2025",
    title: "SUV Mewah vs. Crossover: Mana yang Tepat untuk Anda?",
    excerpt: "Ketahui perbedaan SUV mewah dan crossover untuk menentukan jenis kendaraan yang paling sesuai dengan...",
  },
  {
    slug: "truck-vs-minivan",
    image: "/assets/images/blog/post-31.jpg",
    category: "BERITA",
    date: "21 Agu 2025",
    title: "Pikap vs. Minibus: Mana yang Lebih Baik untuk Keluarga?",
    excerpt: "Bandingkan pikap dan minibus untuk membantu Anda menentukan kendaraan yang lebih cocok untuk transportasi keluarga...",
  },
  {
    slug: "tires-all-season-vs-summer-vs-winter",
    image: "/assets/images/blog/post-23.jpg",
    category: "TIPS",
    date: "21 Agu 2025",
    title: "Ban: Segala Musim vs. Musim Panas vs. Musim Dingin – Yang Perlu Anda Tahu",
    excerpt: "Pelajari perbedaan ban segala musim, musim panas, dan musim dingin untuk memilih jenis ban terbaik untuk...",
  },
];

const POSTS_PER_PAGE = 3;

export default function BlogGridStyle1Content() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(POSTS.length / POSTS_PER_PAGE);
  const pagePosts = POSTS.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <>
      <div className="container">
        <div className="grid grid-cols-3 md-grid-cols-1 gap-y-40 gap-x-30 mb-40">
          {pagePosts.map((post, index) => (
            <Link href={`/blog-details-1/${post.slug}`} className="post-style-6 overflow-hidden" key={`${post.slug}-${index}`}>
              <div className="image">
                <Image className="post--img flex" src={post.image} alt="news" width={410} height={280} />
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
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}
