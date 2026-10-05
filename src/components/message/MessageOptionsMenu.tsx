"use client";

import { useEffect, useRef, useState } from "react";

// Migrated from ../aurexo/message.html lines 715-729 (the chat header's own "..." menu,
// `.core-dropdown.more.style-2`). Both "Blokir" and "Hapus" here are source's own literal dead
// `href="#"` — confirmed via grep, this page's own trailing inline script only wires up the DIFFERENT
// per-message dropdown's Delete (see `MessageItemMenu.tsx`), not this one. Real open/close (traced
// `app.js`'s generic `coreDropdown()` handler — opens/closes any `.core-dropdown` for real), decorative
// menu items.
export default function MessageOptionsMenu() {
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
    <div className={`core-dropdown more style-2${isOpen ? " active" : ""}`} ref={ref}>
      <button className="core-dropdown__button ml-auto" type="button" onClick={() => setIsOpen((open) => !open)}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 10C10.8333 9.53976 10.4602 9.16667 10 9.16667C9.53976 9.16667 9.16667 9.53976 9.16667 10C9.16667 10.4602 9.53976 10.8333 10 10.8333Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 5.83333C10.4602 5.83333 10.8333 5.46024 10.8333 5C10.8333 4.53976 10.4602 4.16667 10 4.16667C9.53976 4.16667 9.16667 4.53976 9.16667 5C9.16667 5.46024 9.53976 5.83333 10 5.83333Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 15.8333C10.4602 15.8333 10.8333 15.4602 10.8333 15C10.8333 14.5398 10.4602 14.1667 10 14.1667C9.53976 14.1667 9.16667 14.5398 9.16667 15C9.16667 15.4602 9.53976 15.8333 10 15.8333Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="core-dropdown__menu">
        <ul className="core-dropdown__list more-links">
          <li>
            <a href="#" onClick={(event) => event.preventDefault()}>
              Blokir
            </a>
          </li>
          <li>
            <a href="#" onClick={(event) => event.preventDefault()}>
              Hapus
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
