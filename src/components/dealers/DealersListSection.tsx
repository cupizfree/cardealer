"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { allDealers, ACTIVE_DEALER_SLUG } from "@/data/dealers";
import Pagination from "@/components/common/Pagination";

// Migrated from ../aurexo/dealers-listing.html lines 482-867 (the container only — source nests this,
// a `tf-spacing` div, and the "Merek di Showroom" carousel all inside the SAME `<section class="pb-100">`,
// so that wrapper lives in page.tsx, not here — same pattern as about-us's `AboutHero`/`Testimonials`).
// `.dealer-box` (see assets/scss/component/box.scss) is a horizontal row card — genuinely different DOM
// shape from `.sale-agent-box`'s photo-grid card, not a variant of it.
//
// Pagination: standing rule now (per explicit follow-up — "any page with pagination markup should have
// it actually work"), not a one-off. Source's own `.pagination__link`s have zero backing JS here too
// (confirmed: no script binds it, same check as sale-agents.html) and hardcode 3 page numbers + "2"
// active regardless of how many dealers actually exist — no real per-page split to recover from source.
// 4 dealers/page was chosen so the 8 real dealers genuinely span 2 pages, via the same shared
// `Pagination` component (`common/`) sale-agents.html's list already uses — no new component needed.
const DEALERS_PER_PAGE = 4;

export default function DealersListSection() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(allDealers.length / DEALERS_PER_PAGE);
  const pageDealers = allDealers.slice((page - 1) * DEALERS_PER_PAGE, page * DEALERS_PER_PAGE);

  return (
    <>
      <div className="tf-spacing-style3" />

      <div className="container">
        <h2 className="mb-40 capitalize">showroom mobil</h2>

        <div className="flex flex-col gap-24 mb-38 dealer-box-wrapper">
          {pageDealers.map((dealer) => (
            <div className={`dealer-box${dealer.slug === ACTIVE_DEALER_SLUG ? " active" : ""}`} key={dealer.id}>
              <div>
                <Image className="image" src={dealer.image} alt={dealer.name} width={300} height={200} />
              </div>

              <div>
                <p className="h4 mb-8 capitalize">
                  <Link className="h4 font-weight-600" href={`/dealer-details/${dealer.slug}`}>
                    {dealer.name}
                  </Link>
                </p>
              </div>

              <div className="flex gap-12 items-center">
                <p className="icon">
                  <Image src="/assets/icons/location.svg" alt="location" width={24} height={24} />
                </p>
                <p className="h7 font-weight-500">{dealer.address}</p>
              </div>

              <div className="flex gap-12 items-center">
                <p className="icon">
                  <Image src="/assets/icons/PhoneCall.svg" alt="location" width={24} height={24} />
                </p>
                <p className="h7 font-weight-500">
                  {dealer.phones.map((phone) => (
                    <a className="h7" href={`tel:${phone}`} key={phone}>
                      {phone}
                    </a>
                  ))}
                </p>
              </div>

              <div className="flex justify-end">
                <Link href={`/dealer-details/${dealer.slug}`} className="btn btn-line btn-large">
                  Detail Showroom
                </Link>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>
    </>
  );
}
