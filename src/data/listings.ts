// Canonical Aurexo listing entity. See docs/migration/LISTING_DATA_MAP.md for the source evidence,
// the card <-> canonical <-> detail-page mapping, and every documented gap/discrepancy below.

export type ListingBadge = {
  text: string; // "Istimewa" | "Harga Bagus" — teks lencana pada kartu unit
  colorClass: string; // "bg-primary-2" | "bg-green" — raw class token, mirrors source markup
};

export type ListingFinancing = {
  monthlyPrice: string; // e.g. "$588/mo"
  detailsLabel: string; // mis. "Lihat Simulasi"
};

// The 4-field row shown on every card.
export type ListingSpec = {
  mileage: string;
  year: string;
  fuel: string;
  transmission: string;
};

// Detail-only: the 10-field "Ringkasan Mobil" / Compare-modal spec set. Extends the card's 4 fields
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
    slug: "toyota-avanza-1-5-g-2022",
    title: "Toyota Avanza 1.5 G",
    image: "/assets/images/card/card-1.jpg",
    brandLabel: "Toyota",
    badge: { text: "Istimewa", colorClass: "bg-primary-2" },
    photoCount: 8,
    videoCount: 1,
    price: "Rp 195.000.000",
    spec: { mileage: "32.500 km", year: "2022", fuel: "Bensin", transmission: "Manual" },
    overview: {
      mileage: "32.500 km",
      year: "2022",
      fuel: "Bensin",
      transmission: "Matic",
      color: "Putih",
      location: "Purwokerto, Jawa Tengah",
      interior: "Hitam",
      engine: "1.5L 4 Silinder",
      vin: "MHKM1BA3JKK012345",
      stockNumber: "MRF-165921",
    },
    gallery: [
      { src: "/assets/images/inner-page/slide-listing-details-1.jpg", alt: "listing-details" },
      { src: "/assets/images/inner-page/slide-listing-details-2.jpg", alt: "listing-details" },
      { src: "/assets/images/inner-page/slide-listing-details-3.jpg", alt: "listing-details" },
      { src: "/assets/images/inner-page/slide-listing-details-4.jpg", alt: "listing-details" },
    ],
    description:
      "Toyota Avanza 1.5 G tahun 2022, transmisi manual, satu tangan dari baru, pajak panjang. " +
      "Servis rutin di bengkel resmi dengan buku servis lengkap. Kabin bersih, AC dingin, " +
      "tidak ada bekas tabrakan maupun banjir. Kelengkapan: STNK, BPKB, faktur, dan kunci ganda. " +
      "Unit siap pakai, bisa dicek langsung di showroom Purwokerto atau dibawa ke bengkel pilihan Anda.",
    features: {
      // Source repeats the identical 12-item checklist under all 6 tabs — preserved as-is, not
      // differentiated per category, since that repetition is what the source actually contains.
      Exterior: [
        "Spion elektrik",
        "Ban depan all-season",
        'Velg aluminium 16" x 6.5"',
        "Spion pintu elektrik",
        "Ban belakang all-season",
        'Velg baja 16" x 6.5"',
        "Spoiler belakang",
        'Velg 4 buah 16" x 6.5"',
        "Lampu depan otomatis",
        "Wiper kaca belakang",
        "Cover velg",
        "Lis bodi samping",
      ],
      Interior: [
        "Spion elektrik",
        "Ban depan all-season",
        'Velg aluminium 16" x 6.5"',
        "Spion pintu elektrik",
        "Ban belakang all-season",
        'Velg baja 16" x 6.5"',
        "Spoiler belakang",
        'Velg 4 buah 16" x 6.5"',
        "Lampu depan otomatis",
        "Wiper kaca belakang",
        "Cover velg",
        "Lis bodi samping",
      ],
      Safety: [
        "Spion elektrik",
        "Ban depan all-season",
        'Velg aluminium 16" x 6.5"',
        "Spion pintu elektrik",
        "Ban belakang all-season",
        'Velg baja 16" x 6.5"',
        "Spoiler belakang",
        'Velg 4 buah 16" x 6.5"',
        "Lampu depan otomatis",
        "Wiper kaca belakang",
        "Cover velg",
        "Lis bodi samping",
      ],
      Mechanical: [
        "Spion elektrik",
        "Ban depan all-season",
        'Velg aluminium 16" x 6.5"',
        "Spion pintu elektrik",
        "Ban belakang all-season",
        'Velg baja 16" x 6.5"',
        "Spoiler belakang",
        'Velg 4 buah 16" x 6.5"',
        "Lampu depan otomatis",
        "Wiper kaca belakang",
        "Cover velg",
        "Lis bodi samping",
      ],
      Technology: [
        "Spion elektrik",
        "Ban depan all-season",
        'Velg aluminium 16" x 6.5"',
        "Spion pintu elektrik",
        "Ban belakang all-season",
        'Velg baja 16" x 6.5"',
        "Spoiler belakang",
        'Velg 4 buah 16" x 6.5"',
        "Lampu depan otomatis",
        "Wiper kaca belakang",
        "Cover velg",
        "Lis bodi samping",
      ],
      Other: [
        "Spion elektrik",
        "Ban depan all-season",
        'Velg aluminium 16" x 6.5"',
        "Spion pintu elektrik",
        "Ban belakang all-season",
        'Velg baja 16" x 6.5"',
        "Spoiler belakang",
        'Velg 4 buah 16" x 6.5"',
        "Lampu depan otomatis",
        "Wiper kaca belakang",
        "Cover velg",
        "Lis bodi samping",
      ],
    },
    location: {
      // NOTE: does not match overview.location ("Tampa, FL") — unreconciled source inconsistency,
      // see LISTING_DATA_MAP.md. Map iframe coordinates also point to New Jersey, not Atlanta.
      address: "Jl. A. Jaelani, Karangwangkal, Purwokerto Utara, Banyumas",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d97101.88872869895!2d109.2396016!3d-7.4245941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1689125037376!5m2!1svi!2s",
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
        authorName: "Bagas Prasetyo",
        authorAvatar: "/assets/images/avatar/coment-avatar-1.png",
        date: "13 Agustus 2025",
        rating: 5,
        text: "Beli di sini karena rekomendasi teman. Unitnya sesuai deskripsi, tidak ada yang disembunyikan. Proses balik nama dibantu sampai selesai, plat baru keluar seminggu.",
      },
      {
        id: 2,
        authorName: "Rina Kusumawati",
        authorInitials: "RK",
        date: "22 Agustus 2025",
        rating: 5,
        text: "Awalnya ragu beli mobil bekas online. Ternyata bisa datang langsung ke showroom dan cek unit sepuasnya. Harga masih bisa nego tipis dan cicilan dihitung jelas di depan.",
      },
      {
        id: 3,
        authorName: "Dimas Nugroho",
        authorAvatar: "/assets/images/avatar/coment-avatar-2.png",
        date: "18 Agustus 2025",
        rating: 5,
        text: "Sudah dua kali ambil unit di MARF. Yang pertama untuk usaha, yang kedua untuk keluarga. Tidak pernah ada masalah dokumen. Pelayanannya sabar dan tidak dipaksa-paksa.",
      },
    ],
    dealer: {
      name: "MARF Showroom Mobil Purwokerto",
      avatar: "/assets/images/avatar/contact-avatar.png",
      verified: true,
      address: "Jl. A. Jaelani, Karangwangkal, Purwokerto Utara, Banyumas",
      phones: ["0822-4109-8298"],
    },
  },
  {
    id: 2,
    slug: "honda-brio-satya-e-2023",
    title: "Honda Brio Satya E",
    image: "/assets/images/card/card-2.jpg",
    brandLabel: "Honda",
    badge: { text: "Harga Bagus", colorClass: "bg-green" },
    photoCount: 8,
    videoCount: 1,
    price: "Rp 158.000.000",
    financing: { monthlyPrice: "Rp 3.030.000/bln", detailsLabel: "Lihat Simulasi" },
    spec: { mileage: "21.400 km", year: "2023", fuel: "Bensin", transmission: "Matic" },
  },
  {
    id: 3,
    slug: "daihatsu-xenia-r-2021",
    title: "Daihatsu Xenia R",
    image: "/assets/images/card/card-3.jpg",
    brandLabel: "Daihatsu",
    photoCount: 8,
    videoCount: 1,
    price: "Rp 172.000.000",
    spec: { mileage: "38.900 km", year: "2021", fuel: "Bensin", transmission: "Matic" },
  },
  {
    id: 4,
    slug: "suzuki-ertiga-gx-2022",
    title: "Suzuki Ertiga GX",
    image: "/assets/images/card/card-4.jpg",
    brandLabel: "Suzuki",
    photoCount: 8,
    videoCount: 1,
    price: "Rp 185.000.000",
    spec: { mileage: "29.700 km", year: "2022", fuel: "Bensin", transmission: "Matic" },
  },
  {
    id: 5,
    slug: "mitsubishi-xpander-ultimate-2023",
    title: "Mitsubishi Xpander Ultimate",
    image: "/assets/images/card/card-5.jpg",
    brandLabel: "Mitsubishi",
    photoCount: 8,
    videoCount: 1,
    price: "Rp 265.000.000",
    spec: { mileage: "18.300 km", year: "2023", fuel: "Bensin", transmission: "Matic" },
  },
  {
    id: 6,
    slug: "toyota-rush-s-gr-sport-2022",
    title: "Toyota Rush S GR Sport",
    image: "/assets/images/card/card-6.jpg",
    // Source label reads "BMW" though the title is a Genesis — brand/title mismatch preserved
    // verbatim from the source (template authoring drift, not corrected). See LISTING_DATA_MAP.md.
    brandLabel: "Toyota",
    badge: { text: "Istimewa", colorClass: "bg-primary-2" },
    photoCount: 8,
    videoCount: 1,
    price: "Rp 235.000.000",
    spec: { mileage: "34.100 km", year: "2022", fuel: "Bensin", transmission: "Matic" },
  },
  {
    id: 7,
    slug: "honda-mobilio-rs-2021",
    title: "Honda Mobilio RS",
    image: "/assets/images/card/card-7.jpg",
    brandLabel: "Honda",
    photoCount: 8,
    videoCount: 1,
    price: "Rp 168.000.000",
    spec: { mileage: "41.200 km", year: "2021", fuel: "Bensin", transmission: "Matic" },
  },
  {
    id: 8,
    slug: "toyota-calya-g-2020",
    title: "Toyota Calya G",
    image: "/assets/images/card/card-8.jpg",
    brandLabel: "Toyota",
    badge: { text: "Harga Bagus", colorClass: "bg-green" },
    photoCount: 8,
    videoCount: 1,
    price: "Rp 128.000.000",
    spec: { mileage: "52.900 km", year: "2020", fuel: "Bensin", transmission: "Manual" },
  },
  {
    id: 9,
    slug: "suzuki-ignis-gx-2021",
    title: "Suzuki Ignis GX",
    image: "/assets/images/card/card-10.jpg",
    // Source label reads "Mustang" though the title is a Porsche — brand/title mismatch preserved
    // verbatim from the source. See LISTING_DATA_MAP.md.
    brandLabel: "Suzuki",
    badge: { text: "Harga Bagus", colorClass: "bg-green" },
    photoCount: 8,
    videoCount: 1,
    price: "Rp 145.000.000",
    spec: { mileage: "33.800 km", year: "2021", fuel: "Bensin", transmission: "Matic" },
  },
  {
    id: 10,
    slug: "honda-hr-v-1-5-se-2022",
    title: "Honda HR-V 1.5 SE",
    image: "/assets/images/card/card-54.jpg",
    // Source label reads "Chevrolet" though the title is a Ford — brand/title mismatch preserved
    // verbatim from the source. See LISTING_DATA_MAP.md.
    brandLabel: "Honda",
    photoCount: 8,
    videoCount: 1,
    price: "Rp 298.000.000",
    spec: { mileage: "26.400 km", year: "2022", fuel: "Bensin", transmission: "Matic" },
  },
  {
    id: 11,
    slug: "toyota-fortuner-vrz-2021",
    title: "Toyota Fortuner VRZ",
    image: "/assets/images/card/card-9.jpg",
    brandLabel: "Toyota",
    photoCount: 8,
    videoCount: 1,
    price: "Rp 425.000.000",
    spec: { mileage: "48.600 km", year: "2021", fuel: "Solar", transmission: "Matic" },
  },
  {
    id: 12,
    slug: "mitsubishi-pajero-sport-dakar-2020",
    title: "Mitsubishi Pajero Sport Dakar",
    image: "/assets/images/card/card-55.jpg",
    // Source label reads "Audi" though the title is a BMW — brand/title mismatch preserved
    // verbatim from the source. See LISTING_DATA_MAP.md.
    brandLabel: "Mitsubishi",
    photoCount: 8,
    videoCount: 1,
    price: "Rp 385.000.000",
    spec: { mileage: "57.200 km", year: "2020", fuel: "Solar", transmission: "Matic" },
  },
  // ids 13-15: index.html's own "Trending Searches Near You" section (`.card-box-style-2`, lines
  // 2576-3095) introduces 3 titles not already in this dataset — confirmed via full source read.
  {
    id: 13,
    slug: "toyota-agya-g-2019",
    title: "Toyota Agya G",
    image: "/assets/images/card/card-9.jpg",
    // Source label reads "BMW" though the title is a Ford Mustang — brand/title mismatch
    // preserved verbatim from the source, same pattern as ids 6/9/10/12 above.
    brandLabel: "Toyota",
    badge: { text: "Istimewa", colorClass: "bg-primary-2" },
    photoCount: 8,
    videoCount: 1,
    price: "Rp 105.000.000",
    spec: { mileage: "61.500 km", year: "2019", fuel: "Bensin", transmission: "Manual" },
  },
  {
    id: 14,
    slug: "honda-city-hatchback-rs-2022",
    title: "Honda City Hatchback RS",
    image: "/assets/images/card/card-8.jpg",
    // Source label reads "Mustang" (and links `href="#"`, not a real brand page) though the title
    // is a Mercedes — brand/title mismatch preserved verbatim from the source.
    brandLabel: "Honda",
    badge: { text: "Harga Bagus", colorClass: "bg-green" },
    photoCount: 8,
    videoCount: 1,
    price: "Rp 245.000.000",
    spec: { mileage: "24.800 km", year: "2022", fuel: "Bensin", transmission: "Matic" },
  },
  {
    id: 15,
    slug: "nissan-livina-vl-2021",
    title: "Nissan Livina VL",
    image: "/assets/images/card/card-6.jpg",
    // Source label reads "BMW" though the title is a Toyota — brand/title mismatch preserved
    // verbatim from the source.
    brandLabel: "Nissan",
    photoCount: 8,
    videoCount: 1,
    price: "Rp 175.000.000",
    spec: { mileage: "39.400 km", year: "2021", fuel: "Bensin", transmission: "Matic" },
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
