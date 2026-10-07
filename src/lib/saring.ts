// Penerjemah antara URL dan keadaan filter halaman listing.
//
// Sampai sekarang tidak ada satu pun halaman listing yang membaca `searchParams`
// — kugrep seluruh `src/app`, hanya `reset-sandi` yang membacanya. Akibatnya 26
// tautan navigasi (`?tipe=`, `?harga=`, `?merek=`) merender halaman yang sama
// persis: kelihatan berfungsi, tidak menyaring apa pun. Modul ini yang
// menyambungkannya.
//
// Fungsi di sini murni — tanpa React, tanpa basis data — supaya bisa diuji
// langsung dan dipakai komponen server maupun klien.

import type { FilterState } from "@/components/listing/FilterSidebar";
import { JENIS_BODI, labelBodi } from "./bodi";

/** `searchParams` Next.js: satu nilai, berulang, atau tidak ada. */
export type Params = Record<string, string | string[] | undefined>;

export type RentangHarga = {
  slug: string;
  label: string;
  min: number;
  maks: number;
};

/**
 * Rentang harga navigasi. Bilangan bulat rupiah, sama seperti `parsePrice`.
 *
 * Batasnya SETENGAH-TERBUKA, ditulis eksak: "Di bawah Rp 100 juta" berarti
 * < Rp 100.000.000, dan "Rp 100 – 150 juta" berarti Rp 100.000.000 sampai
 * Rp 149.999.999. Kalau memakai batas inklusif di kedua ujung, satu unit yang
 * harganya pas di batas akan muncul di DUA kotak sekaligus — dan penyaringnya
 * memang inklusif (`price < min || price > maks`), karena itu yang benar untuk
 * penggeser harga di sidebar.
 */
export const RENTANG_HARGA: RentangHarga[] = [
  { slug: "0-100", label: "Di bawah Rp 100 juta", min: 0, maks: 99_999_999 },
  { slug: "100-150", label: "Rp 100 – 150 juta", min: 100_000_000, maks: 149_999_999 },
  { slug: "150-200", label: "Rp 150 – 200 juta", min: 150_000_000, maks: 199_999_999 },
  { slug: "200-300", label: "Rp 200 – 300 juta", min: 200_000_000, maks: 299_999_999 },
  {
    slug: "300-plus",
    label: "Di atas Rp 300 juta",
    min: 300_000_000,
    maks: Number.MAX_SAFE_INTEGER,
  },
];

