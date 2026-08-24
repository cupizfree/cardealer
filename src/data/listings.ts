// Canonical Aurexo listing entity. See docs/migration/LISTING_DATA_MAP.md for the source evidence,
// the card <-> canonical <-> detail-page mapping, and every documented gap/discrepancy below.

export type ListingBadge = {
  text: string; // "Special" | "Great Price" — open string, source shows only these 2 values
  colorClass: string; // "bg-primary-2" | "bg-green" — raw class token, mirrors source markup
};

export type ListingFinancing = {
  monthlyPrice: string; // e.g. "$588/mo"
  detailsLabel: string; // e.g. "See Finance"
};

// The 4-field row shown on every card.
export type ListingSpec = {
  mileage: string;
  year: string;
  fuel: string;
  transmission: string;
};

// Detail-only: the 10-field "Car Overview" / Compare-modal spec set. Extends the card's 4 fields
// with 6 detail-only fields. NOTE: for listing id 1, these values do NOT numerically agree with
// `spec` (different source section, never reconciled — see LISTING_DATA_MAP.md).
export type ListingOverview = ListingSpec & {
  color: string;
  location: string;
  interior: string;
  engine: string;
  vin: string;
  stockNumber: string;
};

export type ListingGalleryImage = {
  src: string;
  alt: string;
};

export type FeatureCategory =
  | "Exterior"
  | "Interior"
  | "Safety"
  | "Mechanical"
  | "Technology"
  | "Other";

export type ListingFeatures = Record<FeatureCategory, string[]>;

export type ListingLocation = {
  address: string;
  mapEmbedUrl: string;
};

export type RatingDistribution = {
  stars: 1 | 2 | 3 | 4 | 5;
  percent: number;
};

export type ListingRatingSummary = {
  average: number;
  count: number;
  distribution: RatingDistribution[];
};

export type Review = {
  id: number;
  authorName: string;
  authorAvatar?: string;
  authorInitials?: string;
  date: string;
  rating: number;
  text: string;
};

export type DealerInfo = {
  name: string;
  avatar?: string;
  verified: boolean;
  address: string;
  phones: string[];
};

export type Listing = {
  id: number;
  slug: string;

  // Card + detail shared core — populated for all 12 records.
  title: string;
  image: string;
  brandLabel: string;
  brandHref?: string;
  badge?: ListingBadge;
  photoCount: number;
  videoCount: number;
  price: string;
  financing?: ListingFinancing;
  spec: ListingSpec;

  // Detail-only — populated ONLY where a detail page was actually analyzed (id 1 today).
  overview?: ListingOverview;
  gallery?: ListingGalleryImage[];
  description?: string;
  features?: ListingFeatures;
  location?: ListingLocation;
  ratingSummary?: ListingRatingSummary;
  reviews?: Review[];
  dealer?: DealerInfo;
  relatedListingIds?: number[];
};

export type ListingCardData = Pick<
  Listing,
  | "id"
  | "slug"
  | "title"
  | "image"
  | "brandLabel"
  | "brandHref"
  | "badge"
  | "photoCount"
  | "videoCount"
  | "price"
  | "financing"
  | "spec"
>;

