import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import DetailsGalleryFadeThumbs from "@/components/listing-details/DetailsGalleryFadeThumbs";
import ListingDetailsBreadcrumb from "@/components/listing-details/ListingDetailsBreadcrumb";
import ListingDetailsScrollNav from "@/components/listing-details/ListingDetailsScrollNav";
import ListingDetailsTitleBar from "@/components/listing-details/ListingDetailsTitleBar";
import ListingDetailsContent from "@/components/listing-details/ListingDetailsContent";
import ListingDetailsSidebar from "@/components/listing-details/ListingDetailsSidebar";
import RelatedListings from "@/components/listing-details/RelatedListings";
import { getRelatedListings, withDetailFallback, type ListingGalleryImage } from "@/data/listings";
import { muatKatalog } from "@/lib/katalog";

// Same "reuse the generic filler stills" precedent as the other listing-details routes — source's
// gallery needs 5 total images (main+thumbs synced, see DetailsGalleryFadeThumbs's header comment for
// why source's own mismatched 5-main/5-thumbs pairing isn't reproduced), so 4 filler entries plus the
// listing's own real photo covers it.
const GALLERY_FILLER: ListingGalleryImage[] = [
  { src: "/assets/images/inner-page/slide-listing-details-2.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-3.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-4.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-2.jpg", alt: "listing-details" },
];

export function generateStaticParams() {
  return muatKatalog().map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = muatKatalog().find((l) => l.slug === slug);
  return {
    title: listing ? `${listing.title}` : "Detail Unit",
    description: listing ? `${listing.title} — ${listing.price}` : undefined,
  };
}

// Migrated from ../aurexo/listing-details-6.html — a 6th LAYOUT VARIANT of the same detail-page
// template/dataset (see docs/migration/LISTING_DATA_MAP.md's plan, COMPONENT_MAP.md #33). Confirmed
// via direct source diff against listing-details-5.html: sidebar, scroll-nav, id-placement scheme,
// Car Overview style (`car-overview-list-style4`), and default feature tab ("Technology") are all
// byte-identical — reused. The ONLY real difference is the gallery: a fade-effect autoplay carousel
// with a floating vertical thumbnail strip (`DetailsGalleryFadeThumbs`) instead of v5's plain single
// carousel. Unlike v5, source does NOT wire the breadcrumb's Prev/Next to this gallery (no matching
// dual-nav script targets this page's gallery class) — so `interactiveNav` is deliberately omitted
// here (see that component's header comment).
export default async function ListingDetails6Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = muatKatalog().find((l) => l.slug === slug);
  if (!listing) notFound();

  const related = getRelatedListings(listing, 4);
  const gallery = listing.gallery
    ? [...listing.gallery, ...GALLERY_FILLER].slice(0, 5)
    : [{ src: listing.image, alt: listing.title }, ...GALLERY_FILLER];
  const detail = withDetailFallback(listing);

  return (
    <>
      <Header variant="style-1" />

      <ListingDetailsBreadcrumb title={listing.title} />

      <DetailsGalleryFadeThumbs images={gallery} />

      <section className="pb-100">
        <div className="tf-spacing-style4" />
        <div className="container">
          <ListingDetailsScrollNav />
          <ListingDetailsTitleBar title={listing.title} />

          <div className="listing-details">
            <ListingDetailsContent
              listing={detail}
              overviewLayout="cardsRow"
              featureDefaultTab="Technology"
              sectionIds
              wrapperId="Overview"
            />
            <ListingDetailsSidebar price={listing.price} dealer={detail.dealer} sendInquiryId="Inquiry" />
          </div>
        </div>
      </section>

      {related.length > 0 && <RelatedListings listings={related} />}

      <Footer />
    </>
  );
}
