"use client";

import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  { label: "Auto Maintenance", count: "22" },
  { label: "Car Buying Tips", count: "15" },
  { label: "Car Technology", count: "16" },
  { label: "Electric & Hybrid Cars", count: "08" },
  { label: "Luxury Cars", count: "19" },
  { label: "Road Trips & Travel", count: "21" },
];

const TYPE_CAR = [
  { label: "Electric Car", count: "22" },
  { label: "Sedan Car", count: "15" },
  { label: "SUV Car", count: "16" },
  { label: "Luxury Car", count: "08" },
  { label: "Hatchback Car", count: "19" },
  { label: "Crossover Car", count: "21" },
];

const RECENT_POSTS = [
  { slug: "top-5-tips-car-resale-value", image: "/assets/images/blog/post-25.jpg", date: "Aug. 5, 2025", category: "NEWS", title: "Top 5 Tips for Maintaining Your Car's Resale Value" },
  { slug: "rise-of-autonomous-vehicles", image: "/assets/images/blog/post-26.jpg", date: "Aug. 21, 2025", category: "EXPERT REVIEW", title: "The Rise of Autonomous Vehicles: What to Expect" },
  { slug: "how-to-choose-best-tires", image: "/assets/images/blog/post-27.jpg", date: "Aug. 24, 2025", category: "TIPS", title: "How to Choose the Best Tires for Your Car" },
  { slug: "hidden-costs-luxury-car", image: "/assets/images/blog/post-28.jpg", date: "Aug. 25, 2025", category: "TIPS", title: "Hidden Costs of Owning a Luxury Car" },
];

const TAGS = ["Performance", "Luxury", "Safety", "Technology", "Maintenance", "Fuel Efficiency", "Design", "Reviews", "Trends"];

// Shared by blog-standard.html and blog-list.html — both pages' sidebars are byte-identical (same
// `widget-categories`/`recent-post`/`widget-tags` markup, labels, counts, images, dates, confirmed via
// source diff of both files), first built as `blog-standard/BlogStandardSidebar.tsx` then extracted here
// once blog-list.html needed the exact same thing (same "extract into `common/` once a second page needs
// it" precedent as `Pagination`/`SocialIcons`). Neither page has an author bio/social box at all
// (confirmed absent in source, not an oversight — this sidebar starts straight at the search form),
// a real, genuine DOM-structure difference from `blog-details/BlogSidebar.tsx`, which does have one.
// Categories/Type Car always go to `blog-grid-style-1.html` (not yet migrated) on both pages; only Tags'
// real href differs per page (`blog-grid-style-1.html` on blog-standard vs. `blog-details-1.html` on
// blog-list) — the one real difference, exposed as `tagsHref`. "Recent posts" link to each card's own
// real `/blog-details-1/[slug]` (ids 9-12 in `blogPosts.ts`) on both pages — per explicit user request
// that clicking a Recent Posts card show that card's own real content, overriding each page's own
// original literal href for this widget (`blog-details-1.html` on both, coincidentally).
export default function BlogListingSidebar({ tagsHref }: { tagsHref: string }) {
  return (
    <div className="innerpage__sidebar">
      <form action="#" className="widget-search w-full mb-34" onSubmit={(event) => event.preventDefault()}>
        <input className="input-normal" type="text" name="search-header" required id="search-header" placeholder="Search products..." />
        <button type="submit" className="widget-search-btn" aria-label="Search">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.8047 15.8047L21.0012 21.0012" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>

      <p className="h4 mb-16">Categories</p>
      <ul className="widget-categories mb-32">
        {CATEGORIES.map((category, index) => (
          <li key={category.label}>
            <Link href="/blog-grid-style-1" className={index === 0 ? "active" : undefined}>
              <span className="label">{category.label}</span>
              <span>({category.count})</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="divider mb-32 w-full" />

      <p className="h4 mb-16 capitalize">Recent posts</p>
      <div className="mb-32">
        {RECENT_POSTS.map((post, index) => (
          <div key={post.title}>
            <Link href={`/blog-details-1/${post.slug}`} className="recent-post overflow-hidden mb-16">
              <div className="image">
                <Image className="post--img flex" src={post.image} alt="news" width={120} height={80} />
              </div>
              <div className="content">
                <div className="flex gap-12 md-gap-6 justify-start mb-6">
                  <span className="text-xs">by Admin</span>
                  <span className="text-xs">{post.date}</span>
                  <span className="text-xs text-highlight uppercase text-underline">{post.category}</span>
                </div>
                <p className="title h7">{post.title}</p>
              </div>
            </Link>
            {index < RECENT_POSTS.length - 1 && <div className="divider mb-16 w-full" />}
          </div>
        ))}
      </div>

      <div className="divider mb-32 w-full" />

      <p className="h4 mb-16">Type Car</p>
      <ul className="widget-categories mb-32">
        {TYPE_CAR.map((type, index) => (
          <li key={type.label}>
            <Link href="/blog-grid-style-1" className={index === 0 ? "active" : undefined}>
              <span className="label">{type.label}</span>
              <span>({type.count})</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="divider mb-32 w-full" />

      <p className="h4 mb-18">Subscribe Newsletter</p>
      <form action="#" className="widget-search w-full mb-34" onSubmit={(event) => event.preventDefault()}>
        <input className="input-normal" type="text" name="search-headerSubscribe" required id="search-headerSubscribe" placeholder="Email address" />
        <button type="submit" className="widget-search-btn" aria-label="Subscribe">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.3112 2.689C21.1226 2.5005 20.8871 2.36569 20.629 2.29846C20.371 2.23122 20.0997 2.234 19.843 2.3065H19.829L1.83461 7.7665C1.54248 7.85069 1.28283 8.02166 1.09007 8.25676C0.897302 8.49185 0.780525 8.77997 0.75521 9.08294C0.729895 9.3859 0.797238 9.6894 0.948314 9.95323C1.09939 10.2171 1.32707 10.4287 1.60117 10.5602L9.56242 14.4377L13.4343 22.3943C13.5547 22.6513 13.7462 22.8685 13.9861 23.0201C14.226 23.1718 14.5042 23.2517 14.788 23.2502C14.8312 23.2502 14.8743 23.2484 14.9174 23.2446C15.2201 23.2201 15.5081 23.1036 15.7427 22.9107C15.9773 22.7178 16.1473 22.4578 16.2299 22.1656L21.6862 4.17119C21.6862 4.1665 21.6862 4.16181 21.6862 4.15712C21.7596 3.90115 21.7636 3.63024 21.6977 3.37223C21.6318 3.11421 21.4984 2.8784 21.3112 2.689ZM14.7965 21.7362L14.7918 21.7493V21.7427L11.0362 14.0271L15.5362 9.52712C15.6709 9.38533 15.7449 9.19651 15.7424 9.00094C15.7399 8.80537 15.6611 8.61852 15.5228 8.48022C15.3845 8.34191 15.1976 8.26311 15.002 8.26061C14.8065 8.2581 14.6177 8.3321 14.4759 8.46681L9.97586 12.9668L2.25742 9.21119H2.25086H2.26399L20.2499 3.75025L14.7965 21.7362Z" fill="#1C1C1C" />
          </svg>
        </button>
      </form>

      <div className="divider mb-32 w-full" />

      <p className="h4 mb-16">Tags</p>
      <ul className="widget-tags">
        {TAGS.map((tag, index) => (
          <li key={tag}>
            <Link href={tagsHref} className={index === 0 ? "active" : undefined}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