export const allListings: Listing[] = [
  {
    id: 1,
    slug: "audi-a6-avant-e-tron",
    title: "Audi A6 Avant E-Tron",
    image: "/assets/images/card/card-1.jpg",
    brandLabel: "Audi",
    badge: { text: "Special", colorClass: "bg-primary-2" },
    photoCount: 8,
    videoCount: 1,
    price: "$44.900,00",
    spec: { mileage: "32500 miles", year: "2022", fuel: "EV", transmission: "Manual" },
    overview: {
      mileage: "51600 km",
      year: "2022",
      fuel: "Benzin + Plin",
      transmission: "Automatic",
      color: "White",
      location: "Tampa, FL",
      interior: "Jet Black",
      engine: "1.5L Inline",
      vin: "1G1ZD5ST0PF",
      stockNumber: "165921",
    },
    gallery: [
      { src: "/assets/images/inner-page/slide-listing-details-1.jpg", alt: "listing-details" },
      { src: "/assets/images/inner-page/slide-listing-details-2.jpg", alt: "listing-details" },
      { src: "/assets/images/inner-page/slide-listing-details-3.jpg", alt: "listing-details" },
      { src: "/assets/images/inner-page/slide-listing-details-4.jpg", alt: "listing-details" },
    ],
    description:
      "The 2024 - 2025 Honda HR-V is offered in 4 variants - which are priced from RM 115,900 to RM 141,900, the base model of hr-v is 2022 Honda HR-V 1.5 S which is at a price of RM 115,900 and the top variant of Honda HR-V is 2022 Honda HR-V RS e:HEV which is offered at a price of RM 141,900.",
    features: {
      // Source repeats the identical 12-item checklist under all 6 tabs — preserved as-is, not
      // differentiated per category, since that repetition is what the source actually contains.
      Exterior: [
        "Power Mirror(s)",
        "Tires - Front All-Season",
        '16" x 6.5" Cast Aluminum Wheels',
        "Power door mirrors",
        "Tires - Rear All-Season",
        '16" x 6.5" Steel Wheels w',
        "Rear Spoiler",
        'Wheels 4-16" x 6.5"',
        "Automatic Headlights",
        "Rear window wiper",
        "Wheel Covers",
        "Bodyside moldings",
      ],
      Interior: [
        "Power Mirror(s)",
        "Tires - Front All-Season",
        '16" x 6.5" Cast Aluminum Wheels',
        "Power door mirrors",
        "Tires - Rear All-Season",
        '16" x 6.5" Steel Wheels w',
        "Rear Spoiler",
        'Wheels 4-16" x 6.5"',
        "Automatic Headlights",
        "Rear window wiper",
        "Wheel Covers",
        "Bodyside moldings",
      ],
      Safety: [
        "Power Mirror(s)",
        "Tires - Front All-Season",
        '16" x 6.5" Cast Aluminum Wheels',
        "Power door mirrors",
        "Tires - Rear All-Season",
        '16" x 6.5" Steel Wheels w',
        "Rear Spoiler",
        'Wheels 4-16" x 6.5"',
        "Automatic Headlights",
        "Rear window wiper",
        "Wheel Covers",
        "Bodyside moldings",
      ],
      Mechanical: [
        "Power Mirror(s)",
        "Tires - Front All-Season",
        '16" x 6.5" Cast Aluminum Wheels',
        "Power door mirrors",
        "Tires - Rear All-Season",
        '16" x 6.5" Steel Wheels w',
        "Rear Spoiler",
        'Wheels 4-16" x 6.5"',
        "Automatic Headlights",
        "Rear window wiper",
        "Wheel Covers",
        "Bodyside moldings",
      ],
      Technology: [
        "Power Mirror(s)",
        "Tires - Front All-Season",
        '16" x 6.5" Cast Aluminum Wheels',
        "Power door mirrors",
        "Tires - Rear All-Season",
        '16" x 6.5" Steel Wheels w',
        "Rear Spoiler",
        'Wheels 4-16" x 6.5"',
        "Automatic Headlights",
        "Rear window wiper",
        "Wheel Covers",
        "Bodyside moldings",
      ],
      Other: [
        "Power Mirror(s)",
        "Tires - Front All-Season",
        '16" x 6.5" Cast Aluminum Wheels',
        "Power door mirrors",
        "Tires - Rear All-Season",
        '16" x 6.5" Steel Wheels w',
        "Rear Spoiler",
        'Wheels 4-16" x 6.5"',
        "Automatic Headlights",
        "Rear window wiper",
        "Wheel Covers",
        "Bodyside moldings",
      ],
    },
    location: {
      // NOTE: does not match overview.location ("Tampa, FL") — unreconciled source inconsistency,
      // see LISTING_DATA_MAP.md. Map iframe coordinates also point to New Jersey, not Atlanta.
      address: "6205 Peachtree Dunwoody Rd, Atlanta, GA 30328",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d97101.88872869895!2d-74.22688511715344!3d40.487336736141906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1689125037376!5m2!1svi!2s",
    },
    ratingSummary: {
      average: 4.8,
      count: 1968,
      distribution: [
        { stars: 5, percent: 60 },
        { stars: 4, percent: 20 },
        { stars: 3, percent: 10 },
        { stars: 2, percent: 7 },
        { stars: 1, percent: 3 },
      ],
    },
    reviews: [
      {
        id: 1,
        authorName: "Randynox",
        authorAvatar: "/assets/images/avatar/coment-avatar-1.png",
        date: "August 13, 2025",
        rating: 5,
        text: "Bought new in 2012, and it’s still running strong at over 180,000 miles. I’ve only had to replace the battery and brakes once. The ride is smooth, the interior still feels solid, and the fuel economy hasn’t dropped much.",
      },
      {
        id: 2,
        authorName: "Mista Nyroom",
        authorInitials: "MN",
        date: "August 22, 2025",
        rating: 5,
        text: "Picked this car up used about five years ago with 90k miles. It’s now at 160k and still starts every morning without hesitation. Maintenance is simple, parts are cheap, and it’s surprisingly comfortable on long drives.",
      },
      {
        id: 3,
        authorName: "Heather Dick",
        authorAvatar: "/assets/images/avatar/coment-avatar-2.png",
        date: "August 18, 2025",
        rating: 5,
        text: "Owned since 2010. Drove it through all kinds of weather, from hot summers to snowy roads, and it never let me down. A few minor repairs here and there — mostly wear and tear — but the engine just keeps going.",
      },
    ],
    dealer: {
      name: "Mike Hanley",
      avatar: "/assets/images/avatar/contact-avatar.png",
      verified: true,
      address: "6205 Peachtree Dunwoody Rd, Atlanta, GA 30328",
      phones: ["1-555-678-8888", "1-555-678-9999"],
    },
  },
  {
    id: 2,
    slug: "2024-hyundai-elantra",
    title: "2024 Hyundai Elantra",
    image: "/assets/images/card/card-2.jpg",
    brandLabel: "Hyundai",
    badge: { text: "Great Price", colorClass: "bg-green" },
    photoCount: 8,
    videoCount: 1,
    price: "$42.800,00",
    financing: { monthlyPrice: "$588/mo", detailsLabel: "See Finance" },
    spec: { mileage: "89300 miles", year: "2018", fuel: "Benzin", transmission: "Auto" },
  },
  {
    id: 3,
    slug: "kia-ev9-2024",
    title: "Kia EV9 2024",
    image: "/assets/images/card/card-3.jpg",
    brandLabel: "Kia",
    photoCount: 8,
    videoCount: 1,
    price: "$45.500,00",
    spec: { mileage: "76400 miles", year: "2020", fuel: "Diesel", transmission: "Auto" },
  },
  {
    id: 4,
    slug: "chevrolet-camaro-2020",
    title: "Chevrolet Camaro 2020",
    image: "/assets/images/card/card-4.jpg",
    brandLabel: "Chevrolet",
    photoCount: 8,
    videoCount: 1,
    price: "$35.500,00",
    spec: { mileage: "45800 miles", year: "2023", fuel: "Benzin", transmission: "Auto" },
  },
  {
    id: 5,
    slug: "audi-r8",
    title: "Audi R8",
    image: "/assets/images/card/card-5.jpg",
    brandLabel: "Audi",
    photoCount: 8,
    videoCount: 1,
    price: "$45.500,00",
    spec: { mileage: "97200 miles", year: "2022", fuel: "EV", transmission: "Manual" },
  },
  {
    id: 6,
    slug: "genesis-electrified-g80",
    title: "Genesis Electrified G80",
    image: "/assets/images/card/card-6.jpg",
    // Source label reads "BMW" though the title is a Genesis — brand/title mismatch preserved
    // verbatim from the source (template authoring drift, not corrected). See LISTING_DATA_MAP.md.
    brandLabel: "BMW",
    badge: { text: "Special", colorClass: "bg-primary-2" },
    photoCount: 8,
    videoCount: 1,
    price: "$24.900,00",
    spec: { mileage: "51600 miles", year: "2021", fuel: "Diesel", transmission: "Auto" },
  },
  {
    id: 7,
    slug: "2020-chevy-camaro-zl1",
    title: "2020 Chevy Camaro ZL1",
    image: "/assets/images/card/card-7.jpg",
    brandLabel: "Chevrolet",
    photoCount: 8,
    videoCount: 1,
    price: "$32.800,00",
    spec: { mileage: "42900 miles", year: "2022", fuel: "EV", transmission: "Auto" },
  },
  {
    id: 8,
    slug: "2022-ford-mustang-gtd",
    title: "2022 Ford Mustang® GTD",
    image: "/assets/images/card/card-8.jpg",
    brandLabel: "Mustang",
    badge: { text: "Great Price", colorClass: "bg-green" },
    photoCount: 8,
    videoCount: 1,
    price: "$15.500,00",
    spec: { mileage: "52900 miles", year: "2020", fuel: "Benzin", transmission: "Auto" },
  },
  {
    id: 9,
    slug: "porsche-911-st",
    title: "Porsche 911 S/T",
    image: "/assets/images/card/card-10.jpg",
    // Source label reads "Mustang" though the title is a Porsche — brand/title mismatch preserved
    // verbatim from the source. See LISTING_DATA_MAP.md.
    brandLabel: "Mustang",
    badge: { text: "Great Price", colorClass: "bg-green" },
    photoCount: 8,
    videoCount: 1,
    price: "$15.500,00",
    spec: { mileage: "52900 miles", year: "2020", fuel: "Benzin", transmission: "Auto" },
  },
  {
    id: 10,
    slug: "2022-ford-gt-white",
    title: "2022 Ford GT White",
    image: "/assets/images/card/card-54.jpg",
    // Source label reads "Chevrolet" though the title is a Ford — brand/title mismatch preserved
    // verbatim from the source. See LISTING_DATA_MAP.md.
    brandLabel: "Chevrolet",
    photoCount: 8,
    videoCount: 1,
    price: "$32.800,00",
    spec: { mileage: "42900 miles", year: "2022", fuel: "EV", transmission: "Auto" },
  },
  {
    id: 11,
    slug: "bmw-x7-pure-excellence-2023",
    title: "Bmw x7 Pure Excellence 2023",
    image: "/assets/images/card/card-9.jpg",
    brandLabel: "BMW",
    photoCount: 8,
    videoCount: 1,
    price: "$24.900,00",
    spec: { mileage: "51600 miles", year: "2021", fuel: "Diesel", transmission: "Auto" },
  },
  {
    id: 12,
    slug: "bmw-x6-electric",
    title: "BMW X6 Electric",
    image: "/assets/images/card/card-55.jpg",
    // Source label reads "Audi" though the title is a BMW — brand/title mismatch preserved
    // verbatim from the source. See LISTING_DATA_MAP.md.
    brandLabel: "Audi",
    photoCount: 8,
    videoCount: 1,
    price: "$45.500,00",
    spec: { mileage: "97200 miles", year: "2022", fuel: "EV", transmission: "Manual" },
  },
  // ids 13-15: index.html's own "Trending Searches Near You" section (`.card-box-style-2`, lines
  // 2576-3095) introduces 3 titles not already in this dataset — confirmed via full source read.
  {
    id: 13,
    slug: "2015-ford-mustang-ecoboost",
    title: "2015 Ford Mustang EcoBoost",
    image: "/assets/images/card/card-9.jpg",
    // Source label reads "BMW" though the title is a Ford Mustang — brand/title mismatch
    // preserved verbatim from the source, same pattern as ids 6/9/10/12 above.
    brandLabel: "BMW",
    badge: { text: "Special", colorClass: "bg-primary-2" },
    photoCount: 8,
    videoCount: 1,
    price: "$44.900,00",
    spec: { mileage: "84500 miles", year: "2022", fuel: "EV", transmission: "Manual" },
  },
  {
    id: 14,
    slug: "mercedes-amg-c-class",
    title: "Mercedes-AMG C-Class",
    image: "/assets/images/card/card-8.jpg",
    // Source label reads "Mustang" (and links `href="#"`, not a real brand page) though the title
    // is a Mercedes — brand/title mismatch preserved verbatim from the source.
    brandLabel: "Mustang",
    badge: { text: "Great Price", colorClass: "bg-green" },
    photoCount: 8,
    videoCount: 1,
    price: "$24.500,00",
    spec: { mileage: "84500 km", year: "2022", fuel: "Benzin", transmission: "Auto" },
  },
  {
    id: 15,
    slug: "2022-toyota-4runner-limited",
    title: "2022 Toyota 4Runner Limited",
    image: "/assets/images/card/card-6.jpg",
    // Source label reads "BMW" though the title is a Toyota — brand/title mismatch preserved
    // verbatim from the source.
    brandLabel: "BMW",
    photoCount: 8,
    videoCount: 1,
    price: "$22.300,00",
    spec: { mileage: "84500 km", year: "2022", fuel: "Diesel", transmission: "Auto" },
  },
];

