"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { informasiMenuColumns, kolomHarga, layananMenuColumns, type ListingMenuColumn } from "@/data/menu";
import { ChevronDownIcon } from "@/components/common/icons";
import { useKatalog } from "@/components/common/KatalogProvider";
import { fasetJenis, fasetMerek } from "@/lib/faset";

// Mobile accordion nav — the real `#main-nav-mobile .menu` (confirmed via source diff: `#main-nav-
// mobile` is the drawer's own outer id, now set by `Offcanvas`'s `panelId` prop one level up; this
// `<ul>` is just its `.menu` child, previously had the wrong id directly on itself — see
// `Offcanvas.tsx`'s own comment for the full bug).
//
// Three non-obvious CSS constraints, all found by verification and all still load-bearing:
// (1) Top-level toggles must be `<a href="#">`, not `<p>`: `menu.scss`'s
//     `#main-nav-mobile > ul > li > a { color: $white }` only matches `<a>` tags, so a `<p>` here
//     renders near-black text on the drawer's own dark background — invisible.
// (2) Sub-link lists must use the `sub-menu` class, not `sub-menu-item-inner`: the latter's only
//     white-text rule requires a `.menu-item-inner` ancestor `<li>` this markup never has, so every
//     sub-link rendered `#1C1C1C` on `#1C1C1C`.
// (3) `menu.scss` gives `#main-nav-mobile .sub-menu` an unconditional `display: none` with NO
//     `.active`/`.open` override anywhere (the source drives it with jQuery's `.slideToggle()`,
//     which writes an inline style). Conditionally mounting the `<ul>` is not enough — the CSS
//     still applies. Hence the explicit inline `display: "block"`.
//
// Multiple sections may be open at once, matching the source's own real click handler
// (`app.js`: `$(this).toggleClass("active"); $(this).find(".sub-menu").first().slideToggle();` —
// nothing collapses the others), so `openSections` is a `Set`, not a single value.
//
// Flattened to one accordion level: the desktop mega menu groups links under column headers
// ("Jenis Mobil" / "Rentang Harga" / "Merek"). Every link is still present here, just not grouped.
// Keys use `${href}-${index}` because the same href legitimately repeats across columns.
export default function MobileMenu() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const katalog = useKatalog();

  const toggle = (section: string) =>
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });

  const kolomKatalog = useMemo<ListingMenuColumn[]>(() => {
    const daftar: ListingMenuColumn[] = [];

    const jenis = fasetJenis(katalog);
    if (jenis.length) {
      daftar.push({
        title: "Jenis Mobil",
        links: jenis.map((f) => ({ label: `${f.label} (${f.jumlah})`, href: f.href })),
      });
    }

    daftar.push(kolomHarga);

    const merek = fasetMerek(katalog);
    if (merek.length) {
      daftar.push({
        title: "Merek",
        links: merek.map((f) => ({ label: `${f.label} (${f.jumlah})`, href: f.href })),
      });
    }

    return daftar;
  }, [katalog]);

  // Di mobile "Katalog" adalah tombol akordeon, bukan tautan, jadi katalog penuh
  // harus punya barisnya sendiri di dalam daftar — kalau tidak, tidak ada jalan
  // ke seluruh stok dari navigasi.
  const bagian = [
    {
      kunci: "katalog",
      label: "Katalog",
      kolom: [
        {
          title: "Semua",
          links: [{ label: `Semua Unit (${katalog.length})`, href: "/listing-grid3-columns" }],
        },
        ...kolomKatalog,
      ],
    },
    { kunci: "layanan", label: "Layanan", kolom: layananMenuColumns },
    { kunci: "informasi", label: "Informasi", kolom: informasiMenuColumns },
  ];

  return (
    <ul className="menu">
      <li className="menu-item">
        <Link href="/">Beranda</Link>
      </li>

      {bagian.map((b) => (
        <li className="menu-item" key={b.kunci}>
          <a
            href="#"
            className="menu-item-inner-title"
            onClick={(event) => {
              event.preventDefault();
              toggle(b.kunci);
            }}
          >
            {b.label} <ChevronDownIcon />
          </a>
          {openSections.has(b.kunci) && (
            <ul className="sub-menu" style={{ display: "block" }}>
              {b.kolom
                .flatMap((column) => column.links)
                .map((link, index) => (
                  <li key={`${link.href}-${index}`}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
            </ul>
          )}
        </li>
      ))}

      <li className="menu-item">
        <Link href="/sale-agents">Tim Sales</Link>
      </li>

      <li className="menu-item">
        <Link href="/blog-standard">Artikel</Link>
      </li>

      <li className="menu-item">
        <Link href="/about-us">Tentang</Link>
      </li>

      <li className="menu-item">
        <Link href="/contact-us">Kontak</Link>
      </li>
    </ul>
  );
}
