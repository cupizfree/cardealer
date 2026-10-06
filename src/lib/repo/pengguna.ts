// Repositori pengguna (admin & staff) + jejak audit.

import { jalankan, semua, satu } from "../db";
import { hashSandi } from "../sandi";

export type Peran = "admin" | "staff";
export const PERAN = ["admin", "staff"] as const;

export type Pengguna = {
  id: number;
  email: string;
  nama: string;
  peran: Peran;
  aktif: boolean;
  telepon: string | null;
  dibuat_pada: string;
  terakhir_masuk: string | null;
};

type Baris = Record<string, unknown>;

function teks(v: unknown): string | null {
  return v === null || v === undefined || v === "" ? null : String(v);
}

/** Sengaja TIDAK menyertakan kolom kata_sandi. */
export function dariBaris(r: Baris): Pengguna {
  return {
    id: Number(r.id),
    email: String(r.email),
    nama: String(r.nama),
    peran: String(r.peran) as Peran,
    aktif: Number(r.aktif) === 1,
    telepon: teks(r.telepon),
    dibuat_pada: String(r.dibuat_pada),
    terakhir_masuk: teks(r.terakhir_masuk),
  };
}

const KOLOM_AMAN =
  "id, email, nama, peran, aktif, telepon, dibuat_pada, terakhir_masuk";

export function daftarPengguna(): Pengguna[] {
  return semua(`SELECT ${KOLOM_AMAN} FROM pengguna ORDER BY peran DESC, nama`).map(dariBaris);
}

export function ambilPengguna(id: number): Pengguna | null {
  const r = satu(`SELECT ${KOLOM_AMAN} FROM pengguna WHERE id = ?`, id);
  return r ? dariBaris(r) : null;
}

/** Termasuk kolom kata_sandi — HANYA untuk pemeriksaan login. */
export function ambilUntukLogin(email: string): (Pengguna & { kata_sandi: string }) | null {
  const r = satu("SELECT * FROM pengguna WHERE email = ? AND aktif = 1", email);
  if (!r) return null;
  return { ...dariBaris(r), kata_sandi: String(r.kata_sandi) };
}

export function emailTerpakai(email: string, kecualiId?: number): boolean {
  const r = kecualiId
    ? satu("SELECT id FROM pengguna WHERE email = ? AND id <> ?", email, kecualiId)
    : satu("SELECT id FROM pengguna WHERE email = ?", email);
  return !!r;
}

export type MasukanPengguna = {
  email: string;
  nama: string;
  peran: Peran;
  kata_sandi?: string;
  telepon?: string | null;
  aktif?: boolean;
};

export function buatPengguna(m: MasukanPengguna): Pengguna {
  jalankan(
    `INSERT INTO pengguna (email, nama, kata_sandi, peran, aktif, telepon)
     VALUES (?,?,?,?,?,?)`,
    m.email,
    m.nama,
    hashSandi(m.kata_sandi ?? ""),
    m.peran,
    m.aktif === false ? 0 : 1,
    m.telepon ?? null,
  );
  const id = Number(satu("SELECT last_insert_rowid() AS id")?.id ?? 0);
  return ambilPengguna(id)!;
}

export function ubahPengguna(id: number, m: Partial<MasukanPengguna>): Pengguna | null {
  if (!ambilPengguna(id)) return null;

  const kolom: string[] = [];
  const nilai: unknown[] = [];
  const set = (nama: string, v: unknown) => {
    kolom.push(`${nama} = ?`);
    nilai.push(v);
  };

  if (m.email !== undefined) set("email", m.email);
  if (m.nama !== undefined) set("nama", m.nama);
  if (m.peran !== undefined) set("peran", m.peran);
  if (m.telepon !== undefined) set("telepon", m.telepon);
  if (m.aktif !== undefined) set("aktif", m.aktif ? 1 : 0);
  // kata sandi hanya diubah kalau memang dikirim dan tidak kosong
  if (m.kata_sandi) set("kata_sandi", hashSandi(m.kata_sandi));

  if (!kolom.length) return ambilPengguna(id);

  nilai.push(id);
  jalankan(`UPDATE pengguna SET ${kolom.join(", ")} WHERE id = ?`, ...nilai);
  return ambilPengguna(id);
}

export function hapusPengguna(id: number): boolean {
  if (!ambilPengguna(id)) return false;
  jalankan("DELETE FROM pengguna WHERE id = ?", id);
  return true;
}

/** Berapa admin aktif — dipakai supaya admin terakhir tidak bisa dihapus. */
export function jumlahAdminAktif(): number {
  return Number(satu("SELECT COUNT(*) AS n FROM pengguna WHERE peran = 'admin' AND aktif = 1")?.n ?? 0);
}

// ── Jejak audit ────────────────────────────────────────────────────────────

export type LogAktivitas = {
  id: number;
  pengguna_id: number | null;
  aksi: string;
  entitas: string;
  entitas_id: number | null;
  ringkasan: string | null;
  dibuat_pada: string;
  nama_pengguna?: string | null;
};

export function catatLog(
  penggunaId: number | null,
  aksi: string,
  entitas: string,
  entitasId: number | null,
  ringkasan: string,
) {
  jalankan(
    `INSERT INTO log_aktivitas (pengguna_id, aksi, entitas, entitas_id, ringkasan)
     VALUES (?,?,?,?,?)`,
    penggunaId,
    aksi,
    entitas,
    entitasId,
    ringkasan.slice(0, 300),
  );
}

export function daftarLog(batas = 50): LogAktivitas[] {
  return semua(
    `SELECT l.*, u.nama AS nama_pengguna
       FROM log_aktivitas l
       LEFT JOIN pengguna u ON u.id = l.pengguna_id
      ORDER BY l.dibuat_pada DESC, l.id DESC
      LIMIT ?`,
    Math.min(200, Math.max(1, batas)),
  ).map((r) => ({
    id: Number(r.id),
    pengguna_id: r.pengguna_id === null ? null : Number(r.pengguna_id),
    aksi: String(r.aksi),
    entitas: String(r.entitas),
    entitas_id: r.entitas_id === null ? null : Number(r.entitas_id),
    ringkasan: teks(r.ringkasan),
    dibuat_pada: String(r.dibuat_pada),
    nama_pengguna: teks(r.nama_pengguna),
  }));
}

/** Bersihkan sesi yang sudah kedaluwarsa. */
export function bersihkanSesiKedaluwarsa(): number {
  const r = jalankan("DELETE FROM sesi WHERE kedaluwarsa < datetime('now')");
  return Number(r.changes ?? 0);
}

/**
 * Cabut SEMUA sesi milik satu pengguna.
 * Dipanggil setelah sandi diubah, supaya perangkat yang masih masuk dengan
 * sandi lama langsung terlempar keluar.
 */
export function cabutSemuaSesi(penggunaId: number): number {
  const r = jalankan("DELETE FROM sesi WHERE pengguna_id = ?", penggunaId);
  return Number(r.changes ?? 0);
}

/** Ubah hanya kata sandi. Mengembalikan false kalau pengguna tidak ada. */
export function ubahSandi(penggunaId: number, sandiTersandi: string): boolean {
  const r = jalankan(
    "UPDATE pengguna SET kata_sandi = ? WHERE id = ?",
    sandiTersandi,
    penggunaId,
  );
  return Number(r.changes ?? 0) > 0;
}
