"use client";

import { useState, type InputHTMLAttributes } from "react";

const ICON_AREA_WIDTH = 44;

// Reproduces `app.js`'s real `passwordInput()`: traced in full — every `.password-input` starts hidden
// (`type="password"`, `.is-hidden`, showing a real `eye-slash.svg` background icon at the input's own
// right edge via CSS), and clicking specifically within that ~44px icon zone (not anywhere else in the
// input) toggles it to `type="text"`/`.is-visible` (`eye.svg`) and back. **Found while migrating
// change-password.html**: this real feature was never actually wired up anywhere in aurexo-nextjs before
// now — `LoginModal`/`SignUpModal` already carried the `.password-input` class for its CSS styling but
// had no click handler behind it at all (a genuine, site-wide gap, not specific to this page). Built here
// and retroactively wired into both of those modals too, in addition to change-password.html's own 3
// fields, since it's the same real feature every one of them was silently missing.
export default function PasswordInput({
  className = "",
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onClick"> & { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <input
      {...props}
      type={isVisible ? "text" : "password"}
      className={`${className} password-input ${isVisible ? "is-visible" : "is-hidden"}`.trim()}
      onClick={(event) => {
        const input = event.currentTarget;
        const clickX = event.nativeEvent.offsetX;
        if (clickX < input.offsetWidth - ICON_AREA_WIDTH) return;
        setIsVisible((visible) => !visible);
      }}
    />
  );
}
