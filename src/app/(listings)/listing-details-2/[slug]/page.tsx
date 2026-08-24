import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import DetailsGalleryGrid from "@/components/listing-details/DetailsGalleryGrid";
import ListingDetailsBreadcrumb from "@/components/listing-details/ListingDetailsBreadcrumb";
import ListingDetailsTitleBar from "@/components/listing-details/ListingDetailsTitleBar";
import ListingDetailsContent from "@/components/listing-details/ListingDetailsContent";
import ListingDetailsSidebar from "@/components/listing-details/ListingDetailsSidebar";
import RelatedListings from "@/components/listing-details/RelatedListings";
import { allListings, getRelatedListings, withDetailFallback, type ListingGalleryImage } from "@/data/listings";

// Same "reuse the generic filler stills" precedent as `GENERIC_GALLERY_FILLER` in
// `/listing-details/[slug]` — this layout needs exactly 4 thumbnails (a 2x2 grid) instead of a
// 9-slide swiper loop, so only 4 filler entries are needed, cycling the same 3 generic images.
const THUMBNAIL_FILLER: ListingGalleryImage[] = [
  { src: "/assets/images/inner-page/slide-listing-details-2.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-3.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-4.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-2.jpg", alt: "listing-details" },
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

// Migrated from ../aurexo/listing-details-2.html — a LAYOUT VARIANT of the same detail-page template
// as listing-details-1.html, not a distinct listing (see docs/migration/LISTING_DATA_MAP.md's stated
// plan for listing-details-2..6.html). Confirmed via direct source diff against listing-details-1.html:
// same sidebar (Cash/Finance box, contact-dealer, Send Inquiry form — byte-identical, reused as-is),
// same Description/Financing Calculator/Location/rating-box/comments content — only 3 things differ:
// (1) gallery is a 1-main + 2x2-thumbnail grid with a Fancybox-style lightbox instead of a Swiper
// carousel — genuinely different DOM, hence the separate `DetailsGalleryGrid` component; (2) Car
// Overview is a single flat icon+value list (no "Label:" text) instead of the 2-column labeled list;
// (3) the default-active feature tab is "Interior" instead of "Exterior", and the "add a review"
// section only ever shows the Login-gated button (no visible form fields), unlike
// listing-details-1.html which shows both. (2) and (3) are handled as props on the SAME
// `ListingDetailsContent` — see that component's header comment — rather than a duplicated file.
//
// Per LISTING_DATA_MAP.md, the actual per-listing content (description/features/reviews/dealer) is
// NOT re-transcribed from this page's own source (which has an unrelated Honda HR-V description and
// a differently-shuffled feature-item list — clearly more of the same per-page filler-content drift
// already documented elsewhere) — it reuses the one canonical detail dataset via
// `withDetailFallback`, exactly like the `/listing-details/[slug]` route.
export default async function ListingDetails2Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = allListings.find((l) => l.slug === slug);
  if (!listing) notFound();

  const related = getRelatedListings(listing, 4);
  const galleryThumbnails =
    listing.gallery && listing.gallery.length > 1
      ? [...listing.gallery.slice(1), ...listing.gallery.slice(1)].slice(0, 4)
      : THUMBNAIL_FILLER;
  const gallery = [listing.gallery?.[0] ?? { src: listing.image, alt: listing.title }, ...galleryThumbnails];
  const detail = withDetailFallback(listing);

  return (
    <>
      <Header variant="style-1" />

      <ListingDetailsBreadcrumb title={listing.title} sectionClassName="background-light" />
      <div className="tf-spacing-style3 md-hidden" />

      <DetailsGalleryGrid images={gallery} />

      <section className="pb-100">
        <div className="tf-spacing-style4" />
        <div className="container">
          <ListingDetailsTitleBar title={listing.title} />

          <div className="listing-details">
            <ListingDetailsContent listing={detail} overviewLayout="flat" featureDefaultTab="Interior" reviewFormVariant="loginOnly" />
            <ListingDetailsSidebar price={listing.price} dealer={detail.dealer} />
          </div>
        </div>
      </section>

      {related.length > 0 && <RelatedListings listings={related} />}

      <Footer />
    </>
  );
}
