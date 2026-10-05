import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import BlogDetails2Banner from "@/components/blog-details-2/BlogDetails2Banner";
import BlogDetails2Content from "@/components/blog-details-2/BlogDetails2Content";
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

// Migrated from ../aurexo/blog-details-2.html — a genuinely different layout variant of the same blog
// detail template as blog-details-1.html (no breadcrumb, no sidebar, centered single-column content card
// overlapping the banner image), same relationship as `listing-details-1..6` sharing one `allListings`
// dataset across different layouts. Only post id 1 ("Compact SUV vs. Full-Size SUV...") was ever
// analyzed against this specific layout in source; every other slug still renders through it via
// `withBlogPostDetailFallback`, same precedent as blog-details-1's own route.
export default async function BlogDetails2Page({
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

      <BlogDetails2Banner />
      <BlogDetails2Content post={detail} />
      <RelatedArticles centered />

      <Footer />
    </>
  );
}
