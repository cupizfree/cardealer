"use client";

import { useRef, useState } from "react";
import Image from "next/image";

// Migrated from ../aurexo/my-profile.html's own trailing inline `<script>` (real, page-specific):
// traced `toggleClearButton()` in full — a real "X" clear button that shows only once the input has
// non-whitespace content, and clicking it empties the input and refocuses it. Reproduced as a real
// controlled input instead of source's own class-toggling on a sibling button. `prefixIconSrc` covers
// the Social Network fields' own leading platform icon (Facebook/Skype/etc.), absent on the plain
// First/Last Name fields.
export default function ClearableInput({
  name,
  defaultValue = "",
  placeholder,
  prefixIconSrc,
  wrapperClassName = "input-clear-wrapper",
}: {
  name: string;
  defaultValue?: string;
  placeholder: string;
  prefixIconSrc?: string;
  wrapperClassName?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={wrapperClassName}>
      {prefixIconSrc && <Image className="prefix-icon" src={prefixIconSrc} alt="" width={20} height={20} />}
      <input
        ref={inputRef}
        className="input-large input-clear"
        type="text"
        name={name}
        id={name}
        value={value}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        type="button"
        className={`input-clear-btn${value.trim().length > 0 ? " show" : ""}`}
        data-target={name}
        onClick={() => {
          setValue("");
          inputRef.current?.focus();
        }}
      >
        <Image src="/assets/icons/clear.svg" alt="Clear" width={16} height={16} />
      </button>
    </div>
  );
}
