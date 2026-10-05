"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SORT_LABELS, type SortOption } from "./useListingFilters";

export default function SortDropdown({ sort, onChange }: { sort: SortOption; onChange: (sort: SortOption) => void }) {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="flex items-center h-full gap-8 justify-end">
      <p className="md-hidden">Urutkan Mobil berdasarkan</p>
      <div className={`core-dropdown${isOpen ? " active" : ""}`} ref={ref}>
        <button className="core-dropdown__button" type="button" onClick={() => setIsOpen((open) => !open)}>
          <span className="core-dropdown__selected">{SORT_LABELS[sort]}</span>
          <Image src="/assets/icons/chevron-down-primary.svg" alt="chevron" className="core-dropdown__icon" width={20} height={20} />
        </button>
        <div className="core-dropdown__menu">
          <ul className="core-dropdown__list">
            {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
              <li className="core-dropdown__item" key={option}>
                <button
                  type="button"
                  className={`core-dropdown__option${option === sort ? " active" : ""}`}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                >
                  {SORT_LABELS[option]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
