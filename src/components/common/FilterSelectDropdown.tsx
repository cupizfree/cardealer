"use client";

import { useState } from "react";

export type FilterSelectOption = { value: string; label: string };

// Reproduces `app.js`'s real `selectDropdown()` (`.filter-select-dropdown`): a multi-select checkbox
// dropdown where the button text shows "Select" (none chosen), the single label (one chosen), or
// "N selected" (multiple) — traced in full, confirmed real. Opening one closes every other dropdown on
// the page (source's own handler operates globally), so `isOpen`/`onToggleOpen` are lifted to whichever
// form renders it; each dropdown still owns its own checked options locally since nothing outside it
// needs to read that state. Deliberately not built on `listing/CheckboxDropdown` — this markup has no
// wrapping `.search-cars__select-wrapper`/separate label (the field's own `<p>` label lives outside the
// dropdown entirely), a genuine DOM difference. First built as `add-listings-2/AddListingSelectDropdown`
// for add-listings-2.html's own Car Details/Location dropdowns, moved here once my-profile.html needed
// the exact same widget for its own "Map Location" field — same "extract into `common/` once a second
// page needs it" precedent as `Pagination`/`SocialIcons`.
export default function FilterSelectDropdown({
  name,
  options,
  isOpen,
  onToggleOpen,
  defaultSelected,
}: {
  name: string;
  options: FilterSelectOption[];
  isOpen: boolean;
  onToggleOpen: () => void;
  defaultSelected?: string[];
}) {
  const [selected, setSelected] = useState<string[]>(defaultSelected ?? []);

  function toggleOption(value: string) {
    setSelected((current) => (current.includes(value) ? current.filter((v) => v !== value) : [...current, value]));
  }

  const selectedLabels = options.filter((option) => selected.includes(option.value)).map((option) => option.label);
  const text = selectedLabels.length === 0 ? "Select" : selectedLabels.length === 1 ? selectedLabels[0] : `${selectedLabels.length} selected`;

  return (
    <div className={`bg-white filter-select-dropdown style2${isOpen ? " active" : ""}`} data-name={name}>
      <input type="checkbox" id={name} className="filter-select-dropdown__toggle" checked={isOpen} onChange={onToggleOpen} />
      <label htmlFor={name} className="filter-select-dropdown__text">
        <span>{text}</span>
      </label>
      <div className="filter-select-dropdown__menu" onClick={(event) => event.stopPropagation()}>
        <div className="filter-select-dropdown__list">
          {options.map((option) => (
            <label className="filter-checkbox" key={option.value}>
              <input type="checkbox" name={name} value={option.value} checked={selected.includes(option.value)} onChange={() => toggleOption(option.value)} />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
