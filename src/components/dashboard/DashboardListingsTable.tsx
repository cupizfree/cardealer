"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";
import CoreDropdown from "@/components/common/CoreDropdown";

// Migrated from ../aurexo/dashboard.html lines 656-870, also reused verbatim by my-listings.html (byte-
// identical search/sort/table/pagination markup, confirmed via source diff — the only differences are
// the page's own real listing rows and whether the box has its own "All Listing" heading: dashboard.html
// has one, my-listings.html doesn't since its page-level `<p class="h3">Iklan Saya</p>` already serves
// as the title, exposed as an optional `title` prop). "Car" links resolve to each row's real matching
// `allListings` slug (all titles across both pages already exist there) rather than the dead
// `listing-details-1.html` every row literally uses in source. Every row shows the identical literal
// subtitle ("Bagaimana akhir petualangannya akan...") and price ($44.900,00), and — a real, disclosed source
// content bug — a brand that frequently doesn't match the actual car, preserved verbatim rather than
// corrected. "Ubah Iklan" links to `/add-listings` (not yet migrated, matching source's real href).
export type DashboardListing = {
  id: number;
  slug: string;
  image: string;
  title: string;
  brand: string;
  year: string;
  transmission: string;
  fuel: string;
};

const PER_PAGE = 9;

