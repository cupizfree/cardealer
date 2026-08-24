"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DealerInfo, ListingOverview } from "@/data/listings";
import SendInquiryForm from "@/components/common/SendInquiryForm";

// Source's Cash/Finance tabs (`.menu-tab-style5`) render byte-identical content in both panes (both
// literally say "$44.900" — a genuine source content duplication, not a distinct Finance quote we're
// collapsing). Preserved as two real tabs sharing the same price text, not invented apart.
//
// `overview` is optional and only passed by listing-details-3.html's route: that layout moves Car
// Overview into the sidebar (a `car-overview-list-style2` box, between the Cash/Finance box and the
// contact-dealer box — confirmed via direct source read) instead of the main content column, unlike
// listing-details-1/2.html. Omitting it (the default) reproduces those two pages' sidebar exactly.
//
// `sendInquiryId` is optional and only set by listing-details-4.html's route: its real scroll-to-anchor
// tab bar (`ListingDetailsScrollNav`) has an "Inquiry" link that targets this box specifically
// (`id="Inquiry"` sits on the Send Inquiry box in that page's source, not anything in the main content
// column) — omitted everywhere else, matching v1/v2/v3's sidebar exactly.
export default function ListingDetailsSidebar({
  price,
  dealer,
  overview,
  sendInquiryId,
}: {
  price: string;
  dealer: DealerInfo;
  overview?: ListingOverview;
  sendInquiryId?: string;
}) {
  const [tab, setTab] = useState<"cash" | "finance">("cash");

  return (
    <div className="listing-details--sidebar">
      <div className="listing-details--sidebar-box mb-40">
        <div className="flat-tabs">
          <div className="overflow-x-auto mb-15">
            <ul className="menu-tab menu-tab-style5 grid-cols-2">
              <li className={tab === "cash" ? "active" : undefined} onClick={() => setTab("cash")}>
                Cash
              </li>
              <li className={tab === "finance" ? "active" : undefined} onClick={() => setTab("finance")}>
                Finance
              </li>
            </ul>
          </div>

          <div className="content-tab">
            <div className="content-inner active">
              <p className="h5 mb-4">Price:</p>
              <p className="h4 mb-4">{price}</p>
              <p className="text-secondary mb-16">List price w/o taxes, fees, and accessories</p>
              <p className="flex items-center gap-8">
                <Image src="/assets/icons/Info.svg" alt="info" width={16} height={16} />
                <a href="#" className="text-underline text-highlight">
                  Vehicle in the VAT system
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {overview && (
        <div className="listing-details--sidebar-box mb-40">
          <p className="h5 mb-4 capitalize">Car Overview</p>
          <ul className="car-overview-list-style2">
            <SidebarOverviewRow icon="icon-gauge.svg" label="Mileage:" value={overview.mileage} />
            <SidebarOverviewRow icon="calendar.svg" label="Years:" value={overview.year} />
            <SidebarOverviewRow icon="gaspump.svg" label="Fuel:" value={overview.fuel} />
            <SidebarOverviewRow icon="palette.svg" label="Color:" value={overview.color} />
            <SidebarOverviewRow icon="MapPin.svg" label="Location:" value={overview.location} />
            <SidebarOverviewRow icon="Seatbelt.svg" label="Interior:" value={overview.interior} />
            <SidebarOverviewRow icon="Frame.svg" label="Engine:" value={overview.engine} />
            <SidebarOverviewRow icon="transmission-2.svg" label="Transmission:" value={overview.transmission} />
            <SidebarOverviewRow icon="Barcode.svg" label="VIN:" value={overview.vin} />
            <SidebarOverviewRow icon="QrCode.svg" label="Stock Number:" value={overview.stockNumber} />
          </ul>
        </div>
      )}

      <div className="listing-details--sidebar-box mb-40">
        <div className="listing-details--contact">
          <div className="listing-details--contact-dealer mb-28">
            {dealer.avatar && <Image src={dealer.avatar} alt="dealer" width={64} height={64} />}
            <div className="content">
              <a href="#" className="h4 mb-8 font-weight-600">
                {dealer.name}
              </a>
              {dealer.verified && (
                <div className="verify">
                  <Image src="/assets/icons/SealCheck.svg" alt="verified" width={16} height={16} />
                  <p className="text-highlight text-sm">Verified Dealer</p>
                </div>
              )}
            </div>
          </div>

          <ul className="contact-info mb-20">
            <li>
              <p className="icon">
                <Image src="/assets/icons/MapPin.svg" alt="phone" width={20} height={20} />
              </p>
              <div className="flex flex-col gap-4">
                <a href="#">{dealer.address}</a>
                <a href="#" className="text-underline text-highlight text-sm">
                  Get Directions
                </a>
              </div>
            </li>
          </ul>
          <ul className="contact-info mb-28">
            <li className="items-center">
              <p className="icon">
                <Image src="/assets/icons/PhoneCall.svg" alt="phone" width={20} height={20} />
              </p>
              <div className="flex flex-col">
                {dealer.phones.map((phone) => (
                  <a href={`tel:${phone}`} key={phone}>
                    {phone}
                  </a>
                ))}
              </div>
            </li>
          </ul>

          {/* /dealer-details is now a per-dealer [slug] route (see COMPONENT_MAP.md's dealer-details
              entry) — links to a representative real dealer, same pattern as the "Listing Details 1-6"/
              "Sale Agents Detail" nav items using a specific real slug instead of a bare route. */}
          <Link href="/dealer-details/dynamic-drive-garage" className="btn btn-medium btn-primary-3 font-weight-600 mb-12 gap-5">
            <Image src="/assets/icons/PhoneCall-2.svg" alt="phone" width={20} height={20} />
            Call To Dealer
          </Link>

          <a href="#" className="btn btn-medium btn-primary-4 font-weight-600 gap-5">
            <Image src="/assets/icons/ChatCircleDots.svg" alt="phone" width={20} height={20} />
            Chat via WhatsApp
          </a>
        </div>
      </div>

      <SendInquiryForm id={sendInquiryId} />
    </div>
  );
}

// listing-details-3.html's sidebar Car Overview row: icon+label on the left, value right-aligned via
// a 2-column CSS grid (`car-overview-list-style2`) — a third distinct Car Overview presentation
// alongside the main content column's "columns" and "flat" layouts (see `ListingDetailsContent`).
function SidebarOverviewRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <li className="grid-cols-2 grid">
      <p className="flex items-center gap-8">
        <Image className="w-28 h-28" src={`/assets/icons/${icon}`} alt={label} width={28} height={28} />
        <span className="h7 text-secondary">{label}</span>
      </p>
      <span className="h7 font-weight-500 pl-28">{value}</span>
    </li>
  );
}
