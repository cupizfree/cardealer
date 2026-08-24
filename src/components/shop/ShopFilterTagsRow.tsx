"use client";

import Image from "next/image";
import type { ShopFilterState, ShopFilterTag } from "./useShopFilters";

// Mirrors `common`'s Listing `FilterTagsRow` (same "N matches" + removable-tag-pill + Clear All shape,
// see that component's own header comment for why "X matches" always shows unconditionally) — a
// separate small component rather than a generic one since the underlying tag/filter-state types
// genuinely differ (category/branding/price here vs. brand/model/fuelType/... there).
export default function ShopFilterTagsRow({
  matchCount,
  filterTags,
  onRemoveTag,
  onClearAll,
}: {
  matchCount: number;
  filterTags: ShopFilterTag[];
  onRemoveTag: (remove: (filters: ShopFilterState) => ShopFilterState) => void;
  onClearAll: () => void;
}) {
  return (
    <div className="col-md-12 gap-7 mb-32 inline" id="filterResults">
      <p className="inline gap-4">
        <span id="filterMatchesCount">{matchCount} </span> matches
      </p>
      {filterTags.length > 0 && (
        <>
          <div className="align-middle inline-block divider-vertical-style2 h-16" id="filterDivider" />
          <div id="filterTags" className="inline gap-8">
            {filterTags.map((tag) => (
              <p className="select-item" key={tag.key} onClick={() => onRemoveTag(tag.remove)}>
                {tag.label}
                <Image src="/assets/icons/X.svg" alt="X" className="filter-icon" width={16} height={16} />
              </p>
            ))}
          </div>
          <button className="btn-clear-items" onClick={onClearAll}>
            Remove All
            <Image src="/assets/icons/X-White.svg" alt="X" width={16} height={16} />
          </button>
        </>
      )}
    </div>
  );
}