export default function DashboardListingsTable({
  title,
  initialListings,
}: {
  title?: string;
  initialListings: DashboardListing[];
}) {
  const [listings, setListings] = useState(initialListings);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(listings.length / PER_PAGE) || 1;
  const pageListings = listings.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleRemove(id: number) {
    setListings((current) => {
      const next = current.filter((listing) => listing.id !== id);
      const nextTotalPages = Math.ceil(next.length / PER_PAGE) || 1;
      if (page > nextTotalPages) setPage(nextTotalPages);
      return next;
    });
  }

  return (
    <div className="dashboard-box bg-white style-2 mb-30">
      {title && <p className="h4 mb-20">{title}</p>}

      <div className="flex justify-between items-center mb-20 gap-20 flex-wrap">
        <form action="#" className="search-form-listing" onSubmit={(event) => event.preventDefault()}>
          <input type="text" name="searchListing" id="searchListing" className="form-control" placeholder="Search by keyword" />
          <button type="submit" aria-label="Cari">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17.9438 17.0575L14.0321 13.1466C15.1659 11.7854 15.7312 10.0395 15.6106 8.27214C15.4899 6.50475 14.6925 4.85192 13.3843 3.65748C12.076 2.46304 10.3576 1.81895 8.58657 1.8592C6.81553 1.89945 5.12818 2.62094 3.87554 3.87358C2.62289 5.12622 1.9014 6.81357 1.86115 8.58462C1.8209 10.3557 2.46499 12.074 3.65943 13.3823C4.85387 14.6906 6.5067 15.488 8.27409 15.6086C10.0415 15.7293 11.7874 15.1639 13.1485 14.0302L17.0595 17.9419C17.1175 17.9999 17.1865 18.046 17.2623 18.0774C17.3382 18.1089 17.4195 18.125 17.5016 18.125C17.5838 18.125 17.6651 18.1089 17.741 18.0774C17.8168 18.046 17.8858 17.9999 17.9438 17.9419C18.0019 17.8838 18.048 17.8149 18.0794 17.739C18.1108 17.6631 18.127 17.5818 18.127 17.4997C18.127 17.4176 18.1108 17.3363 18.0794 17.2604C18.048 17.1845 18.0019 17.1156 17.9438 17.0575ZM3.12664 8.74969C3.12664 7.63717 3.45654 6.54963 4.07463 5.62461C4.69271 4.69958 5.57121 3.97861 6.59905 3.55287C7.62688 3.12712 8.75788 3.01573 9.84903 3.23277C10.9402 3.44981 11.9424 3.98554 12.7291 4.77221C13.5158 5.55888 14.0515 6.56116 14.2686 7.65231C14.4856 8.74345 14.3742 9.87445 13.9485 10.9023C13.5227 11.9301 12.8018 12.8086 11.8767 13.4267C10.9517 14.0448 9.86416 14.3747 8.75164 14.3747C7.26031 14.373 5.83053 13.7799 4.77599 12.7253C3.72146 11.6708 3.1283 10.241 3.12664 8.74969Z"
                fill="#1C1C1C"
              />
            </svg>
          </button>
        </form>

        <div className="flex items-center gap-8">
          <p className="text-secondary">Urutkan:</p>
          <CoreDropdown
            defaultValue="lowest-price"
            options={[
              { value: "best-match", label: "Paling Sesuai" },
              { value: "lowest-price", label: "Harga Terendah" },
              { value: "highest-price", label: "Harga Tertinggi" },
              { value: "lowest-mileage", label: "Jarak Terendah" },
              { value: "highest-mileage", label: "Jarak Tertinggi" },
              { value: "nearest-location", label: "Nearest" },
              { value: "best-deal", label: "Penawaran Terbaik" },
            ]}
          />
        </div>
      </div>

      {pageListings.length > 0 ? (
        <div className="cart-wrapper">
          <div className="cart-header">
            <div className="font-weight-600">Mobil</div>
            <div className="font-weight-600">Merek</div>
            <div className="font-weight-600">Tahun</div>
            <div className="font-weight-600">Transmisi</div>
            <div className="font-weight-600">Bahan Bakar</div>
            <div className="font-weight-600">Aksi</div>
          </div>

          <div className="cart-items">
            {pageListings.map((listing) => (
              <div className="cart-item" key={listing.id}>
                <Link href={`/listing-details/${listing.slug}`} className="cart-item__product">
                  <div className="cart-item__image">
                    <Image src={listing.image} alt={listing.title} width={80} height={60} />
                  </div>
                  <div className="cart-item__name">
                    <p className="h4 clamp-1 clamp mb-8">{listing.title}</p>
                    <p className="clamp-1 clamp text-secondary mb-12">Bagaimana akhir petualangannya akan...</p>
                    <p className="h5">Rp 674.000.000</p>
                  </div>
                </Link>
                <div className="cart-item__price">
                  <span className="price">{listing.brand}</span>
                </div>
                <div className="cart-item__year">
                  <span>{listing.year}</span>
                </div>
                <div className="cart-item__total">
                  <span>{listing.transmission}</span>
                </div>
                <div>
                  <span>{listing.fuel}</span>
                </div>
                <div className="cart-item__action">
                  <Link href="/add-listings" className="hover-fill-white cart-item__edit action">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21.3113 6.87821L17.1216 2.68946C16.9823 2.55014 16.8169 2.43962 16.6349 2.36421C16.4529 2.28881 16.2578 2.25 16.0608 2.25C15.8638 2.25 15.6687 2.28881 15.4867 2.36421C15.3047 2.43962 15.1393 2.55014 15 2.68946L3.43969 14.2498C3.2998 14.3886 3.18889 14.5538 3.11341 14.7358C3.03792 14.9178 2.99938 15.113 3.00001 15.3101V19.4998C3.00001 19.8976 3.15804 20.2791 3.43935 20.5604C3.72065 20.8417 4.10218 20.9998 4.50001 20.9998H20.25C20.4489 20.9998 20.6397 20.9208 20.7803 20.7801C20.921 20.6395 21 20.4487 21 20.2498C21 20.0509 20.921 19.8601 20.7803 19.7194C20.6397 19.5788 20.4489 19.4998 20.25 19.4998H10.8113L21.3113 8.99977C21.4506 8.86048 21.5611 8.69511 21.6365 8.5131C21.7119 8.33109 21.7507 8.136 21.7507 7.93899C21.7507 7.74198 21.7119 7.5469 21.6365 7.36489C21.5611 7.18288 21.4506 7.0175 21.3113 6.87821ZM8.68969 19.4998H4.50001V15.3101L12.75 7.06009L16.9397 11.2498L8.68969 19.4998ZM18 10.1895L13.8113 5.99977L16.0613 3.74977L20.25 7.93946L18 10.1895Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                    <p className="tooltip">Ubah Iklan</p>
                  </Link>
                  <div className="hover-fill-white cart-item__remove action" onClick={() => handleRemove(listing.id)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20.25 4.5H16.5V3.75C16.5 3.15326 16.2629 2.58097 15.841 2.15901C15.419 1.73705 14.8467 1.5 14.25 1.5H9.75C9.15326 1.5 8.58097 1.73705 8.15901 2.15901C7.73705 2.58097 7.5 3.15326 7.5 3.75V4.5H3.75C3.55109 4.5 3.36032 4.57902 3.21967 4.71967C3.07902 4.86032 3 5.05109 3 5.25C3 5.44891 3.07902 5.63968 3.21967 5.78033C3.36032 5.92098 3.55109 6 3.75 6H4.5V19.5C4.5 19.8978 4.65804 20.2794 4.93934 20.5607C5.22064 20.842 5.60218 21 6 21H18C18.3978 21 18.7794 20.842 19.0607 20.5607C19.342 20.2794 19.5 19.8978 19.5 19.5V6H20.25C20.4489 6 20.6397 5.92098 20.7803 5.78033C20.921 5.63968 21 5.44891 21 5.25C21 5.05109 20.921 4.86032 20.7803 4.71967C20.6397 4.57902 20.4489 4.5 20.25 4.5ZM9 3.75C9 3.55109 9.07902 3.36032 9.21967 3.21967C9.36032 3.07902 9.55109 3 9.75 3H14.25C14.4489 3 14.6397 3.07902 14.7803 3.21967C14.921 3.36032 15 3.55109 15 3.75V4.5H9V3.75ZM18 19.5H6V6H18V19.5ZM10.5 9.75V15.75C10.5 15.9489 10.421 16.1397 10.2803 16.2803C10.1397 16.421 9.94891 16.5 9.75 16.5C9.55109 16.5 9.36032 16.421 9.21967 16.2803C9.07902 16.1397 9 15.9489 9 15.75V9.75C9 9.55109 9.07902 9.36032 9.21967 9.21967C9.36032 9.07902 9.55109 9 9.75 9C9.94891 9 10.1397 9.07902 10.2803 9.21967C10.421 9.36032 10.5 9.55109 10.5 9.75ZM15 9.75V15.75C15 15.9489 14.921 16.1397 14.7803 16.2803C14.6397 16.421 14.4489 16.5 14.25 16.5C14.0511 16.5 13.8603 16.421 13.7197 16.2803C13.579 16.1397 13.5 15.9489 13.5 15.75V9.75C13.5 9.55109 13.579 9.36032 13.7197 9.21967C13.8603 9.07902 14.0511 9 14.25 9C14.4489 9 14.6397 9.07902 14.7803 9.21967C14.921 9.36032 15 9.55109 15 9.75Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                    <p className="tooltip">Hapus Iklan</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="divider w-full mb-20" />

          <div className="flex justify-between items-center flex-wrap gap-12 pagination-bottom">
            {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
            <p className="text-secondary">
              Menampilkan {(page - 1) * PER_PAGE + 1} sampai {Math.min(page * PER_PAGE, listings.length)} dari {listings.length} data
            </p>
          </div>
        </div>
      ) : (
        <p className="text-secondary">Anda belum punya iklan.</p>
      )}
    </div>
  );
}
