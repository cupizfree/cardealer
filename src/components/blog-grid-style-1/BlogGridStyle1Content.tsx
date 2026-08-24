"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";

// Migrated from ../aurexo/blog-grid-style-1.html lines 483-664. No sidebar on this page (full-width
// 3-column grid, confirmed via source — genuinely different layout from blog-standard.html/blog-list.html,
// which both have an `.innerpage__sidebar`). 8 of these 9 titles exactly match existing `allBlogPosts`
// entries (ids 1-8); only "Electric vs. Internal Combustion Engine (ICE) Cars" is new (id 14). Every
// occurrence still carries its own distinct real image/category/excerpt — a 4th real, disclosed instance
// of the "same conceptual article, inconsistent per-page presentation" pattern already seen on
// blog-standard.html/blog-list.html, preserved as literal local card data rather than reconciled.
const POSTS = [
  {
    slug: "hybrid-vs-electric-cars",
    image: "/assets/images/blog/post-44.jpg",
    category: "EXPERT REVIEW",
    date: "Aug. 21, 2025",
    title: "Hybrid vs. Electric Cars: Which One Should You Choose?",
    excerpt: "Compare the benefits and drawbacks of hybrid and electric vehicles to help you decide which is the right choice...",
  },
  {
    slug: "compact-suv-vs-full-size-suv",
    image: "/assets/images/blog/post-20.jpg",
    category: "PERFORMANCE",
    date: "Aug. 21, 2025",
    title: "Compact SUV vs. Full-Size SUV: What’s the Difference?",
    excerpt: "Discover the differences between compact and full-size SUVs, including space, fuel efficiency, and features...",
  },
  {
    slug: "sports-cars-vs-luxury-cars",
    image: "/assets/images/blog/post-18.jpg",
    category: "LUXURY",
    date: "Aug. 21, 2025",
    title: "Sports Cars vs. Luxury Cars: Finding Your Perfect Match",
    excerpt: "Compare sports cars and luxury cars to find the perfect match for your lifestyle, considering driving experience...",
  },
  {
    slug: "diesel-vs-gasoline-engines",
    image: "/assets/images/blog/post-21.jpg",
    category: "DESIGN",
    date: "Aug. 21, 2025",
    title: "Diesel vs. Gasoline Engines: Pros and Cons Explained",
    excerpt: "Understand the differences between diesel and gasoline engines, including their pros and cons, to make an...",
  },
  {
    slug: "manual-vs-automatic-transmission",
    image: "/assets/images/blog/post-30.jpg",
    category: "REVIEWS",
    date: "Aug. 21, 2025",
    title: "Manual vs. Automatic Transmission: Which is Better for You?",
    excerpt: "Explore the differences between automatic transmissions to help you decide which suits your driving style...",
  },
  {
    slug: "electric-vs-ice-cars",
    image: "/assets/images/blog/post-24.jpg",
    category: "TREND",
    date: "Aug. 21, 2025",
    title: "Electric vs. Internal Combustion Engine (ICE) Cars",
    excerpt: "Compare electric vehicles (EVs) with traditional internal combustion engine (ICE) cars to understand their...",
  },
  {
    slug: "luxury-suvs-vs-crossovers",
    image: "/assets/images/blog/post-32.jpg",
    category: "MAINTENANCE",
    date: "Aug. 21, 2025",
    title: "Luxury SUVs vs. Crossovers: Which is Right for You?",
    excerpt: "Explore the differences between luxury SUVs and crossovers to determine which type of vehicle best meets your...",
  },
  {
    slug: "truck-vs-minivan",
    image: "/assets/images/blog/post-31.jpg",
    category: "NEWS",
    date: "Aug. 21, 2025",
    title: "Truck vs. Minivan: Which is Better for Family Needs?",
    excerpt: "Compare trucks and minivans to help you decide which vehicle is more suitable for your family’s transportation...",
  },
  {
    slug: "tires-all-season-vs-summer-vs-winter",
    image: "/assets/images/blog/post-23.jpg",
    category: "TIPS",
    date: "Aug. 21, 2025",
    title: "Tires: All-Season vs. Summer vs. Winter – What You Need to Know",
    excerpt: "Learn about the differences between all-season, summer, and winter tires to choose the best tire type for your...",
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
                  <span className="text-sm">by Admin</span>
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
