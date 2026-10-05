"use client";

import Image from "next/image";
import type { FilterState } from "./FilterSidebar";
import type { FilterTag } from "./useListingFilters";

// Source hides this entire block (#filterResults) whenever no filter is active — but only because
// it always has 2 non-removed default tags ("No accidents"/"Harga Bagus") baked in, which we
// deliberately don't reproduce (no backing Listing field, see useListingFilters). So here "X matches"
// always shows (a real, useful number), and only the divider/tags/"Hapus Semua" portion is
// conditional on filterTags.length.
export default function FilterTagsRow({
  matchCount,
  filterTags,
  onRemoveTag,
  onClearAll,
}: {
  matchCount: number;
  filterTags: FilterTag[];
  onRemoveTag: (remove: (filters: FilterState) => FilterState) => void;
  onClearAll: () => void;
}) {
  return (
    <div className="col-md-12 gap-7 mb-32 inline" id="filterResults">
      <p className="inline gap-4">
        <span id="filterMatchesCount">{matchCount} </span> hasil
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
          <button className="btn-clear-items" id="btnClearAll" onClick={onClearAll}>
            Hapus Semua
            <Image src="/assets/icons/X-White.svg" alt="X" width={16} height={16} />
          </button>
        </>
      )}
    </div>
  );
}
