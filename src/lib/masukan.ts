// Penerjemah badan JSON -> tipe masukan repo. Validasi terkumpul di sini,
// jadi route tinggal memanggil dan tidak mengulang aturan yang sama.

import {
  ApiError,
  angkaOpsional,
  emailOpsional,
  jadikanSlug,
  pilihan,
  teksOpsional,
  wajibAngka,
  wajibEmail,
  wajibTeks,
} from "./api";
import { STATUS_UNIT, type MasukanUnit, type StatusUnit } from "./repo/unit";
import { JENIS_BODI } from "./bodi";
import {
  SUMBER_PROSPEK,
  STATUS_PROSPEK,
  type MasukanProspek,
  type SumberProspek,
  type StatusProspek,
} from "./repo/prospek";
import { PERAN, type MasukanPengguna, type Peran } from "./repo/pengguna";
import type { MasukanDealer } from "./repo/dealer";

function ada(b: Record<string, unknown>, k: string): boolean {
  return Object.prototype.hasOwnProperty.call(b, k);
}

function objek(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

// ── Unit ───────────────────────────────────────────────────────────────────

export function bacaUnit(b: Record<string, unknown>, mode: "baru" | "ubah"): Partial<MasukanUnit> {
  const o: Partial<MasukanUnit> = {};

  if (mode === "baru" || ada(b, "judul")) o.judul = wajibTeks(b.judul, "judul", 200);
  if (mode === "baru" || ada(b, "merek")) o.merek = wajibTeks(b.merek, "merek", 80);
  if (mode === "baru" || ada(b, "harga")) o.harga = wajibAngka(b.harga, "harga", 0, 100_000_000_000);

  if (ada(b, "slug") && b.slug) {
    o.slug = jadikanSlug(wajibTeks(b.slug, "slug", 120));
  } else if (mode === "baru") {
    o.slug = jadikanSlug(String(o.judul ?? ""));
  }

  if (ada(b, "model")) o.model = teksOpsional(b.model, 120);
  if (ada(b, "tipe")) o.tipe = bacaTipe(b.tipe);
  if (ada(b, "tahun")) o.tahun = angkaOpsional(b.tahun, "tahun", 1900, 2100);
  if (ada(b, "harga_cicilan")) o.harga_cicilan = teksOpsional(b.harga_cicilan, 60);
  if (ada(b, "kilometer")) o.kilometer = teksOpsional(b.kilometer, 40);
  if (ada(b, "transmisi")) o.transmisi = teksOpsional(b.transmisi, 40);
  if (ada(b, "bahan_bakar")) o.bahan_bakar = teksOpsional(b.bahan_bakar, 40);
  if (ada(b, "warna")) o.warna = teksOpsional(b.warna, 40);
  if (ada(b, "lokasi")) o.lokasi = teksOpsional(b.lokasi, 160);
  if (ada(b, "deskripsi")) o.deskripsi = teksOpsional(b.deskripsi, 20000);
  if (ada(b, "status")) o.status = pilihan<StatusUnit>(b.status, "status", STATUS_UNIT);
  if (ada(b, "unggulan")) {
    o.unggulan = b.unggulan === true || b.unggulan === 1 || b.unggulan === "1";
  }
  if (ada(b, "dealer_id")) o.dealer_id = angkaOpsional(b.dealer_id, "dealer_id", 1, 1_000_000_000);
  if (ada(b, "galeri")) o.galeri = Array.isArray(b.galeri) ? b.galeri : [];
  if (ada(b, "fitur")) o.fitur = bacaFitur(b.fitur);
  if (ada(b, "spesifikasi")) o.spesifikasi = objek(b.spesifikasi);

  return o;
}

// ── Jenis bodi ─────────────────────────────────────────────────────────────

/**
 * Hanya slug yang dikenal yang diterima.
 *
 * Slug ini dipakai di URL (`?tipe=suv`) dan dibandingkan langsung oleh
 * penyaring, jadi nilai bebas berarti unit itu tidak akan pernah muncul di
 * kategori mana pun — lebih baik ditolak daripada tersimpan tapi tak terpakai.
 */
function bacaTipe(v: unknown): string | null {
  const s = teksOpsional(v, 40);
  if (!s) return null;
  const k = s.toLowerCase();
  return (JENIS_BODI as readonly string[]).includes(k) ? k : null;
}

// ── Fitur unit ─────────────────────────────────────────────────────────────

/**
 * Kunci yang dikenali. Kunci lain tetap diterima apa adanya supaya data lama
 * tidak hilang hanya karena ada kategori tambahan, tetapi isinya tetap disaring
 * supaya yang tersimpan di basis data selalu `string[]` — bukan angka, bukan
 * objek, bukan array bersarang.
 */
const KATEGORI_FITUR = ["Exterior", "Interior", "Safety", "Mechanical", "Technology", "Other"] as const;

const MAKS_FITUR_PER_KATEGORI = 40;
const MAKS_PANJANG_FITUR = 120;

function bacaFitur(v: unknown): Record<string, string[]> {
  const mentah = objek(v);
  const hasil: Record<string, string[]> = {};

  for (const kunci of KATEGORI_FITUR) {
    hasil[kunci] = bersihkanFitur(mentah[kunci]);
  }

  // Kategori tak dikenal — dipertahankan, tapi tetap disaring bentuknya.
  for (const [kunci, isi] of Object.entries(mentah)) {
    if ((KATEGORI_FITUR as readonly string[]).includes(kunci)) continue;
    if (kunci.length > 40) continue;
    const bersih = bersihkanFitur(isi);
    if (bersih.length) hasil[kunci] = bersih;
  }

  return hasil;
}

function bersihkanFitur(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  const bersih = v
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.length > MAKS_PANJANG_FITUR ? s.slice(0, MAKS_PANJANG_FITUR) : s));

  // Buang duplikat, pertahankan urutan asli.
  return [...new Set(bersih)].slice(0, MAKS_FITUR_PER_KATEGORI);
}

