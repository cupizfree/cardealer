"use client";

import { useState } from "react";
import Image from "next/image";
import type { FeatureCategory, ListingFeatures } from "@/data/listings";

const CATEGORIES: FeatureCategory[] = ["Exterior", "Interior", "Safety", "Mechanical", "Technology", "Other"];

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
          {CATEGORIES.map((category) => (
            <li key={category} className={active === category ? "active" : undefined}>
              <span className="text-secondary font-weight-600" onClick={() => setActive(category)}>
                {category}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="content-tab">
        <div className="content-inner active">
          <ul className="grid grid-cols-3 xl-grid-cols-2 md-grid-cols-1 gap-8 gap-x-30">
            {features[active].map((item) => (
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
