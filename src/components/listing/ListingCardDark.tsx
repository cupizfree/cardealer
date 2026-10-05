"use client";

import Image from "next/image";
import Link from "next/link";
import type { ListingCardData } from "@/data/listings";
import { useModal } from "@/components/common/ModalProvider";
import { useCompare } from "@/components/common/CompareProvider";
import { useWishlist } from "@/components/common/WishlistProvider";

// Renders Aurexo's `.card-box.card-box-style-2` shape (the dark/blurred-panel card variant used by
// index.html's "Trending Searches Near You", ../aurexo/index.html lines 2591-3087). Same real
// heart/compare/wishlist wiring as `ListingCard.tsx` (`card-box-style-1`) — see that file's own
// comment — just the `-2` icon set (`icon-gauge-2.svg` etc.) and `bg-blur`/`divider-blur` skin.
export default function ListingCardDark({
  listing,
  titleExtraClassName,
  dividerClassName = "divider-blur mb-16",
}: {
  listing: ListingCardData;
  /** home-08.html's own "Mobil Bekas Sesuai Anggaran" cards carry an extra `mt-1` on the title (confirmed via
   *  source diff, same trivial 1px nudge already found on `ListingCard.tsx`'s own home-08 reuse). */
  titleExtraClassName?: string;
  /** home-09.html's own "Pencarian populer di sekitar Anda" cards use `divider-blur mb-14` (not `mb-16`,
   *  confirmed via source diff — index.html's/home-08.html's own usage really is `mb-16`). */
  dividerClassName?: string;
}) {
  const { openModal } = useModal();
  const { addToCompare } = useCompare();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(listing.id);
  const href = `/listing-details/${listing.slug}`;
  const transmissionIcon = listing.spec.transmission.toLowerCase().startsWith("manual")
    ? "manual-2.svg"
    : "auto-2.svg";

  return (
    <div className="card-box card-box-style-2">
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

      <div className="image">
        <Link href={href}>
          <Image className="card--img" src={listing.image} alt="car" width={410} height={280} />
        </Link>
      </div>

      <div className="content border-top-none bg-blur border-blur">
        <div className="bottom">
          <p className="category uppercase text-white">
            <Link href={href} className="text-white">
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

        <p className={`card-box__title mb-8 h6${titleExtraClassName ? ` ${titleExtraClassName}` : ""}`}>
          <Link href={href} className="text-white">
            {listing.title}
          </Link>
        </p>

        <ul className="tag mb-10">
          <li>
            <Image src="/assets/icons/icon-gauge-2.svg" alt="mileage" width={16} height={16} />
            <span>{listing.spec.mileage}</span>
          </li>
          <li>
            <Image src="/assets/icons/calendar-2.svg" alt="year" width={16} height={16} />
            <span>{listing.spec.year}</span>
          </li>
          <li>
            <Image src="/assets/icons/gaspump-2.svg" alt="fuel" width={16} height={16} />
            <span>{listing.spec.fuel}</span>
          </li>
          <li>
            <Image src={`/assets/icons/${transmissionIcon}`} alt="transmission" width={16} height={16} />
            <span>{listing.spec.transmission}</span>
          </li>
        </ul>

        <p className="card-box__price mb-15 text-white">{listing.price}</p>

        <div className={dividerClassName} />

        <div className="flex justify-between">
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
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M6.875 10H13.125" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 6.875V13.125" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Bandingkan
          </p>

          <Link href={href} className="view-details text-white">
            Lihat detail
            <Image className="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="CaretCircleRight.svg" width={16} height={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
