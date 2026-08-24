import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import DetailsGallery from "@/components/listing-details/DetailsGallery";
import ListingDetailsBreadcrumb from "@/components/listing-details/ListingDetailsBreadcrumb";
import ListingDetailsTitleBar from "@/components/listing-details/ListingDetailsTitleBar";
import ListingDetailsContent from "@/components/listing-details/ListingDetailsContent";
import ListingDetailsSidebar from "@/components/listing-details/ListingDetailsSidebar";
import RelatedListings from "@/components/listing-details/RelatedListings";
import { allListings, getRelatedListings, withDetailFallback, type ListingGalleryImage } from "@/data/listings";

// The 11 listings without a real `gallery` (see LISTING_DATA_MAP.md) still get the source's full
// 4-slide layout — following Luminor's own precedent (`Slide1.tsx` reuses identical generic filler
// imagery across every property's gallery, id notwithstanding) rather than collapsing to a single
// image. Slide 1 uses the listing's own real card photo (a genuine image of that exact car); slides
// 2-4 reuse the same generic showcase stills id 1's own analyzed gallery uses — decorative filler,
// not claimed as real photos of that specific car.
const GENERIC_GALLERY_FILLER: ListingGalleryImage[] = [
  { src: "/assets/images/inner-page/slide-listing-details-2.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-3.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-4.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-2.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-3.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-4.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-2.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-3.jpg", alt: "listing-details" },
  { src: "/assets/images/inner-page/slide-listing-details-4.jpg", alt: "listing-details" },
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

// Migrated from ../aurexo/listing-details-1.html — see docs/migration/LISTING_DATA_MAP.md for the
// card->canonical->detail mapping this route relies on. Only 1 of 12 listings has real detail content
// (LISTING_DATA_MAP.md "Data gaps"); the other 11 render the SAME full section layout via
// `withDetailFallback` (src/data/listings.ts), reusing that one listing's real Description/Features/
// Location/Reviews/Dealer content — per explicit instruction and Luminor's own precedent (its
// property-details sections take no per-property props at all; only title/price/spec-like fields
// vary per record) — rather than hiding sections for listings without their own analyzed data.
export default async function ListingDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = allListings.find((l) => l.slug === slug);
  if (!listing) notFound();

  const related = getRelatedListings(listing, 4);
  const gallery = listing.gallery ?? [{ src: listing.image, alt: listing.title }, ...GENERIC_GALLERY_FILLER];
  const detail = withDetailFallback(listing);

  return (
    <>
      <Header variant="style-1" />

      <ListingDetailsBreadcrumb title={listing.title} />

      <DetailsGallery images={gallery} />

      <section className="pb-100">
        <div className="tf-spacing-style4" />
        <div className="container">
          <ListingDetailsTitleBar title={listing.title} />

          <div className="listing-details">
            <ListingDetailsContent listing={detail} />
            <ListingDetailsSidebar price={listing.price} dealer={detail.dealer} />
          </div>
        </div>
      </section>

      {related.length > 0 && <RelatedListings listings={related} />}

      <Footer />
    </>
  );
}
