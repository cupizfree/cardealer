"use client";

import Image from "next/image";

// Extracted out of `FilterFields.tsx` so other filter UI shells (e.g. `TopSearchFilterBar.tsx`) can
// reuse the exact same checkbox-hack dropdown widget instead of redeclaring it. `FilterFields.tsx`'s own
// vertical sidebar context (`listing-sidebar-left.html` etc., confirmed via source read) really has
// `.search-cars__select-wrapper mb-18` and NO `bg-white` on `.search-cars__select` — kept as the
// default `layout="sidebar"`. The horizontal hero/topmap bar context (index.html/home-02.html/
// home-03.html's own hero, listing-topmap.html's own `TopSearchFilterBar`) is the opposite: no `mb-18`
// (fields sit inline in a flex row, not stacked), and a real `bg-white` IS present (confirmed via
// source diff against all 4 of those pages) — `.filter-select-dropdown`'s own base SCSS has no
// background-color at all, so omitting it left these fields with a see-through background against the
// hero photo, a real visual bug found by re-checking this component against source. `layout="bar"`
// fixes both.
export default function CheckboxDropdown({
  name,
  label,
  toggleId,
  defaultText,
  options,
  searchable,
  selected,
  onToggle,
  isOpen,
  onToggleOpen,
  layout = "sidebar",
}: {
  name: string;
  label: string;
  toggleId: string;
  defaultText: string;
  options: string[];
  searchable?: boolean;
  selected?: string[];
  onToggle?: (value: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  layout?: "sidebar" | "bar";
}) {
  return (
    <div className={`search-cars__select-wrapper${layout === "sidebar" ? " mb-18" : ""}`}>
      <div
        className={`search-cars__select${layout === "bar" ? " bg-white" : ""} filter-select-dropdown${isOpen ? " active" : ""}`}
        data-name={name}
      >
        <label htmlFor={toggleId} className="search-cars__label">
          {label}
        </label>
        <input
          type="checkbox"
          id={toggleId}
          className="filter-select-dropdown__toggle"
          checked={isOpen}
          onChange={onToggleOpen}
        />
        <label htmlFor={toggleId} className="filter-select-dropdown__text">
          <span>{defaultText}</span>
        </label>
        <div className={`filter-select-dropdown__menu${searchable ? " style2 bg-white radius-16" : ""}`}>
          {searchable && (
            <div className="filter-select-dropdown__search">
              <input type="text" placeholder="Cari" className="filter-select-dropdown__search-input" />
              <Image src="/assets/icons/search-icon.svg" alt="search" className="filter-select-dropdown__search-icon" width={16} height={16} />
            </div>
          )}
          <div className="filter-select-dropdown__list">
            {options.map((option) =>
              onToggle ? (
                <label className="filter-checkbox" key={option}>
                  <input
                    type="checkbox"
                    name={name}
                    value={option}
                    checked={selected?.includes(option) ?? false}
                    onChange={() => onToggle(option)}
                  />
                  <span>{option}</span>
                </label>
              ) : (
                <label className="filter-checkbox" key={option}>
                  <input type="checkbox" name={name} value={option} />
                  <span>{option}</span>
                </label>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