/**
 * No real "similar vehicle" signal exists in the source (no shared category field is reliably
 * present across the card pool — see LISTING_DATA_MAP.md). Default behavior is an explicit,
 * documented placeholder: exclude the current listing, take the next `count` others. Once a real
 * curation signal is designed, populate `relatedListingIds` on a listing to override this.
 */
export function getRelatedListings(listing: Listing, count = 4): Listing[] {
  if (listing.relatedListingIds?.length) {
    return listing.relatedListingIds
      .map((id) => allListings.find((l) => l.id === id))
      .filter((l): l is Listing => Boolean(l));
  }
  return allListings.filter((l) => l.id !== listing.id).slice(0, count);
}

/**
 * Fills every optional detail-page field a listing is missing (11 of 12 — see
 * LISTING_DATA_MAP.md "Data gaps") with `allListings[0]`'s (the only fully-analyzed detail page)
 * real, source-derived content, so `/listing-details/[slug]` always renders the source's full
 * section layout instead of hiding sections. This mirrors Luminor's own property-details precedent
 * exactly: `Description()`, `Overview()`, and `Comment()` there take no per-property props at all —
 * only title/price/overview-like fields vary per record, everything else is shared/generic across
 * every property. Only `overview`'s 4 fields that double as `spec` (mileage/year/fuel/transmission)
 * stay genuinely per-listing here; its other 6 fields and every other section below reuse the
 * template's real analyzed values — never invented, just shared, exactly like Luminor's approach.
 */
export type ListingWithDetail = Listing &
  Required<Pick<Listing, "overview" | "description" | "features" | "location" | "ratingSummary" | "reviews" | "dealer">>;

export function withDetailFallback(listing: Listing): ListingWithDetail {
  const template = allListings[0];
  return {
    ...listing,
    overview: listing.overview ?? {
      ...listing.spec,
      color: template.overview!.color,
      location: template.overview!.location,
      interior: template.overview!.interior,
      engine: template.overview!.engine,
      vin: template.overview!.vin,
      stockNumber: template.overview!.stockNumber,
    },
    // Non-null assertions: `template` (allListings[0]) is documented as the one fully-analyzed
    // detail record and is guaranteed to carry every optional field — see LISTING_DATA_MAP.md.
    description: listing.description ?? template.description!,
    features: listing.features ?? template.features!,
    location: listing.location ?? template.location!,
    ratingSummary: listing.ratingSummary ?? template.ratingSummary!,
    reviews: listing.reviews ?? template.reviews!,
    dealer: listing.dealer ?? template.dealer!,
  };
}