/** Terima `?x=a`, `?x=a&x=b`, dan `?x=a,b` — ketiganya jadi daftar. */
export function bacaDaftar(v: string | string[] | undefined): string[] {
  if (v === undefined) return [];
  const mentah = Array.isArray(v) ? v : [v];
  return mentah
    .flatMap((s) => s.split(","))
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * "toyota" -> "Toyota". Hanya huruf pertama yang diubah.
 *
 * Sengaja TIDAK memecah per kata: merek seperti "Mercedes-Benz" harus tetap utuh
 * supaya pencocokan `fuzzyMatch` terhadap `brandLabel` tetap cocok.
 */
function kapitalAwal(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Ubah `searchParams` menjadi sebagian keadaan filter.
 *
 * Nilai yang tidak dikenal dibuang diam-diam: `?tipe=pesawat` tidak boleh
 * menghasilkan halaman kosong yang membingungkan, cukup diabaikan seperti tidak
 * ada parameter.
 */
export function dariParams(p: Params): Partial<FilterState> {
  const hasil: Partial<FilterState> = {};

  const merek = bacaDaftar(p.merek);
  if (merek.length) hasil.brand = merek.map(kapitalAwal);

  const tipe = bacaDaftar(p.tipe)
    .map((s) => s.toLowerCase())
    .filter((s): s is (typeof JENIS_BODI)[number] =>
      (JENIS_BODI as readonly string[]).includes(s),
    );
  if (tipe.length) hasil.bodyStyle = tipe;

  const rentang = RENTANG_HARGA.find((r) => r.slug === bacaDaftar(p.harga)[0]);
  if (rentang) {
    hasil.priceRange = [rentang.min, rentang.maks];
  } else {
    // Rentang bebas (penggeser harga di sidebar). Ditulis terpisah supaya URL
    // tetap jujur meski rentangnya tidak sama dengan kotak mana pun.
    const lo = Number(bacaDaftar(p.harga_min)[0]);
    const hi = Number(bacaDaftar(p.harga_maks)[0]);
    if (Number.isFinite(lo) && Number.isFinite(hi) && hi > lo) hasil.priceRange = [lo, hi];
  }

  const bahanBakar = bacaDaftar(p.bahan_bakar);
  if (bahanBakar.length) hasil.fuelType = bahanBakar.map(kapitalAwal);

  const transmisi = bacaDaftar(p.transmisi);
  if (transmisi.length) hasil.transmission = transmisi.map(kapitalAwal);

  return hasil;
}

/** Rentang default dianggap "tidak menyaring" — jangan ikut ditulis ke URL. */
function rentangDefault(f: FilterState, min: number, maks: number): boolean {
  return f.priceRange[0] === min && f.priceRange[1] === maks;
}

/**
 * Judul halaman langsung dari kueri, tanpa perlu tahu harga min/maks katalog.
 * Dipakai komponen server, yang tidak punya keadaan filter lengkap.
 */
export function judulDariParams(p: Params): string | null {
  const f = dariParams(p);
  const bagian: string[] = [];
  if (f.bodyStyle?.length) bagian.push(f.bodyStyle.map(labelBodi).join(", "));
  if (f.brand?.length) bagian.push(f.brand.join(", "));
  const rentang = RENTANG_HARGA.find((r) => r.slug === bacaDaftar(p.harga)[0]);
  if (rentang) bagian.push(rentang.label);
  return bagian.length ? bagian.join(" · ") : null;
}

/** Rentang yang persis sama dengan salah satu kotak navigasi, kalau ada. */
export function slugRentang(
  f: FilterState,
  min: number,
  maks: number,
): RentangHarga | null {
  if (rentangDefault(f, min, maks)) return null;
  return (
    RENTANG_HARGA.find((r) => r.min === f.priceRange[0] && r.maks === f.priceRange[1]) ?? null
  );
}

/** Apakah ada satu pun filter yang benar-benar menyaring. */
export function adaFilterAktif(f: FilterState, min: number, maks: number): boolean {
  return (
    f.brand.length > 0 ||
    f.bodyStyle.length > 0 ||
    f.fuelType.length > 0 ||
    f.transmission.length > 0 ||
    f.model.length > 0 ||
    !rentangDefault(f, min, maks)
  );
}

/**
 * Judul halaman mengikuti filter yang sedang aktif — "SUV", "Toyota",
 * "Rp 150 – 200 juta". `null` kalau tidak ada filter, supaya pemanggil bisa
 * memakai judul bawaannya sendiri.
 */
export function judulFilter(f: FilterState, min: number, maks: number): string | null {
  const bagian: string[] = [];
  if (f.bodyStyle.length) bagian.push(f.bodyStyle.map(labelBodi).join(", "));
  if (f.brand.length) bagian.push(f.brand.join(", "));
  const rentang = slugRentang(f, min, maks);
  if (rentang) bagian.push(rentang.label);
  return bagian.length ? bagian.join(" · ") : null;
}

/** Keadaan filter -> kueri URL. Hanya yang menyaring yang ditulis. */
export function keQuery(f: FilterState, min: number, maks: number): string {
  const q = new URLSearchParams();
  if (f.bodyStyle.length) q.set("tipe", f.bodyStyle.join(","));
  if (f.brand.length) q.set("merek", f.brand.join(","));
  const rentang = slugRentang(f, min, maks);
  if (rentang) {
    q.set("harga", rentang.slug);
  } else if (!rentangDefault(f, min, maks)) {
    // Rentang bebas — tidak ada kotak yang cocok, jadi tulis batasnya apa adanya.
    q.set("harga_min", String(f.priceRange[0]));
    q.set("harga_maks", String(f.priceRange[1]));
  }
  if (f.fuelType.length) q.set("bahan_bakar", f.fuelType.join(","));
  if (f.transmission.length) q.set("transmisi", f.transmission.join(","));
  return q.toString();
}
