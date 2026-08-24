"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";

// Migrated from ../aurexo/blog-grid-style-3.html lines 483-622. `.post-style-9` — a 4th distinct
// blog-card shape (2-column grid, white overlaid title + meta row, no excerpt — otherwise the same
// image+content structure as `.post-style-8` on blog-grid-style-2.html, but a genuinely different CSS
// class/grid layout, not just a modifier). All 8 titles here already exist in `allBlogPosts` (ids
// 1/2/3/4/5/7/8/14) — no new stub posts needed, further confirming the site's recurring template-article
// set. Every title still carries its own distinct real image (post-33..39, none reused from any other
// page) — a continuing instance of the "same conceptual article, different real image per page" pattern.
const POSTS = [
  { slug: "compact-suv-vs-full-size-suv", image: "/assets/images/blog/post-33.jpg", category: "PERFORMANCE", title: "Compact SUV vs. Full-Size SUV: What’s the Difference?" },
  { slug: "sports-cars-vs-luxury-cars", image: "/assets/images/blog/post-34.jpg", category: "LUXURY", title: "Sports Cars vs. Luxury Cars: Finding Your Perfect Match" },
  { slug: "diesel-vs-gasoline-engines", image: "/assets/images/blog/post-35.jpg", category: "DESIGN", title: "Diesel vs. Gasoline Engines: Pros and Cons Explained" },
  { slug: "manual-vs-automatic-transmission", image: "/assets/images/blog/post-30.jpg", category: "REVIEWS", title: "Manual vs. Automatic Transmission: Which is Better for You?" },
  { slug: "electric-vs-ice-cars", image: "/assets/images/blog/post-36.jpg", category: "TREND", title: "Electric vs. Internal Combustion Engine (ICE) Cars" },
  { slug: "luxury-suvs-vs-crossovers", image: "/assets/images/blog/post-37.jpg", category: "MAINTENANCE", title: "Luxury SUVs vs. Crossovers: Which is Right for You?" },
  { slug: "truck-vs-minivan", image: "/assets/images/blog/post-38.jpg", category: "NEWS", title: "Truck vs. Minivan: Which is Better for Family Needs?" },
  { slug: "tires-all-season-vs-summer-vs-winter", image: "/assets/images/blog/post-39.jpg", category: "TIPS", title: "Tires: All-Season vs. Summer vs. Winter – What You Need to Know" },
];

const POSTS_PER_PAGE = 3;

export default function BlogGridStyle3Content() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(POSTS.length / POSTS_PER_PAGE);
  const pagePosts = POSTS.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <>
      <div className="container">
        <div className="grid grid-cols-2 sm-grid-cols-1 gap-y-40 gap-x-30 mb-40">
          {pagePosts.map((post, index) => (
            <Link href={`/blog-details-1/${post.slug}`} className="post-style-9 overflow-hidden" key={`${post.slug}-${index}`}>
              <div className="image">
                <Image className="post--img flex" src={post.image} alt="news" width={570} height={380} />
              </div>
              <div className="content">
                <p className="h5 title capitalize mb-12 text-white mb-8">{post.title}</p>
                <div className="flex gap-12 justify-start">
                  <span className="text-xs text-white">by Admin</span>
                  <span className="text-xs text-white">Aug. 21, 2025</span>
                  <span className="text-xs text-highlight uppercase text-underline">{post.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}
