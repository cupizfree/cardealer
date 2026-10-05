"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  { label: "Dasbor", href: "/dashboard", icon: "/assets/images/dashboard/Dashboard.svg" },
  { label: "Iklan Saya", href: "/my-listings", icon: "/assets/images/dashboard/MyListing.svg" },
  { label: "Tambah Iklan", href: "/add-listings-2", icon: "/assets/images/dashboard/AddListing.svg" },
  { label: "Favorit Saya", href: "/my-favorites", icon: "/assets/images/dashboard/MyFavorites.svg" },
  { label: "Ulasan Saya", href: "/reviews", icon: "/assets/images/dashboard/MyReviews.svg" },
  { label: "Messages", href: "/message", icon: "/assets/images/dashboard/Messages.svg", badge: "2" },
  { label: "Profil Saya", href: "/my-profile", icon: "/assets/images/dashboard/MyProfile.svg" },
  { label: "Ubah Kata Sandi", href: "/change-password", icon: "/assets/images/dashboard/ChangePassword.svg" },
  { label: "Keluar", href: "/", icon: "/assets/images/dashboard/Logout.svg" },
];

// Migrated from ../aurexo/dashboard.html lines 24-90 — shared across the whole Dashboard/account family
// via `(dashboard)/layout.tsx`. Source hardcodes `active` on whichever page's own nav item per static
// file; reproduced with real `usePathname()` matching instead so every sibling page (my-listings.html,
// my-favorites.html, etc., not yet migrated) highlights correctly once built, without needing its own
// hardcoded copy. "Tambah Iklan" links to `/add-listings-2` and "Keluar" links to `/` (source's own
// `index.html` — no real logout mechanism exists anywhere in this static template), matching source's
// real hrefs exactly; neither will ever match `pathname` since they're not really "within" this family.
export default function DashboardSidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();

  return (
    <div className={`dashboard-sidebar${isOpen ? " active" : ""}`}>
      <Link href="/" className="logo">
        <Image className="logo" src="/assets/images/logo-white.png" alt="logo" width={66} height={54} />
      </Link>

      <ul className="dashboard-menu">
        {MENU_ITEMS.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={`dashboard-menu-item${pathname === item.href ? " active" : ""}`}>
              <Image src={item.icon} alt="dashboard" width={24} height={24} />
              {item.label}
              {item.badge && <span className="number">{item.badge}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <p className="dashboard-bottom text-sm text-muted text-center" style={{ marginTop: "auto" }}>
        ©2026{" "}
        <a className="text-sm text-white" href="https://themeforest.net/user/themesflat" target="_blank" rel="noreferrer">
          MARF
        </a>
        . All Rights Reserved.
      </p>
    </div>
  );
}
