// Autentikasi: hash scrypt, sesi server-side, cookie httpOnly.
// Tidak memakai JWT — sesi di server lebih mudah dicabut saat logout.

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { jalankan, satu, transaksi } from "./db";
import { ApiError } from "./api";
import { hashSandi, cekSandi } from "./sandi";

export { hashSandi, cekSandi };

export const NAMA_COOKIE = "marf_sesi";
const UMUR_JAM = 12;

export type Peran = "admin" | "staff";

export type PenggunaAktif = {
  id: number;
  email: string;
  nama: string;
  peran: Peran;
};

export const PERAN_URUT: Record<Peran, number> = { staff: 1, admin: 2 };

// ── Sesi ───────────────────────────────────────────────────────────────────

function kedaluwarsa(): string {
  const d = new Date(Date.now() + UMUR_JAM * 3600_000);
  return d.toISOString().replace("T", " ").slice(0, 19);
}

export function buatSesi(penggunaId: number, userAgent?: string | null): string {
  const token = randomBytes(32).toString("hex");
  transaksi(() => {
    jalankan("DELETE FROM sesi WHERE kedaluwarsa < datetime('now')");
    jalankan(
      "INSERT INTO sesi (token, pengguna_id, kedaluwarsa, user_agent) VALUES (?, ?, ?, ?)",
      token,
      penggunaId,
      kedaluwarsa(),
      userAgent ?? null,
    );
    jalankan("UPDATE pengguna SET terakhir_masuk = datetime('now') WHERE id = ?", penggunaId);
  });
  return token;
}

export function cabutSesi(token: string) {
  jalankan("DELETE FROM sesi WHERE token = ?", token);
}

export function penggunaDariToken(token: string): PenggunaAktif | null {
  const r = satu(
    `SELECT p.id, p.email, p.nama, p.peran
       FROM sesi s
       JOIN pengguna p ON p.id = s.pengguna_id
      WHERE s.token = ? AND s.kedaluwarsa > datetime('now') AND p.aktif = 1`,
    token,
  );
  if (!r) return null;
  return {
    id: Number(r.id),
    email: String(r.email),
    nama: String(r.nama),
    peran: String(r.peran) as Peran,
  };
}

// ── Cookie ─────────────────────────────────────────────────────────────────

export async function pasangCookie(token: string) {
  const c = await cookies();
  c.set(NAMA_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: UMUR_JAM * 3600,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function hapusCookie() {
  const c = await cookies();
  c.set(NAMA_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function tokenDariCookie(): Promise<string | null> {
  const c = await cookies();
  return c.get(NAMA_COOKIE)?.value ?? null;
}

// ── Penjaga akses ──────────────────────────────────────────────────────────

/** Pengguna yang sedang masuk, atau null. Tidak melempar. */
export async function penggunaSekarang(): Promise<PenggunaAktif | null> {
  const t = await tokenDariCookie();
  if (!t) return null;
  return penggunaDariToken(t);
}

/** Wajib masuk. Melempar 401 kalau belum. */
export async function wajibMasuk(): Promise<PenggunaAktif> {
  const p = await penggunaSekarang();
  if (!p) throw new ApiError(401, "BELUM_MASUK", "Anda harus masuk terlebih dahulu.");
  return p;
}

/** Wajib masuk dengan peran minimal tertentu. Melempar 403 kalau kurang. */
export async function wajibPeran(minimal: Peran): Promise<PenggunaAktif> {
  const p = await wajibMasuk();
  if (PERAN_URUT[p.peran] < PERAN_URUT[minimal]) {
    throw new ApiError(403, "PERAN_KURANG", `Halaman ini butuh peran ${minimal}.`);
  }
  return p;
}
