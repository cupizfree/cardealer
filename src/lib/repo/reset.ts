// Tautan reset sandi sekali pakai.
//
// Alurnya: pengguna meminta reset dengan surelnya, sistem membuat token acak
// 32 bita, dan yang DISIMPAN hanya sidik SHA-256 token itu. Token aslinya cuma
// ada di tautan yang dikirim. Jadi kalau isi basis data bocor, tautan reset
// tidak bisa dipakai ulang oleh orang lain.
//
// Token berlaku 30 menit dan hangus setelah dipakai sekali. Membuat token baru
// otomatis membatalkan token lama yang belum dipakai.

import { createHash, randomBytes } from "node:crypto";
import { jalankan, satu, sekarang } from "../db";

export const MENIT_BERLAKU = 30;

function sidik(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function waktuKedaluwarsa(menit: number): string {
  return new Date(Date.now() + menit * 60_000).toISOString().replace("T", " ").slice(0, 19);
}

/** Buat token baru untuk satu pengguna. Token lama yang belum dipakai dibatalkan. */
export function buatTokenReset(penggunaId: number): { token: string; kedaluwarsa: string } {
  jalankan("UPDATE reset_sandi SET dipakai = 1 WHERE pengguna_id = ? AND dipakai = 0", penggunaId);

  const token = randomBytes(32).toString("hex");
  const kedaluwarsa = waktuKedaluwarsa(MENIT_BERLAKU);

  jalankan(
    "INSERT INTO reset_sandi (pengguna_id, token_hash, kedaluwarsa) VALUES (?,?,?)",
    penggunaId,
    sidik(token),
    kedaluwarsa,
  );

  return { token, kedaluwarsa };
}

export type HasilPakaiToken =
  | { ok: true; penggunaId: number }
  | { ok: false; alasan: string };

/** Periksa token tanpa menghanguskannya (untuk menampilkan formulir). */
export function periksaTokenReset(token: string): HasilPakaiToken {
  if (!/^[a-f0-9]{64}$/.test(token)) return { ok: false, alasan: "Tautan tidak sah." };

  const baris = satu("SELECT * FROM reset_sandi WHERE token_hash = ?", sidik(token));
  if (!baris) return { ok: false, alasan: "Tautan tidak dikenali." };
  if (Number(baris.dipakai) === 1) return { ok: false, alasan: "Tautan ini sudah dipakai." };

  const ked = String(baris.kedaluwarsa);
  if (ked <= sekarang()) return { ok: false, alasan: "Tautan ini sudah kedaluwarsa." };

  return { ok: true, penggunaId: Number(baris.pengguna_id) };
}

/** Hanguskan token dan kembalikan pengguna yang berhak. */
export function pakaiTokenReset(token: string): HasilPakaiToken {
  const cek = periksaTokenReset(token);
  if (!cek.ok) return cek;

  const hasil = jalankan(
    "UPDATE reset_sandi SET dipakai = 1 WHERE token_hash = ? AND dipakai = 0",
    sidik(token),
  );

  // Kalau tidak ada baris yang berubah, token sudah dipakai proses lain lebih dulu.
  if (Number(hasil.changes ?? 0) === 0) {
    return { ok: false, alasan: "Tautan ini sudah dipakai." };
  }

  return cek;
}

/** Buang token kedaluwarsa. Dipanggil saat meminta token baru. */
export function bersihkanTokenKedaluwarsa(): void {
  jalankan("DELETE FROM reset_sandi WHERE kedaluwarsa < ? OR dipakai = 1", sekarang());
}
