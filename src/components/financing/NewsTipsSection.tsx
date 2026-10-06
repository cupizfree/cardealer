import Image from "next/image";
import Link from "next/link";

// Migrated from ../aurexo/financing.html lines 564-623. `.post-style-6` — a new blog-card shape (no
// equivalent component existed yet when this was first built, since no blog page had been migrated).
// These 3 posts are now real entries in `src/data/blogPosts.ts` (ids 2-4, captured from this exact
// section) — each card links to its own real `/blog-details-1/[slug]` instead of the single generic
// `/blog-details-1` this originally pointed at before that dataset existed.
import { allBlogPosts } from "@/data/blogPosts";

const posts = allBlogPosts.slice(1, 4);

export default function NewsTipsSection() {
  return (
    <section className="bg-white py-100">
      <div className="container wow fadeIn" data-wow-delay="0.1s">
        <div className="mb-40">
          <h2 className="capitalize mb-12">Berita &amp; tips seputar kredit mobil</h2>
          <p className="text-secondary h7 line-height-28">
            Dapatkan wawasan terbaru, tips ahli, dan kabar terkini seputar dunia otomotif.
          </p>
        </div>

        <div className="grid-cols-3 grid md-grid-cols-1 gap-30">
          {posts.map((post) => (
            <Link href={`/blog-details-1/${post.slug}`} className="post-style-6 overflow-hidden" key={post.title}>
              <div className="image">
                <Image className="post--img flex" src={post.cardImage} alt="news" width={675} height={450} />
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
    </section>
  );
}
