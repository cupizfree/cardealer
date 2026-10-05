"use client";

import Image from "next/image";
import Link from "next/link";
import type { BlogPostWithDetail } from "@/data/blogPosts";

// Migrated from ../aurexo/blog-details-1.html lines 457-490.
export default function BlogDetailsBanner({ post }: { post: BlogPostWithDetail }) {
  return (
    <section className="blog-details-banner">
      <Image className="overlay-image" src="/assets/images/blog/overlay-blogdetails.png" alt="blog-details-banner" fill />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link className="text-white" href="/">
                Beranda
              </Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span className="text-muted">{post.title}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="image flex">
        <Image src={post.bannerImage} alt="blog-details-banner" width={1600} height={640} />
      </div>

      <div className="content">
        <div className="container">
          <h1 className="mb-20 text-white letter-spacing-1">{post.title}</h1>

          <ul className="flex items-center flex-wrap gap-20">
            <li>
              <a className="text-white" href="#" onClick={(event) => event.preventDefault()}>
                by {post.author}
              </a>
            </li>
            <li>
              <a className="text-white" href="#" onClick={(event) => event.preventDefault()}>
                {post.date}
              </a>
            </li>
            <li>
              <a className="uppercase text-underline text-highlight" href="#" onClick={(event) => event.preventDefault()}>
                {post.category}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
