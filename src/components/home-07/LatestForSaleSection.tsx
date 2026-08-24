import Link from "next/link";
import HalfMapListingCard from "@/components/listing/HalfMapListingCard";
import SellBuyPromoBanner from "@/components/common/SellBuyPromoBanner";
import { allListings } from "@/data/listings";

const CARD_IDS = [1, 2, 3, 1];

// Migrated from ../aurexo/home-07.html lines 3894-4296 ("Latest For Sale"). `col-lg-8` list reuses
// `listing/HalfMapListingCard` (the `.card-box-style-9` shape, byte-identical to
// `listing-gridstyle-halfmap.html`'s own "List view" card, confirmed via source diff — same generic
// blurb, same tag/price/compare layout) for 4 cards mapped onto the existing listing pool (ids
// 1,2,3,1 — Audi A6 Avant E-Tron reused twice, confirmed via title read). `col-lg-4` sidebar reuses
// `common/SellBuyPromoBanner`'s same 2 cards (byte-identical images/copy/hrefs to home-03/04's own
// calls — `leftTitleHref="/listing-grid4-columns"`, `rightTitleHref`/`rightCtaHref="/sell-your-car"`)
// via its new `layout="stack"` prop, since this page stacks them vertically in a sidebar column instead
// of the `row`/`col-lg-6` layout every other caller uses (confirmed via source diff).
export default function LatestForSaleSection() {
  const listings = CARD_IDS.map((id) => allListings.find((l) => l.id === id)!);

  return (
    <section className="bg-white py-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 md-mb-30">
            <div className="mr-50">
              <div className="title-section mb-22 wow fadeInDown" data-wow-delay="0.1s">
                <h2 className="">Latest For Sale</h2>
                <Link href="/listing-grid4-columns" className="btn btn-line-style-2 effect-line-primary btn-large hover-fill-white">
                  View All
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z"
                      fill="#1C1C1C"
                    />
                  </svg>
                </Link>
              </div>
              <div className="flex flex-col gap-20 wow fadeInUp">
                {listings.map((listing, index) => (
                  <HalfMapListingCard key={index} listing={listing} />
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <SellBuyPromoBanner layout="stack" leftTitleHref="/listing-grid4-columns" rightTitleHref="/sell-your-car" rightCtaHref="/sell-your-car" />
          </div>
        </div>
      </div>
    </section>
  );
}
