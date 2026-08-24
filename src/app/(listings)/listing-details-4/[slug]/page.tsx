import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import DetailsGalleryAccordion from "@/components/listing-details/DetailsGalleryAccordion";
import ListingDetailsBreadcrumb from "@/components/listing-details/ListingDetailsBreadcrumb";
import ListingDetailsScrollNav from "@/components/listing-details/ListingDetailsScrollNav";
import ListingDetailsTitleBar from "@/components/listing-details/ListingDetailsTitleBar";
import ListingDetailsContent from "@/components/listing-details/ListingDetailsContent";
import ListingDetailsSidebar from "@/components/listing-details/ListingDetailsSidebar";
import RelatedListings from "@/components/listing-details/RelatedListings";
import { allListings, getRelatedListings, withDetailFallback, type ListingGalleryImage } from "@/data/listings";

// Same "reuse the generic filler stills" precedent as the other listing-details routes — the
// accordion gallery needs 6 total images (source's own 6 panels), so 5 filler entries plus the
// listing's own real photo covers it.
const GALLERY_FILLER: ListingGalleryImage[] = [
  { src: "/assets/images/inner-page/slide-listing-details-2.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-3.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-4.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-2.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-3.jpg", alt: "listing-details" },
];

export function generateStaticParams() {
  return allListings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = allListings.find((l) => l.slug === slug);
  return {
    title: listing ? `${listing.title} | Aurexo` : "Listing Details | Aurexo",
    description: listing ? `${listing.title} — ${listing.price}` : undefined,
  };
}

// Migrated from ../aurexo/listing-details-4.html — a 4th LAYOUT VARIANT of the same detail-page
// template/dataset (see docs/migration/LISTING_DATA_MAP.md's plan, COMPONENT_MAP.md #31). Confirmed
// via direct source diff against v1/v2/v3: sidebar's Cash/Finance box, contact-dealer box, Send
// Inquiry form, and Description/Financing Calculator/Location/rating-box/comments content are
// unchanged — reused as-is (the differing dealer name/avatar and a `style-2` modifier class on the
// contact-dealer box have no real effect — no matching CSS rule found — and are per-page filler-text
// drift, not reproduced). What's different this time:
// - Gallery is a click-to-expand "accordion" of 6 panels (`DetailsGalleryAccordion`) — a 4th distinct
//   gallery DOM shape. Source's companion mobile-only swiper is degenerate demo content (both its
//   slides are the same image) and isn't reproduced — see that component's header comment.
// - A real scroll-to-anchor tab bar (`ListingDetailsScrollNav`) sits above the title bar; its
//   "Inquiry" link targets the sidebar's Send Inquiry box specifically, hence `sendInquiryId="Inquiry"`
//   below.
// - Car Overview is a 4th presentation: a 5-column bordered-card grid (`overviewLayout="cards"`).
// - Default feature tab is "Mechanical"; the "Customer Reviews" heading has no small "Write a review"
//   button next to it this time (`reviewsHeaderButton={false}`) — only the rating-box's own button
//   remains; add-review section is login-gated only (same as v2/v3).
export default async function ListingDetails4Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = allListings.find((l) => l.slug === slug);
  if (!listing) notFound();

  const related = getRelatedListings(listing, 4);
  const gallery = listing.gallery
    ? [...listing.gallery, ...GALLERY_FILLER].slice(0, 6)
    : [{ src: listing.image, alt: listing.title }, ...GALLERY_FILLER];
  const detail = withDetailFallback(listing);

  return (
    <>
      <Header variant="style-1" />

      <ListingDetailsBreadcrumb title={listing.title} />

      <DetailsGalleryAccordion images={gallery} />

      <section className="pb-100">
        <div className="tf-spacing-style4" />
        <div className="container">
          <ListingDetailsScrollNav />
          <ListingDetailsTitleBar title={listing.title} />

          <div className="listing-details">
            <ListingDetailsContent
              listing={detail}
              overviewLayout="cards"
              featureDefaultTab="Mechanical"
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
