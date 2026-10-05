"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Migrated from ../aurexo/message.html (each `.message-item__options`, e.g. lines 738-744). Traced this
// page's own trailing inline script in full: `$(document).on('click', '.message-item__options
// .core-dropdown__menu a', ...)` — a real, generic Delete handler that removes the message it belongs to
// (matched by text content, "Hapus" only; "Balas" has no handler anywhere, UI_ONLY). Reproduced as a
// real `onDelete` callback instead of the source's own text-matching + DOM removal.
export default function MessageItemMenu({ onDelete }: { onDelete: () => void }) {
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
    <div className={`message-item__options core-dropdown${isOpen ? " active" : ""}`} ref={ref}>
      <Image className="core-dropdown__button ml-auto" src="/assets/icons/more.svg" alt="" width={16} height={16} onClick={() => setIsOpen((open) => !open)} />
      <ul className="core-dropdown__menu">
        <li>
          <a href="#" className="text-primary" onClick={(event) => event.preventDefault()}>
            Balas
          </a>
        </li>
        <li>
          <a
            href="#"
            className="text-primary"
            onClick={(event) => {
              event.preventDefault();
              setIsOpen(false);
              onDelete();
            }}
          >
            Hapus
          </a>
        </li>
      </ul>
    </div>
  );
}
