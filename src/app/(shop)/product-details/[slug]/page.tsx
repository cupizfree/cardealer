import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ProductGallery from "@/components/product-details/ProductGallery";
import ProductInfo from "@/components/product-details/ProductInfo";
import ProductTabs from "@/components/product-details/ProductTabs";
import RelatedProducts from "@/components/product-details/RelatedProducts";
import { allProducts, getRelatedProducts, withProductDetailFallback } from "@/data/products";

export function generateStaticParams() {
  return allProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = allProducts.find((p) => p.slug === slug);
  return {
    title: product ? `${product.title} | Aurexo` : "Product Details | Aurexo",
    description: product ? `${product.title} — ${product.price}` : undefined,
  };
}

// Migrated from ../aurexo/product-details.html — see src/data/products.ts for the full source-evidence
// trail (the breadcrumb/title/description/add-to-cart-label mismatches, the broken gallery pairing,
// the shirt-copy "Description" tab, the Privacy-Policy "Shipping & Returns" tab). Only product id 1
// (this page's own real subject) has real detail-page content; every other product in `allProducts` is
// a card-only stub from this page's own "Related Products" carousel and renders the same full section
// layout via `withProductDetailFallback` — same precedent as `/listing-details/[slug]`'s
// `withDetailFallback`.
export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = allProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  const detail = withProductDetailFallback(product);
  const related = getRelatedProducts(product, 4);

  return (
    <>
      <Header />

      <section className="background-light">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <Link href="/">Pages</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <Link href="/shop">Shop</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span>{product.breadcrumbLabel ?? product.title}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-white pb-100 product-details-page">
        <div className="container flat-tabs">
          <div className="tf-spacing-style3" />

          <div className="flex md-flex-col gap-30">
            <div className="product-details-slider">
              <ProductGallery images={detail.gallery} />
            </div>

            <ProductInfo product={detail} />
          </div>

          <ProductTabs product={detail} />

          {related.length > 0 && <RelatedProducts products={related} />}
        </div>
      </section>

      <Footer />
    </>
  );
}
