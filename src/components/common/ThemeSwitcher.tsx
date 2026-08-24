"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

const THEME_COOKIE = "themeMode";
const COOKIE_DAYS = 365;

// Mirrors ../aurexo/assets/js/switcher.js's `iconMapping` — a subset of site icons that get swapped to
// differently-colored file variants (confirmed all present under public/assets/icons) when dark mode is
// active. `logo.png`/`logo-white.png` (the header logo) is handled separately below since it's matched
// by container (`.header .logo`), not by filename list, same as the source.
const ICON_MAPPING: Record<string, string> = {
  "icon-gauge.svg": "icon-gauge-2.svg",
  "calendar.svg": "calendar-2.svg",
  "gaspump.svg": "gaspump-2.svg",
  "manual.svg": "manual-2.svg",
  "auto.svg": "auto-2.svg",
  "palette.svg": "palette-muted.svg",
  "MapPin.svg": "MapPin-2.svg",
  "Seatbelt.svg": "Seatbelt-2.svg",
  "Frame.svg": "Frame-2.svg",
  "transmission-2.svg": "transmission-3.svg",
  "Barcode.svg": "Barcode-2.svg",
  "QrCode.svg": "QrCode-2.svg",
  "PhoneCall.svg": "PhoneCall-4.svg",
  "line.svg": "line-white.svg",
  "Alarm-white.svg": "Alarm-white-2.svg",
  "star-4.svg": "star-4-white.svg",
  "location.svg": "location-2.svg",
  "ApplePay.svg": "ApplePay-white.svg",
  "clear.svg": "clear-white.svg",
  "input-facebook.svg": "input-facebook-2.svg",
  "input-skype.svg": "input-skype-2.svg",
  "input-x.svg": "input-x-2.svg",
  "input-instagram.svg": "input-instagram-2.svg",
  "input-youtube.svg": "input-youtube-2.svg",
  "input-telegram.svg": "input-telegram-2.svg",
};

const REVERSE_ICON_MAPPING: Record<string, string> = Object.fromEntries(
  Object.entries(ICON_MAPPING).map(([lightFile, darkFile]) => [darkFile, lightFile]),
);

function readThemeCookie(): Theme {
  const match = document.cookie.match(/(?:^|;\s*)themeMode=(dark|light)/);
  return match?.[1] === "dark" ? "dark" : "light";
}

function writeThemeCookie(theme: Theme) {
  const expires = new Date(Date.now() + COOKIE_DAYS * 86400000).toUTCString();
  document.cookie = `${THEME_COOKIE}=${theme}; expires=${expires}; path=/`;
}

function swapAttr(el: Element, attr: string, mapping: Record<string, string>) {
  const value = el.getAttribute(attr);
  if (!value) return;
  for (const [from, to] of Object.entries(mapping)) {
    if (value.includes(from)) {
      el.setAttribute(attr, value.split(from).join(to));
      return;
    }
  }
}

function applyThemeToImage(img: Element, theme: Theme) {
  const isHeaderLogo = !img.closest(".logo-mobile") && !!img.closest(".header .logo, header .logo");
  if (isHeaderLogo) {
    const mapping: Record<string, string> =
      theme === "dark" ? { "logo.png": "logo-white.png" } : { "logo-white.png": "logo.png" };
    swapAttr(img, "src", mapping);
    swapAttr(img, "srcset", mapping);
    return;
  }
  if (img.closest(".core-dropdown")) return;
  const mapping = theme === "dark" ? ICON_MAPPING : REVERSE_ICON_MAPPING;
  swapAttr(img, "src", mapping);
  swapAttr(img, "srcset", mapping);
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("is_dark", theme === "dark");
  document.documentElement.classList.toggle("is_light", theme !== "dark");
  document.body.classList.toggle("is_dark", theme === "dark");
  document.body.classList.toggle("is_light", theme !== "dark");
  document.querySelectorAll("img").forEach((img) => applyThemeToImage(img, theme));
}

