"use client";

import Image from "next/image";
import FilterFields from "./FilterFields";

export type FilterState = {
  brand: string[];
  model: string[];
  fuelType: string[];
  transmission: string[];
  priceRange: [number, number];
  bodyStyle: string[];
  doorCount: string[];
  cylinders: string[];
  exteriorColor: string | null;
  interiorColor: string | null;
  features: string[];
};

// Slide-out popup shell for Aurexo's `#filterSidebar` advanced-search form (see
// ../aurexo/listing-grid4-columns.html). The actual fields (and the dropdown open/close behavior,
// filtering scope notes, price-range recalibration, etc.) live in `FilterFields.tsx` — extracted out
// once `listing-liststyle-sidebar.html` needed the exact same fields rendered as a *permanent* inline
// sidebar instead of this popup. See that file's header comment for the full rationale.
export default function FilterSidebar({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  priceMin,
  priceMax,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (patch: Partial<FilterState>) => void;
  priceMin: number;
  priceMax: number;
}) {
  return (
    <div className={`filter-sidebar filter-sidebar-popup${isOpen ? " active" : ""}`} id="filterSidebar">
      <div className="filter-sidebar__overlay" onClick={onClose} />
      <div className="filter-sidebar__panel">
        <div className="filter-sidebar__header bg-white">
          <p className="h5">Pencarian Lanjutan</p>
          <button className="filter-sidebar__close" onClick={onClose} aria-label="Tutup">
            <Image src="/assets/icons/X.svg" alt="close" width={20} height={20} />
          </button>
        </div>

        <form action="#" onSubmit={(event) => event.preventDefault()}>
          <FilterFields filters={filters} onFilterChange={onFilterChange} priceMin={priceMin} priceMax={priceMax} />
        </form>
      </div>
    </div>
  );
}
