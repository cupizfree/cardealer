"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Generic `.core-dropdown` widget. Started as open/close + label swap only, no side effects — traced
// `app.js`'s generic `.core-dropdown__option` handler, which only ever updates the selected label/active
// class. Used as-is (no `onChange`) for dashboard.html's "Car Views" range selector and "Sort by"
// dropdown, both confirmed genuinely decorative past the label swap — real widgets, but not a real
// filter/sort, same class of decorative-but-interactive control as shop.html's own "Sort by" (see
// COMPONENT_MAP.md #53). The optional `onChange` was added for reviews.html's own rating-filter/sort-
// by-date dropdowns, which trace to a real, page-specific inline script that DOES filter/sort — passing
// `onChange` there lets the parent react to a selection instead of the label swap being the only effect.
// Distinct from `listing/SortDropdown`, which drives real re-sorting for one specific, already-typed use
// case rather than this generic `{value, label}` shape.
export type CoreDropdownOption = { value: string; label: string };

export default function CoreDropdown({
  options,
  defaultValue,
  onChange,
  initialLabel,
}: {
  options: CoreDropdownOption[];
  defaultValue: string;
  onChange?: (value: string) => void;
  /** Shown before the user makes a first real selection, with no option pre-highlighted — reviews.html's
   *  own sort-by-date dropdown starts on "(Default)" with neither "Desc" nor "Asc" marked active, even
   *  though its real default sort order is already descending internally. Omit for the usual case where
   *  `defaultValue` should both drive real initial behavior AND show/highlight as selected immediately. */
  initialLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(initialLabel ? null : defaultValue);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((option) => option.value === selectedValue);
  const label = selected ? selected.label : (initialLabel ?? options[0].label);

  return (
    <div className={`core-dropdown style-2${isOpen ? " active" : ""}`} ref={ref}>
      <button className="core-dropdown__button dropdown__normal" type="button" onClick={() => setIsOpen((open) => !open)}>
        <span className="core-dropdown__selected">{label}</span>
        <Image src="/assets/icons/chevron-down-primary.svg" alt="chevron" className="core-dropdown__icon" width={20} height={20} />
      </button>
      <div className="core-dropdown__menu">
        <ul className="core-dropdown__list style2">
          {options.map((option) => (
            <li className="core-dropdown__item" key={option.value}>
              <a
                href="#"
                className={`core-dropdown__option${option.value === selectedValue ? " active" : ""}`}
                onClick={(event) => {
                  event.preventDefault();
                  setSelectedValue(option.value);
                  setIsOpen(false);
                  onChange?.(option.value);
                }}
              >
                {option.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
