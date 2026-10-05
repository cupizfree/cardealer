// Helper respons API: bentuk seragam, penanganan galat, validasi masukan.

import { NextResponse } from "next/server";

export class ApiError extends Error {
  status: number;
  kode: string;
  detail?: unknown;

  constructor(status: number, kode: string, pesan: string, detail?: unknown) {
    super(pesan);
    this.status = status;
    this.kode = kode;
    this.detail = detail;
  }
}

export type Meta = Record<string, unknown>;

export function sukses<T>(data: T, meta?: Meta, status = 200) {
  return NextResponse.json({ ok: true, data, ...(meta ? { meta } : {}) }, { status });
}

export function dibuat<T>(data: T, meta?: Meta) {
  return sukses(data, meta, 201);
}

export function gagal(status: number, kode: string, pesan: string, detail?: unknown) {
  return NextResponse.json(
    { ok: false, error: { kode, pesan, ...(detail ? { detail } : {}) } },
    { status },
  );
}

/** Bungkus handler route supaya galat jadi respons JSON yang rapi. */
export function tangani(fn: () => Promise<NextResponse> | NextResponse) {
  return Promise.resolve()
    .then(fn)
    .catch((e: unknown) => {
      if (e instanceof ApiError) return gagal(e.status, e.kode, e.message, e.detail);
      console.error("[api]", e);
      const pesan = e instanceof Error ? e.message : "Galat tidak dikenal";
      return gagal(500, "GALAT_SERVER", pesan);
    });
}

// ── Pembacaan masukan ──────────────────────────────────────────────────────

export async function bacaJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const j = await req.json();
    if (!j || typeof j !== "object" || Array.isArray(j)) {
      throw new ApiError(400, "BADAN_BUKAN_OBJEK", "Badan permintaan harus berupa objek JSON.");
    }
    return j as Record<string, unknown>;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(400, "JSON_TIDAK_VALID", "Badan permintaan bukan JSON yang sah.");
  }
}

export function paramUrl(req: Request): URLSearchParams {
  return new URL(req.url).searchParams;
}

export function angkaDari(v: string | null, bawaan: number, min: number, maks: number): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return bawaan;
  return Math.min(maks, Math.max(min, Math.trunc(n)));
}

/** Wajib ada dan tidak kosong. */
export function wajibTeks(v: unknown, nama: string, maks = 5000): string {
  if (typeof v !== "string" || v.trim() === "") {
    throw new ApiError(422, "VALIDASI", `Kolom "${nama}" wajib diisi.`);
  }
  const t = v.trim();
  if (t.length > maks) {
    throw new ApiError(422, "VALIDASI", `Kolom "${nama}" maksimal ${maks} karakter.`);
  }
  return t;
}

/** Opsional. Kosong → null. */
export function teksOpsional(v: unknown, maks = 5000): string | null {
  if (v === undefined || v === null) return null;
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (t === "") return null;
  return t.slice(0, maks);
}

export function wajibAngka(v: unknown, nama: string, min = 0, maks = Number.MAX_SAFE_INTEGER): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) {
    throw new ApiError(422, "VALIDASI", `Kolom "${nama}" harus berupa angka.`);
  }
  const b = Math.trunc(n);
  if (b < min || b > maks) {
    throw new ApiError(422, "VALIDASI", `Kolom "${nama}" harus antara ${min} dan ${maks}.`);
  }
  return b;
}

export function angkaOpsional(v: unknown, nama: string, min = 0, maks = Number.MAX_SAFE_INTEGER): number | null {
  if (v === undefined || v === null || v === "") return null;
  return wajibAngka(v, nama, min, maks);
}

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function wajibEmail(v: unknown, nama = "email"): string {
  const t = wajibTeks(v, nama, 254).toLowerCase();
  if (!POLA_EMAIL.test(t)) {
    throw new ApiError(422, "VALIDASI", `Kolom "${nama}" bukan alamat surel yang sah.`);
  }
  return t;
}

export function emailOpsional(v: unknown, nama = "email"): string | null {
  const t = teksOpsional(v, 254);
  if (!t) return null;
  if (!POLA_EMAIL.test(t)) {
    throw new ApiError(422, "VALIDASI", `Kolom "${nama}" bukan alamat surel yang sah.`);
  }
  return t.toLowerCase();
}

/** Pilih satu dari daftar nilai yang diizinkan. */
export function pilihan<T extends string>(v: unknown, nama: string, izin: readonly T[]): T {
  const t = wajibTeks(v, nama, 60);
  if (!izin.includes(t as T)) {
    throw new ApiError(422, "VALIDASI", `Kolom "${nama}" harus salah satu dari: ${izin.join(", ")}.`);
  }
  return t as T;
}

/** Ubah judul jadi slug URL yang aman. */
export function jadikanSlug(teks: string): string {
  return teks
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "tanpa-nama";
}
