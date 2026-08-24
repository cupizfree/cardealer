import Image from "next/image";

// Migrated from ../aurexo/blog-details-2.html lines 456-460. Genuinely different from
// `blog-details/BlogDetailsBanner.tsx`: no overlay image, no breadcrumb (this page has none at all,
// confirmed via source read), no h1/meta — just the plain banner image. The title/meta row lives in
// `BlogDetails2Content` instead, in a centered `.bloc-details-container` card that visually overlaps
// this image via a pure-CSS negative margin (`blog.scss`'s `.bloc-details-container { margin: -78px
// auto 0 }`), no JS needed. Hardcoded to `blog-details-2.jpg` rather than sourced from `post.bannerImage`
// — this is a static layout-variant page (same situation as `listing-details-2..6`), and this exact
// image is source's own literal demo asset for this template regardless of which real post is shown
// through it.
export default function BlogDetails2Banner() {
  return (
    <section className="blog-details-banner">
      <div className="image flex">
        <Image src="/assets/images/blog/blog-details-2.jpg" alt="blog-details-banner" width={1600} height={640} />
      </div>
    </section>
  );
}
