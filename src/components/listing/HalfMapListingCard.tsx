"use client";

import Image from "next/image";
import Link from "next/link";
import type { ListingCardData } from "@/data/listings";
import { useModal } from "@/components/common/ModalProvider";
import { useCompare } from "@/components/common/CompareProvider";
import { useWishlist } from "@/components/common/WishlistProvider";

// The source's "List view" card (`.card-box.card-box-style-9`, see
// ../aurexo/listing-gridstyle-halfmap.html) — genuinely different DOM shape from
// `.card-box-style-1` (`.top`/`.bottom`/`.image`/`.content` are siblings here, not nested), so per
// the project's variant classification rule this is a separate component, not a `ListingCard` prop.
//
// Every instance in source repeats the identical placeholder blurb ("How the adventure ended will be
// seen anon. Aouda was anxious...") regardless of which car — preserved as a shared generic string
// (not per-listing data we have), matching the same "reuse generic content" pattern already applied
// to listing-details (see docs/migration/LISTING_DATA_MAP.md).
const GENERIC_BLURB = "How the adventure ended will be seen anon. Aouda was anxious...";

// `.heart` now really adds/removes this listing from the shared `WishlistProvider`, same wiring as
// `ListingCard.tsx` — see that file's own comment for the full "why" (source's own heart is a shallow
// visual-only toggle with no data behind it).

export default function HalfMapListingCard({ listing }: { listing: ListingCardData }) {
  const { openModal } = useModal();
  const { addToCompare } = useCompare();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(listing.id);
  const href = `/listing-details/${listing.slug}`;

  return (
    <div className="card-box card-box-style-9">
      <div className="top">
        {listing.badge ? (
          <p className={`${listing.badge.colorClass} text-white highlight`}>{listing.badge.text}</p>
        ) : (
          <p />
        )}
        <p className={`heart${wishlisted ? " active" : ""}`} onClick={() => toggleWishlist(listing)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 4.62145 2.48851 3.98851C3.12145 3.35558 3.97989 3 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C12.0201 3 12.8785 3.35558 13.5115 3.98851C14.1444 4.62145 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>
      </div>

      <div className="bottom">
        <p className="category uppercase text-white">
          <Link href={href} className="text-white uppercase text-xs">
            {listing.brandLabel}
          </Link>
        </p>
        <div className="flex items-center gap-8">
          <p className="category uppercase text-white">
            <Image src="/assets/icons/picture.svg" alt="picture" width={14} height={14} />
            {listing.photoCount}
          </p>
          <p className="category uppercase text-white">
            <Image src="/assets/icons/play.svg" alt="play" width={14} height={14} />
            {listing.videoCount}
          </p>
        </div>
      </div>

      <div className="image">
        <Link href={href}>
          <Image className="card--img" src={listing.image} alt="car" width={410} height={280} />
        </Link>
      </div>

      <div className="content">
        <p className="h6 card-box__title mb-4">
          <Link href={href}>{listing.title}</Link>
        </p>

        <p className="text-secondary clamp-1 clamp mb-8">{GENERIC_BLURB}</p>

        <ul className="tag style3 mb-14">
          <li>
            <Image src="/assets/icons/icon-gauge.svg" alt="mileage" width={16} height={16} />
            <span>{listing.spec.mileage}</span>
          </li>
          <li>
            <Image src="/assets/icons/calendar.svg" alt="year" width={16} height={16} />
            <span>{listing.spec.year}</span>
          </li>
          <li>
            <Image src="/assets/icons/gaspump.svg" alt="fuel" width={16} height={16} />
            <span>{listing.spec.fuel}</span>
          </li>
          <li>
            <Image
              src={`/assets/icons/${listing.spec.transmission.toLowerCase().startsWith("manual") ? "manual" : "auto"}.svg`}
              alt="transmission"
              width={16}
              height={16}
            />
            <span>{listing.spec.transmission}</span>
          </li>
        </ul>

        <p className="h6 card-box__price mb-10 flex justify-between gap-8 items-center">{listing.price}</p>

        <div className="flex gap-32">
          <p
            className="compare-details btn btn-small cursor-pointer"
            onClick={() => {
              addToCompare(listing);
              openModal("CompareModal");
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
                stroke="#1C1C1C"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M6.875 10H13.125" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 6.875V13.125" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Compare
          </p>

          <Link href={href} className="view-details">
            View details
            <Image className="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="CaretCircleRight.svg" width={16} height={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
