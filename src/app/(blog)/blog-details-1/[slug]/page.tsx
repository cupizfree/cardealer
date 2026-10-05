import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import BlogDetailsBanner from "@/components/blog-details/BlogDetailsBanner";
import BlogPostBody from "@/components/blog-details/BlogPostBody";
import BlogComments from "@/components/blog-details/BlogComments";
import BlogSidebar from "@/components/blog-details/BlogSidebar";
import RelatedArticles from "@/components/blog-details/RelatedArticles";
import { allBlogPosts, withBlogPostDetailFallback } from "@/data/blogPosts";

export function generateStaticParams() {
  return allBlogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = allBlogPosts.find((p) => p.slug === slug);
  return {
    title: post ? `${post.title}` : "Artikel",
    description: post?.excerpt ?? post?.intro,
  };
}

// Migrated from ../aurexo/blog-details-1.html — see src/data/blogPosts.ts for the full source-evidence
// trail. Only post id 1 (this page's own real subject) has real detail-page content; ids 2-4 are real
// card titles/images/dates already captured from financing.html's `NewsTipsSection` (which linked all
// 3 generically to `/blog-details-1` before this dataset existed — now pointed at their own real slug,
// see that component's updated header comment) and render the same full section layout via
// `withBlogPostDetailFallback`, same precedent as `/listing-details/[slug]`/`/product-details/[slug]`.
export default async function BlogDetails1Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allBlogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const detail = withBlogPostDetailFallback(post);

  return (
    <>
      <Header />

      <BlogDetailsBanner post={detail} />

      <section>
        <div className="tf-spacing" />
        <div className="container innerpage-container">
          <div className="innerpage__content md-mb-30">
            <BlogPostBody post={detail} />
            <BlogComments comments={detail.comments} />
          </div>

          <BlogSidebar />
        </div>
      </section>

      <RelatedArticles />

      <Footer />
    </>
  );
}
