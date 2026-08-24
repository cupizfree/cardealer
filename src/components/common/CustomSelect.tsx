"use client";

import { useEffect, useRef, useState } from "react";

// Matches `app.js`'s real `selectOptions()` widget (`.custom-select`/`.select-selected`/
// `.select-items`) — traced in full and confirmed genuinely real: clicking the selected-value box
// opens/closes a plain option list, clicking an option updates the displayed label and a hidden input
// value, and clicking anywhere outside closes it. First built for check-out.html's Country/Region and
// State selects; generic (no page-specific typing) so any future page needing the same widget can reuse
// it instead of re-implementing the same open/close/select logic.
export type CustomSelectOption = { value: string; label: string };

export default function CustomSelect({
  options,
  placeholder,
  name,
  onChange,
}: {
  options: CustomSelectOption[];
  placeholder: string;
  name?: string;
  onChange?: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<CustomSelectOption | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="custom-select" ref={ref}>
      <div
        className="select-selected select--black"
        tabIndex={0}
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((open) => !open);
        }}
      >
        {selected ? selected.label : placeholder}
      </div>
      <div className="select-items" style={{ display: isOpen ? "block" : "none" }}>
        {options.map((option) => (
          <div
            key={option.value}
            data-value={option.value}
            onClick={() => {
              setSelected(option);
              setIsOpen(false);
              onChange?.(option.value);
            }}
          >
            {option.label}
          </div>
        ))}
      </div>
      {name && <input type="hidden" name={name} value={selected?.value ?? ""} readOnly />}
    </div>
  );
}
