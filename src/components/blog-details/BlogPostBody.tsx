import Image from "next/image";
import Link from "next/link";
import type { BlogPostWithDetail } from "@/data/blogPosts";
import { FacebookIcon, XIcon, InstagramIcon } from "@/components/common/SocialIcons";

// Migrated from ../aurexo/blog-details-1.html lines 498-621. Share-this-post icons are the same
// Facebook/X/Instagram set as `common/SocialIcons.tsx` (byte-identical path data, confirmed via source
// diff) — reused directly rather than re-transcribed.
//
// Previous/Next navigation literally names 2 of the 3 stub posts in `allBlogPosts` ("Truck vs.
// Minivan..."/"Tires: All-Season vs. Summer vs. Winter...") but its own real `href` points at
// `blog-details-2.html` (not this dataset) — confirmed via source read, a genuine cross-family
// reference to a template that hasn't been analyzed/migrated yet (see `MIGRATION_STATUS.md`'s explicit
// note to diff blog-details-2 before assuming a shared layout). Kept as a literal `/blog-details-2`
// link rather than silently rewired to point at this page's own matching stub slug.
export default function BlogPostBody({ post }: { post: BlogPostWithDetail }) {
  return (
    <>
      <Image className="post--img radius-20 flex mb-40" src={post.bodyImage} alt="news" width={1170} height={480} />

      <p className="h7 text-secondary mb-28 line-height-28">{post.intro}</p>

      <div className="quote mb-28">
        <div className="content">
          <p className="h4 mb-14 capitalize">{post.quote.text}</p>
          <p className="h7 flex items-center gap-8">
            <Image src="/assets/icons/line.svg" alt="quote" width={20} height={2} />
            {post.quote.author}
          </p>
        </div>
        <Image className="icon-quote" src="/assets/icons/quote.svg" alt="quote" width={40} height={32} />
      </div>

      <p className="text-secondary mb-40 h7 line-height-28">{post.introContinued}</p>

      <div className="grid grid-cols-2 md-grid-cols-1 gap-20 mb-40">
        <div>
          <Image className="radius-20 flex" src={post.sideImages[0]} alt="news" width={570} height={380} />
        </div>
        <div>
          <Image className="radius-20 flex" src={post.sideImages[1]} alt="news" width={570} height={380} />
        </div>
      </div>

      {post.sections.map((section) => (
        <div key={section.heading}>
          <p className="h4 mb-12 capitalize">{section.heading}</p>
          <p className="mb-28 text-secondary h7 line-height-28">{section.body}</p>
        </div>
      ))}

      <p className="h4 mb-12">{post.conclusion.heading}</p>
      <p className="text-secondary h7 line-height-28 mb-40">{post.conclusion.body}</p>

      <div className="flex justify-between mb-40 gap-16 md-flex-col">
        <ul className="blog-detail-tags flex gap-12">
          <li>
            <p>Tag:</p>
          </li>
          {post.tags.map((tag) => (
            <li key={tag}>
              <Link href="/blog-standard">{tag}</Link>
            </li>
          ))}
        </ul>

        <ul className="blog-detail-social flex gap-12">
          <li>
            <a href="https://www.facebook.com/">
              <FacebookIcon stroke="#1C1C1C" />
            </a>
          </li>
          <li>
            <a href="https://x.com/">
              <XIcon stroke="#1C1C1C" />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/">
              <InstagramIcon stroke="#1C1C1C" />
            </a>
          </li>
        </ul>
      </div>

      <div className="divider mb-26" />

      <div className="flex justify-between mb-24 blog-detail-recentpost">
        <div className="previous">
          <p className="font-weight-600 text-highlight uppercase mb-4">PREVIOUS</p>
          <Link href="/blog-details-2" className="h5 font-weight-500 capitalize">
            Truck vs. Minivan: Which is Better for Family Needs?
          </Link>
        </div>

        <div className="next">
          <p className="font-weight-600 text-highlight uppercase mb-4 text-right">NEXT</p>
          <Link href="/blog-details-2" className="h5 font-weight-500 text-right capitalize">
            Tires: All-Season vs. Summer vs. Winter – What You Need to Know
          </Link>
        </div>
      </div>

      <div className="divider mb-40" />
    </>
  );
}
