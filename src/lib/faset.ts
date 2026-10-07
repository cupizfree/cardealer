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

/**
 * Nama model sebuah unit, diturunkan dari judulnya.
 *
 * Judulnya selalu berpola "Merek Model Trim" ("Toyota Avanza 1.5 G"), jadi model
 * adalah kata pertama SETELAH merek. Ini bukan tebakan: yang diambil memang
 * potongan judulnya sendiri, dan penyaringnya mencocokkan potongan itu ke judul
 * (`fuzzyMatch`), jadi nilainya pasti cocok dengan unit asalnya.
 *
 * Satu pengecualian yang disengaja: model yang berupa angka murni ("Mazda 2")
 * dibaca lebih jelas bersama mereknya, jadi dikembalikan sebagai "Mazda 2".
 * Tanpa itu dropdown-nya berisi label "2" yang tidak berarti apa-apa.
 */
export function modelDari(l: Listing): string | null {
  const sisa = l.title.replace(l.brandLabel, "").trim();
  const token = sisa.split(/\s+/).filter(Boolean)[0];
  if (!token) return null;
  return /^\d+$/.test(token) ? `${l.brandLabel} ${token}` : token;
}

/** Terbanyak lebih dulu, sama seperti merek. */
export function fasetModel(listings: Listing[]): Faset[] {
  const hitung = new Map<string, number>();
  for (const l of listings) {
    const m = modelDari(l);
    if (!m) continue;
    hitung.set(m, (hitung.get(m) ?? 0) + 1);
  }

  return [...hitung.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "id"))
    .map(([m, n]) => ({
      label: m,
      href: `${KATALOG}?model=${encodeURIComponent(m)}`,
      jumlah: n,
    }));
}

/** Halaman katalog utama — satu tempat, dipakai navigasi maupun hero beranda. */
export const KATALOG_SEMUA = KATALOG;

/**
 * Hitung nilai apa pun dari katalog, terbanyak lebih dulu.
 *
 * Dipakai isian dropdown yang harus mencerminkan stok sungguhan. Daftar yang
 * ditulis tangan di komponen adalah cara tercepat menawarkan pilihan yang tidak
 * ada isinya — sidebar lama menawarkan BMW, Mercedes, Audi, dan Volvo, padahal
 * showroom ini tidak punya satu pun unitnya.
 */
function nilaiDiStok(
  listings: Listing[],
  ambil: (l: Listing) => string | null | undefined,
): { label: string; jumlah: number }[] {
  const hitung = new Map<string, number>();
  for (const l of listings) {
    const v = ambil(l)?.trim();
    if (!v) continue;
    hitung.set(v, (hitung.get(v) ?? 0) + 1);
  }
  return [...hitung.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "id"))
    .map(([label, jumlah]) => ({ label, jumlah }));
}

/** Merek yang benar-benar ada di stok. */
export function merekDiStok(listings: Listing[]) {
  return nilaiDiStok(listings, (l) => l.brandLabel);
}

/** Model yang benar-benar ada di stok. */
export function modelDiStok(listings: Listing[]) {
  return nilaiDiStok(listings, (l) => modelDari(l));
}

/** Bahan bakar yang benar-benar ada di stok. */
export function bahanBakarDiStok(listings: Listing[]) {
  return nilaiDiStok(listings, (l) => l.spec.fuel);
}

/** Transmisi yang benar-benar ada di stok. */
export function transmisiDiStok(listings: Listing[]) {
  return nilaiDiStok(listings, (l) => l.spec.transmission);
}

/**
 * Jenis bodi yang benar-benar ada di stok, urut mengikuti `JENIS_BODI`.
 *
 * Mengembalikan slug DAN label: yang dibandingkan penyaring adalah slug, yang
 * dilihat pengunjung adalah label — sama seperti kunci fitur unit.
 */
export function jenisDiStok(listings: Listing[]): { slug: string; label: string; jumlah: number }[] {
  const hitung = new Map<string, number>();
  for (const l of listings) {
    const t = (l.bodyStyle ?? "").toLowerCase();
    if (!t) continue;
    hitung.set(t, (hitung.get(t) ?? 0) + 1);
  }
  return JENIS_BODI.filter((j) => hitung.has(j)).map((j) => ({
    slug: j,
    label: labelBodi(j),
    jumlah: hitung.get(j) ?? 0,
  }));
}
