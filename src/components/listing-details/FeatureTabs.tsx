"use client";

import { useState } from "react";
import Image from "next/image";
import type { FeatureCategory, ListingFeatures } from "@/data/listings";

// Kunci internal (`kunci`) sengaja tetap bahasa Inggris: kunci itu dipakai sebagai
// nama kolom di JSON `fitur` pada basis data dan dibandingkan di
// `active === kunci`. Menerjemahkan kuncinya akan membuat data yang sudah
// tersimpan tidak lagi cocok — persis jebakan `ProductTabs.tsx` dulu (tab yang
// tidak akan pernah aktif). Jadi yang diterjemahkan hanya `label` yang terlihat.
const KATEGORI: Array<{ kunci: FeatureCategory; label: string }> = [
  { kunci: "Exterior", label: "Eksterior" },
  { kunci: "Interior", label: "Interior" },
  { kunci: "Safety", label: "Keselamatan" },
  { kunci: "Mechanical", label: "Mekanis" },
  { kunci: "Technology", label: "Teknologi" },
  { kunci: "Other", label: "Lainnya" },
];

// Source repeats the identical 12-item checklist under all 6 tabs (see LISTING_DATA_MAP.md) — the
// tab *structure* is real, the per-category content differentiation simply doesn't exist yet.
// listing-details-2.html defaults to the "Interior" tab instead of "Exterior" (confirmed via direct
// source read — both the tab's `active` class and the matching `content-inner active` block sit on
// Interior there) — the canonical `features` content itself is unchanged/shared, only which tab
// opens first differs, hence `defaultActive` rather than a second dataset.
export default function FeatureTabs({
  features,
  defaultActive = "Exterior",
}: {
  features: ListingFeatures;
  defaultActive?: FeatureCategory;
}) {
  const [active, setActive] = useState<FeatureCategory>(defaultActive);

  return (
    <div className="flat-tabs mb-40">
      <div className="overflow-x-auto mb-16">
        <ul className="menu-tab menu-tab-style4">
          {KATEGORI.map(({ kunci, label }) => (
            <li key={kunci} className={active === kunci ? "active" : undefined}>
              <span className="text-secondary font-weight-600" onClick={() => setActive(kunci)}>
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="content-tab">
        <div className="content-inner active">
          <ul className="grid grid-cols-3 xl-grid-cols-2 md-grid-cols-1 gap-8 gap-x-30">
            {(features[active] ?? []).map((item) => (
              <li className="flex items-center gap-8" key={item}>
                <Image src="/assets/icons/check.svg" alt="check" width={16} height={16} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
