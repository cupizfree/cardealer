// Faset navigasi yang dihitung dari stok.
//
// Kolom "Jenis Mobil" dan "Merek" di menu Katalog tidak ditulis tangan di
// `src/data/menu.ts`: keduanya dibaca dari katalog yang sedang tayang. Dua
// keuntungan, dan keduanya nyata:
//
//   1. Tidak akan pernah ada kategori yang mengarah ke halaman kosong. Daftar
//      tetap berisi delapan jenis mobil (termasuk Sedan dan Minibus yang tidak
//      ada satu pun unitnya) adalah cara paling cepat membuat pengunjung
//      mengira situsnya rusak.
//   2. Kategori baru muncul sendiri begitu ada unit dengan jenis bodi itu.
//
// Jumlah unit ditampilkan di sebelah label, jadi pengunjung tahu ada apa saja
// sebelum mengklik.

import type { Listing } from "@/data/listings";
import { JENIS_BODI, labelBodi } from "./bodi";

export type Faset = { label: string; href: string; jumlah: number };

/** Halaman katalog yang membaca `?tipe=` / `?merek=` / `?harga=`. */
const KATALOG = "/listing-grid3-columns";

/** Urut mengikuti `JENIS_BODI`, supaya urutannya stabil antar render. */
export function fasetJenis(listings: Listing[]): Faset[] {
  const hitung = new Map<string, number>();
  for (const l of listings) {
    const t = (l.bodyStyle ?? "").toLowerCase();
    if (!t) continue;
    hitung.set(t, (hitung.get(t) ?? 0) + 1);
  }

  return JENIS_BODI.filter((j) => hitung.has(j)).map((j) => ({
    label: labelBodi(j),
    href: `${KATALOG}?tipe=${j}`,
    jumlah: hitung.get(j) ?? 0,
  }));
}

/** Terbanyak lebih dulu — merek yang paling banyak stoknya paling dicari. */
export function fasetMerek(listings: Listing[]): Faset[] {
  const hitung = new Map<string, number>();
  for (const l of listings) {
    const m = l.brandLabel?.trim();
    if (!m) continue;
    hitung.set(m, (hitung.get(m) ?? 0) + 1);
  }

  return [...hitung.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "id"))
    .map(([m, n]) => ({
      label: m,
      href: `${KATALOG}?merek=${encodeURIComponent(m.toLowerCase())}`,
      jumlah: n,
    }));
}
