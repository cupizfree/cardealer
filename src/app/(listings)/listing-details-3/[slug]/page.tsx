import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import DetailsGalleryWithThumbs from "@/components/listing-details/DetailsGalleryWithThumbs";
import ListingDetailsBreadcrumb from "@/components/listing-details/ListingDetailsBreadcrumb";
import ListingDetailsTitleBar from "@/components/listing-details/ListingDetailsTitleBar";
import ListingDetailsContent from "@/components/listing-details/ListingDetailsContent";
import ListingDetailsSidebar from "@/components/listing-details/ListingDetailsSidebar";
import RelatedListings from "@/components/listing-details/RelatedListings";
import { allListings, getRelatedListings, withDetailFallback, type ListingGalleryImage } from "@/data/listings";

// Same "reuse the generic filler stills" precedent as the other listing-details routes — this
// layout's main+thumbnail sliders show 7 slides in source (cycling the same 3 generic images twice
// over), so 6 filler entries plus the listing's own real photo covers it.
const GALLERY_FILLER: ListingGalleryImage[] = [
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

// Migrated from ../aurexo/listing-details-3.html — another LAYOUT VARIANT of the same detail-page
// template/dataset (see docs/migration/LISTING_DATA_MAP.md's plan, and COMPONENT_MAP.md #29/#30).
// Confirmed via direct source diff against listing-details-1/2.html: sidebar's Send Inquiry form,
// contact-dealer box, and Description/Financing Calculator/Location/rating-box/comments content are
// unchanged — reused as-is. What's different this time:
// - Gallery is a main+thumbnail-strip swiper pair (`DetailsGalleryWithThumbs`) nested INSIDE
//   `.listing-details--content` alongside the title bar (not a separate full-width section above
//   `.listing-details`, unlike v1/v2) — hence `bare` on `ListingDetailsContent` and this page
//   assembling `.listing-details--content` itself.
// - Car Overview moved into the SIDEBAR (`overviewLayout="none"` here, `overview` passed to
//   `ListingDetailsSidebar` instead) as a `car-overview-list-style2` box between the Cash/Finance box
//   and the contact-dealer box.
// - Default feature tab is "Safety" (confirmed via source's `active` markers), and — same as
//   listing-details-2.html — the "add a review" section is Login-gated only, no visible form fields.
export default async function ListingDetails3Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = allListings.find((l) => l.slug === slug);
  if (!listing) notFound();

  const related = getRelatedListings(listing, 4);
  const gallery = listing.gallery
    ? [...listing.gallery, ...GALLERY_FILLER].slice(0, 7)
    : [{ src: listing.image, alt: listing.title }, ...GALLERY_FILLER];
  const detail = withDetailFallback(listing);

  return (
    <>
      <Header variant="style-1" />

      <ListingDetailsBreadcrumb title={listing.title} sectionClassName="mb-22 background-light" />

      <section className="pb-100">
        <div className="tf-spacing-style4" />
        <div className="container">
          <div className="listing-details">
            <div className="listing-details--content">
              <ListingDetailsTitleBar title={listing.title} />
              <DetailsGalleryWithThumbs images={gallery} />
              <ListingDetailsContent
                listing={detail}
                overviewLayout="none"
                featureDefaultTab="Safety"
                reviewFormVariant="loginOnly"
                bare
              />
            </div>
            <ListingDetailsSidebar price={listing.price} dealer={detail.dealer} overview={detail.overview} />
          </div>
        </div>
      </section>

      {related.length > 0 && <RelatedListings listings={related} />}

      <Footer />
    </>
  );
}
