import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import DetailsGalleryCarousel from "@/components/listing-details/DetailsGalleryCarousel";
import ListingDetailsBreadcrumb from "@/components/listing-details/ListingDetailsBreadcrumb";
import ListingDetailsScrollNav from "@/components/listing-details/ListingDetailsScrollNav";
import ListingDetailsTitleBar from "@/components/listing-details/ListingDetailsTitleBar";
import ListingDetailsContent from "@/components/listing-details/ListingDetailsContent";
import ListingDetailsSidebar from "@/components/listing-details/ListingDetailsSidebar";
import RelatedListings from "@/components/listing-details/RelatedListings";
import { getRelatedListings, withDetailFallback, type ListingGalleryImage } from "@/data/listings";
import { muatKatalog } from "@/lib/katalog";

// Same "reuse the generic filler stills" precedent as the other listing-details routes — source's
// own carousel cycles only 3 unique images across 4 slides, so 3 filler entries plus the listing's
// own real photo covers it.
const GALLERY_FILLER: ListingGalleryImage[] = [
  { src: "/assets/images/inner-page/slide-listing-details-2.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-3.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-4.jpg", alt: "listing-details" },
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

// Migrated from ../aurexo/listing-details-5.html — a 5th LAYOUT VARIANT of the same detail-page
// template/dataset (see docs/migration/LISTING_DATA_MAP.md's plan, COMPONENT_MAP.md #32). Confirmed
// via direct source diff against v1-v4: sidebar (Cash/Finance, contact-dealer, Send Inquiry),
// Description/Financing Calculator/Location/rating-box/comments, the scroll-to-anchor tab bar, and
// the id placement scheme are all unchanged from listing-details-4.html — reused. What differs from
// v4:
// - Gallery is a single-slide carousel (`DetailsGalleryCarousel`, `.swiper-listing-details-5`) — a
//   4th distinct single-carousel config (no loop, `initialSlide: 1`, `speed: 800`, no responsive
//   breakpoint bump), with real dual navigation: both the breadcrumb's Prev/Next AND the nav buttons
//   rendered inside the gallery drive the same swiper (source gives both pairs a shared
//   `navigation-prev`/`navigation-next` class) — hence `interactiveNav` on the breadcrumb below.
// - Car Overview is a 5th presentation: a 4-column bordered-card grid, icon on the left
//   (`overviewLayout="cardsRow"`).
// - Default feature tab is "Technology".
export default async function ListingDetails5Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = muatKatalog().find((l) => l.slug === slug);
  if (!listing) notFound();

  const related = getRelatedListings(listing, 4);
  const gallery = listing.gallery
    ? [...listing.gallery, ...GALLERY_FILLER].slice(0, 4)
    : [{ src: listing.image, alt: listing.title }, ...GALLERY_FILLER];
  const detail = withDetailFallback(listing);

  return (
    <>
      <Header variant="style-1" />

      <ListingDetailsBreadcrumb title={listing.title} interactiveNav />

      <DetailsGalleryCarousel images={gallery} />

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
              reviewFormVariant="loginOnly"
              sectionIds
              wrapperId="Overview"
              reviewsHeaderButton={false}
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