// ── Dealer ─────────────────────────────────────────────────────────────────

export function bacaDealer(b: Record<string, unknown>, mode: "baru" | "ubah"): Partial<MasukanDealer> {
  const o: Partial<MasukanDealer> = {};

  if (mode === "baru" || ada(b, "nama")) o.nama = wajibTeks(b.nama, "nama", 160);

  if (ada(b, "slug") && b.slug) {
    o.slug = jadikanSlug(wajibTeks(b.slug, "slug", 120));
  } else if (mode === "baru") {
    o.slug = jadikanSlug(String(o.nama ?? ""));
  }

  if (ada(b, "kota")) o.kota = teksOpsional(b.kota, 80);
  if (ada(b, "alamat")) o.alamat = teksOpsional(b.alamat, 400);
  if (ada(b, "telepon")) o.telepon = teksOpsional(b.telepon, 40);
  if (ada(b, "email")) o.email = emailOpsional(b.email);
  if (ada(b, "jam_buka")) o.jam_buka = teksOpsional(b.jam_buka, 120);
  if (ada(b, "aktif")) o.aktif = b.aktif !== false;

  return o;
}

// ── Prospek ────────────────────────────────────────────────────────────────

export function bacaProspek(b: Record<string, unknown>, mode: "baru" | "ubah"): Partial<MasukanProspek> {
  const o: Partial<MasukanProspek> = {};

  if (mode === "baru" || ada(b, "nama")) o.nama = wajibTeks(b.nama, "nama", 160);

  if (ada(b, "telepon")) o.telepon = teksOpsional(b.telepon, 40);
  if (ada(b, "email")) o.email = emailOpsional(b.email);
  if (ada(b, "pesan")) o.pesan = teksOpsional(b.pesan, 5000);
  if (ada(b, "sumber")) o.sumber = pilihan<SumberProspek>(b.sumber, "sumber", SUMBER_PROSPEK);
  if (ada(b, "status")) o.status = pilihan<StatusProspek>(b.status, "status", STATUS_PROSPEK);
  if (ada(b, "catatan")) o.catatan = teksOpsional(b.catatan, 5000);
  if (ada(b, "unit_id")) o.unit_id = angkaOpsional(b.unit_id, "unit_id", 1, 1_000_000_000);
  if (ada(b, "ditangani_oleh")) {
    o.ditangani_oleh = angkaOpsional(b.ditangani_oleh, "ditangani_oleh", 1, 1_000_000_000);
  }

  return o;
}

// ── Pengguna ───────────────────────────────────────────────────────────────

export function bacaPengguna(b: Record<string, unknown>, mode: "baru" | "ubah"): Partial<MasukanPengguna> {
  const o: Partial<MasukanPengguna> = {};

  if (mode === "baru" || ada(b, "email")) o.email = wajibEmail(b.email);
  if (mode === "baru" || ada(b, "nama")) o.nama = wajibTeks(b.nama, "nama", 160);
  if (mode === "baru" || ada(b, "peran")) o.peran = pilihan<Peran>(b.peran, "peran", PERAN);

  if (mode === "baru") {
    o.kata_sandi = wajibTeks(b.kata_sandi, "kata_sandi", 200);
    if (String(o.kata_sandi).length < 8) {
      throw new ApiError(422, "VALIDASI", "Kata sandi minimal 8 karakter.");
    }
  } else if (ada(b, "kata_sandi") && b.kata_sandi) {
    const s = wajibTeks(b.kata_sandi, "kata_sandi", 200);
    if (s.length < 8) throw new ApiError(422, "VALIDASI", "Kata sandi minimal 8 karakter.");
    o.kata_sandi = s;
  }

  if (ada(b, "telepon")) o.telepon = teksOpsional(b.telepon, 40);
  if (ada(b, "aktif")) o.aktif = b.aktif !== false;

  return o;
}