// Migrated from ../aurexo/assets/js/switcher.js + assets/scss/component/themes.scss. This is Aurexo's
// own template-demo "Setting" panel — a bottom-right floating gear that slides open a Light/Dark Mode
// switch — present on every real Aurexo page (appended to `<body>` in `$(document).ready` across all 63
// source pages). Mounted once, globally, in `layout.tsx` to match that. Previously flagged in
// COMPONENT_MAP.md as "almost certainly droppable" pending confirmation; now implemented per explicit
// request.
//
// `is_dark`/`is_light` classes toggled on `<html>`/`<body>` are what actually drive nearly all of the
// visual dark-mode effect — every color/background/border override already lives declaratively in
// `themes.scss`'s `.is_dark { ... }` block (already compiled in via `component/index.scss`), so this
// component doesn't touch any of that by hand; it only flips the class. Panel open/close (source: a
// jQuery `.animate({ right: ... })` tween) is reimplemented as a CSS transition + `.active` class (see
// the rule added to `themes.scss`) instead of porting an imperative animation loop. Setting-icon
// visibility and the Light/Dark mode label text are likewise already conditional on `.is_dark`/`.is_light`
// in `themes.scss` — no manual `.css("display", ...)` needed, unlike the source's own (redundant) inline
// style calls.
//
// The one genuinely imperative piece kept: swapping specific icon/logo `<img>` `src` (and `srcset`)
// values to differently-colored file variants — these are separate files referenced by path, not inline
// SVGs a CSS rule could recolor, so there's no CSS-only equivalent; this reproduces the source's own
// DOM-querying string-replace approach. DEVIATION from source: a `MutationObserver` re-applies the
// current theme's icon mapping whenever React re-renders an icon/logo `<img>` afterward (e.g. a
// `ListingCard` re-rendering from unrelated Compare/Wishlist state changes elsewhere on the page) — the
// source never needs this since its pages are static HTML with no client-side re-renders that could
// revert a swapped `src`; without it, any post-toggle re-render would silently undo the dark-mode icon
// for that one element.
export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setThemeState] = useState<Theme>("light");
  const themeRef = useRef<Theme>("light");

  useEffect(() => {
    const saved = readThemeCookie();
    themeRef.current = saved;
    setThemeState(saved);
    applyTheme(saved);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.target instanceof HTMLImageElement) {
          applyThemeToImage(mutation.target, themeRef.current);
        }
      }
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["src", "srcset"],
      subtree: true,
    });
    return () => observer.disconnect();
  }, []);

  const setTheme = (next: Theme) => {
    themeRef.current = next;
    setThemeState(next);
    applyTheme(next);
    writeThemeCookie(next);
  };

  return (
    <div className={`switcher-container${isOpen ? " active" : ""}`}>
      <h2>
        Setting
        <a
          href="#"
          className="sw-click"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- swapped imperatively by src, not next/image-managed */}
          <img src="/assets/icons/icon_setting.svg" className="setting setting_dark" alt="" width={20} height={20} />
          {/* eslint-disable-next-line @next/next/no-img-element -- swapped imperatively by src, not next/image-managed */}
          <img src="/assets/icons/icon_setting_white.svg" className="setting setting_light" alt="" width={20} height={20} />
        </a>
      </h2>
      <div className="selector-box">
        <div className="clearfix" />
        <div className="sw-odd">
          <h3>
            Mode: <span className="light_mode">Light Mode</span>
            <span className="dark_mode">Dark Mode</span>
          </h3>
          <div className="ws-colors">
            <a
              href="#"
              className={`dark sw-click${theme === "dark" ? " is_active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setTheme("dark");
              }}
            >
              Dark Mode
            </a>
            <a
              href="#"
              className={`light sw-click${theme === "light" ? " is_active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setTheme("light");
              }}
            >
              Light Mode
            </a>
          </div>
        </div>
        <div className="clearfix" />
      </div>
    </div>
  );
}
