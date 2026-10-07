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

/**
 * Satu kotak rentang. Dipakai harga maupun jarak tempuh — bentuknya sama, jadi
 * tipenya satu. Nama lamanya dipertahankan supaya `src/data/menu.ts` tidak perlu
 * ikut berubah.
 */
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

/**
 * Rentang jarak tempuh, dalam kilometer. Batas setengah-terbuka, sama seperti
 * harga — dan itu bukan pilihan gaya: stok sekarang berkisar 18.300–61.500 km,
 * jadi satu unit yang jaraknya pas 50.000 km harus masuk SATU kotak saja.
 */
export const RENTANG_JARAK: RentangHarga[] = [
  { slug: "0-25", label: "Di bawah 25 rb km", min: 0, maks: 24_999 },
  { slug: "25-50", label: "25 – 50 rb km", min: 25_000, maks: 49_999 },
  { slug: "50-100", label: "50 – 100 rb km", min: 50_000, maks: 99_999 },
  {
    slug: "100-plus",
    label: "Di atas 100 rb km",
    min: 100_000,
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
 * Cocokkan slug rentang, lalu jatuh ke batas bebas (`harga_min`/`harga_maks`).
 *
 * Rentang bebas datang dari penggeser di sidebar. Ditulis terpisah supaya URL
 * tetap jujur meski rentangnya tidak sama dengan kotak mana pun.
 */
function bacaRentang(
  p: Params,
  kunciSlug: string,
  kunciMin: string,
  kunciMaks: string,
  kotak: RentangHarga[],
): [number, number] | null {
  const cocok = kotak.find((r) => r.slug === bacaDaftar(p[kunciSlug])[0]);
  if (cocok) return [cocok.min, cocok.maks];

  const lo = Number(bacaDaftar(p[kunciMin])[0]);
  const hi = Number(bacaDaftar(p[kunciMaks])[0]);
  if (Number.isFinite(lo) && Number.isFinite(hi) && hi > lo) return [lo, hi];
  return null;
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

  // Model sengaja TIDAK diubah kapitalisasinya: `fuzzyMatch` sudah membandingkan
  // tanpa peduli huruf besar-kecil, dan mengubahnya bisa merusak label seperti
  // "Mazda 2" yang huruf pertamanya memang sudah kapital.
  const model = bacaDaftar(p.model);
  if (model.length) hasil.model = model;

  const tipe = bacaDaftar(p.tipe)
    .map((s) => s.toLowerCase())
    .filter((s): s is (typeof JENIS_BODI)[number] =>
      (JENIS_BODI as readonly string[]).includes(s),
    );
  if (tipe.length) hasil.bodyStyle = tipe;

  const harga = bacaRentang(p, "harga", "harga_min", "harga_maks", RENTANG_HARGA);
  if (harga) hasil.priceRange = harga;

  const jarak = bacaRentang(p, "jarak", "jarak_min", "jarak_maks", RENTANG_JARAK);
  if (jarak) hasil.mileageRange = jarak;

  const bahanBakar = bacaDaftar(p.bahan_bakar);
  if (bahanBakar.length) hasil.fuelType = bahanBakar.map(kapitalAwal);

  const transmisi = bacaDaftar(p.transmisi);
  if (transmisi.length) hasil.transmission = transmisi.map(kapitalAwal);

  return hasil;
}

/** Rentang default dianggap "tidak menyaring" — jangan ikut ditulis ke URL. */
function rentangDefault(f: [number, number], min: number, maks: number): boolean {
  return f[0] === min && f[1] === maks;
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
  if (f.model?.length) bagian.push(f.model.join(", "));
  const harga = RENTANG_HARGA.find((r) => r.slug === bacaDaftar(p.harga)[0]);
  if (harga) bagian.push(harga.label);
  const jarak = RENTANG_JARAK.find((r) => r.slug === bacaDaftar(p.jarak)[0]);
  if (jarak) bagian.push(jarak.label);
  return bagian.length ? bagian.join(" · ") : null;
}

/** Rentang yang persis sama dengan salah satu kotak navigasi, kalau ada. */
export function slugRentang(
  f: FilterState,
  min: number,
  maks: number,
): RentangHarga | null {
  if (rentangDefault(f.priceRange, min, maks)) return null;
  return (
    RENTANG_HARGA.find((r) => r.min === f.priceRange[0] && r.maks === f.priceRange[1]) ?? null
  );
}

/** Padanan `slugRentang` untuk jarak tempuh. */
export function slugJarak(
  f: FilterState,
  min: number,
  maks: number,
): RentangHarga | null {
  if (rentangDefault(f.mileageRange, min, maks)) return null;
  return (
    RENTANG_JARAK.find((r) => r.min === f.mileageRange[0] && r.maks === f.mileageRange[1]) ?? null
  );
}

/** Apakah ada satu pun filter yang benar-benar menyaring. */
export function adaFilterAktif(
  f: FilterState,
  min: number,
  maks: number,
  jarakMin: number,
  jarakMaks: number,
): boolean {
  return (
    f.brand.length > 0 ||
    f.bodyStyle.length > 0 ||
    f.fuelType.length > 0 ||
    f.transmission.length > 0 ||
    f.model.length > 0 ||
    !rentangDefault(f.priceRange, min, maks) ||
    !rentangDefault(f.mileageRange, jarakMin, jarakMaks)
  );
}

/**
 * Judul halaman mengikuti filter yang sedang aktif — "SUV", "Toyota",
 * "Rp 150 – 200 juta". `null` kalau tidak ada filter, supaya pemanggil bisa
 * memakai judul bawaannya sendiri.
 */
export function judulFilter(
  f: FilterState,
  min: number,
  maks: number,
  jarakMin: number,
  jarakMaks: number,
): string | null {
  const bagian: string[] = [];
  if (f.bodyStyle.length) bagian.push(f.bodyStyle.map(labelBodi).join(", "));
  if (f.brand.length) bagian.push(f.brand.join(", "));
  if (f.model.length) bagian.push(f.model.join(", "));
  const harga = slugRentang(f, min, maks);
  if (harga) bagian.push(harga.label);
  const jarak = slugJarak(f, jarakMin, jarakMaks);
  if (jarak) bagian.push(jarak.label);
  return bagian.length ? bagian.join(" · ") : null;
}

/** Keadaan filter -> kueri URL. Hanya yang menyaring yang ditulis. */
export function keQuery(
  f: FilterState,
  min: number,
  maks: number,
  jarakMin: number,
  jarakMaks: number,
): string {
  const q = new URLSearchParams();
  if (f.bodyStyle.length) q.set("tipe", f.bodyStyle.join(","));
  if (f.brand.length) q.set("merek", f.brand.join(","));
  if (f.model.length) q.set("model", f.model.join(","));

  const harga = slugRentang(f, min, maks);
  if (harga) {
    q.set("harga", harga.slug);
  } else if (!rentangDefault(f.priceRange, min, maks)) {
    // Rentang bebas — tidak ada kotak yang cocok, jadi tulis batasnya apa adanya.
    q.set("harga_min", String(f.priceRange[0]));
    q.set("harga_maks", String(f.priceRange[1]));
  }

  const jarak = slugJarak(f, jarakMin, jarakMaks);
  if (jarak) {
    q.set("jarak", jarak.slug);
  } else if (!rentangDefault(f.mileageRange, jarakMin, jarakMaks)) {
    q.set("jarak_min", String(f.mileageRange[0]));
    q.set("jarak_maks", String(f.mileageRange[1]));
  }

  if (f.fuelType.length) q.set("bahan_bakar", f.fuelType.join(","));
  if (f.transmission.length) q.set("transmisi", f.transmission.join(","));
  return q.toString();
}
