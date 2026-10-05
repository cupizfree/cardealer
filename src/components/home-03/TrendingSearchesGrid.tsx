import Link from "next/link";
import ListingCard from "@/components/listing/ListingCard";
import type { ListingCardData } from "@/data/listings";
import { allListings } from "@/data/listings";

// Migrated from ../aurexo/home-03.html lines 1919-2182 ("Trending Searches Near You"). Genuinely
// different from `home/TrendingSearchesSection.tsx` (confirmed via source diff): a static 3-card grid
// (no swiper/pagination), `.card-box card-box-style-1 card-box-style-6` (not `-style-2`/dark), a light
// section background (not `bg-primary`), and every slide's own image/price/badge is scrambled against
// its own matching canonical listing — even though its title AND spec row (mileage/year/fuel/
// transmission) match ids 1/2/3 exactly. Preserved verbatim, not reconciled: slide 1 keeps id 1's real
// title/spec/price but shows `card-4.jpg` (not id 1's own `card-1.jpg`) and adds a financing row id 1
// doesn't have; slide 2 introduces a genuinely new badge value "Hot Offer" (`bg-primary`, a value not
// seen on any other page) with `card-7.jpg` and a price ($35.200,00) that differs from id 2's canonical
// $42.800,00; slide 3 shows a "Harga Bagus" badge id 3 doesn't canonically have, `card-6.jpg`, and a
// price ($22.800,00) differing from id 3's canonical $45.500,00. Each slide is its own literal
// `ListingCardData` object (not spread from `allListings`) since so much of each record is overridden —
// `slug`/`brandLabel`/`spec` are copied from the matching canonical id for routing/consistency, nothing
// invented.
const l1 = allListings.find((l) => l.id === 1)!;
const l2 = allListings.find((l) => l.id === 2)!;
const l3 = allListings.find((l) => l.id === 3)!;

const SLIDES: ListingCardData[] = [
  {
    id: l1.id,
    slug: l1.slug,
    title: l1.title,
    image: "/assets/images/card/card-4.jpg",
    brandLabel: l1.brandLabel,
    badge: { text: "Special", colorClass: "bg-primary-2" },
    photoCount: 8,
    videoCount: 1,
    price: "$44.900,00",
    financing: { monthlyPrice: "$588/mo", detailsLabel: "See Finance" },
    spec: l1.spec,
  },
  {
    id: l2.id,
    slug: l2.slug,
    title: l2.title,
    image: "/assets/images/card/card-7.jpg",
    brandLabel: l2.brandLabel,
    badge: { text: "Hot Offer", colorClass: "bg-primary" },
    photoCount: 8,
    videoCount: 1,
    price: "$35.200,00",
    spec: l2.spec,
  },
  {
    id: l3.id,
    slug: l3.slug,
    title: l3.title,
    image: "/assets/images/card/card-6.jpg",
    brandLabel: l3.brandLabel,
    badge: { text: "Harga Bagus", colorClass: "bg-green" },
    photoCount: 8,
    videoCount: 1,
    price: "$22.800,00",
    spec: l3.spec,
  },
];

export default function TrendingSearchesGrid() {
  return (
    <section className="py-100">
      <div className="container relative">
        <div className="title-section mb-38 wow fadeInDown" data-wow-delay="0.1s">
          <h2 className="capitalize">Pencarian populer di sekitar Anda</h2>
          <Link href="/listing-grid4-columns" className="btn btn-line-style-2 effect-line-primary btn-large hover-fill-white">
            Lihat Semua
          </Link>
        </div>
      </div>
      <div className="container wow fadeIn" data-wow-delay="0.1s">
        <div className="grid grid-cols-3 xl-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-40">
          {SLIDES.map((listing, index) => (
            <ListingCard listing={listing} extraClassName="card-box-style-6" compact key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
