// Repositori prospek — kiriman dari form situs (kontak, jual mobil, tukar tambah).

import { jalankan, semua, satu } from "../db";

export const SUMBER_PROSPEK = ["kontak", "jual-mobil", "tukar-tambah", "detail-unit", "newsletter"] as const;
export type SumberProspek = (typeof SUMBER_PROSPEK)[number];

export const STATUS_PROSPEK = ["baru", "dihubungi", "terjadwal", "selesai", "batal"] as const;
export type StatusProspek = (typeof STATUS_PROSPEK)[number];

export type Prospek = {
  id: number;
  nama: string;
  telepon: string | null;
  email: string | null;
  pesan: string | null;
  sumber: SumberProspek;
  status: StatusProspek;
  catatan: string | null;
  unit_id: number | null;
  ditangani_oleh: number | null;
  dibuat_pada: string;
  diubah_pada: string;
  // disertakan saat daftar, hasil JOIN
  nama_petugas?: string | null;
  judul_unit?: string | null;
};

type Baris = Record<string, unknown>;

function teks(v: unknown): string | null {
  return v === null || v === undefined || v === "" ? null : String(v);
}

export function dariBaris(r: Baris): Prospek {
  return {
    id: Number(r.id),
    nama: String(r.nama),
    telepon: teks(r.telepon),
    email: teks(r.email),
    pesan: teks(r.pesan),
    sumber: String(r.sumber) as SumberProspek,
    status: String(r.status) as StatusProspek,
    catatan: teks(r.catatan),
    unit_id: r.unit_id === null || r.unit_id === undefined ? null : Number(r.unit_id),
    ditangani_oleh:
      r.ditangani_oleh === null || r.ditangani_oleh === undefined ? null : Number(r.ditangani_oleh),
    dibuat_pada: String(r.dibuat_pada),
    diubah_pada: String(r.diubah_pada),
    ...(r.nama_petugas !== undefined ? { nama_petugas: teks(r.nama_petugas) } : {}),
    ...(r.judul_unit !== undefined ? { judul_unit: teks(r.judul_unit) } : {}),
  };
}

export type FilterProspek = {
  status?: string | null;
  sumber?: string | null;
  petugas?: number | null;
  q?: string | null;
  halaman?: number;
  batas?: number;
};

export function daftarProspek(f: FilterProspek = {}): { baris: Prospek[]; total: number } {
  const syarat: string[] = [];
  const nilai: unknown[] = [];

  if (f.status) {
    syarat.push("p.status = ?");
    nilai.push(f.status);
  }
  if (f.sumber) {
    syarat.push("p.sumber = ?");
    nilai.push(f.sumber);
  }
  if (f.petugas) {
    syarat.push("p.ditangani_oleh = ?");
    nilai.push(f.petugas);
  }
  if (f.q) {
    syarat.push("(p.nama LIKE ? OR p.telepon LIKE ? OR p.email LIKE ? OR p.pesan LIKE ?)");
    const pola = `%${f.q}%`;
    nilai.push(pola, pola, pola, pola);
  }

  const where = syarat.length ? `WHERE ${syarat.join(" AND ")}` : "";
  const total = Number(
    satu(`SELECT COUNT(*) AS n FROM prospek p ${where}`, ...nilai)?.n ?? 0,
  );

  const batas = Math.min(100, Math.max(1, f.batas ?? 20));
  const halaman = Math.max(1, f.halaman ?? 1);

  const baris = semua(
    `SELECT p.*, u.nama AS nama_petugas, t.judul AS judul_unit
       FROM prospek p
       LEFT JOIN pengguna u ON u.id = p.ditangani_oleh
       LEFT JOIN unit t     ON t.id = p.unit_id
       ${where}
      ORDER BY CASE p.status WHEN 'baru' THEN 0 WHEN 'dihubungi' THEN 1
                             WHEN 'terjadwal' THEN 2 WHEN 'selesai' THEN 3 ELSE 4 END,
               p.dibuat_pada DESC, p.id DESC
      LIMIT ? OFFSET ?`,
    ...nilai,
    batas,
    (halaman - 1) * batas,
  ).map(dariBaris);

  return { baris, total };
}

export function ambilProspek(id: number): Prospek | null {
  const r = satu(
    `SELECT p.*, u.nama AS nama_petugas, t.judul AS judul_unit
       FROM prospek p
       LEFT JOIN pengguna u ON u.id = p.ditangani_oleh
       LEFT JOIN unit t     ON t.id = p.unit_id
      WHERE p.id = ?`,
    id,
  );
  return r ? dariBaris(r) : null;
}

export type MasukanProspek = {
  nama: string;
  telepon?: string | null;
  email?: string | null;
  pesan?: string | null;
  sumber?: SumberProspek;
  status?: StatusProspek;
  catatan?: string | null;
  unit_id?: number | null;
  ditangani_oleh?: number | null;
};

export function buatProspek(m: MasukanProspek): Prospek {
  jalankan(
    `INSERT INTO prospek (nama, telepon, email, pesan, sumber, status, catatan, unit_id, ditangani_oleh)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    m.nama,
    m.telepon ?? null,
    m.email ?? null,
    m.pesan ?? null,
    m.sumber ?? "kontak",
    m.status ?? "baru",
    m.catatan ?? null,
    m.unit_id ?? null,
    m.ditangani_oleh ?? null,
  );
  const id = Number(satu("SELECT last_insert_rowid() AS id")?.id ?? 0);
  return ambilProspek(id)!;
}

export function ubahProspek(id: number, m: Partial<MasukanProspek>): Prospek | null {
  if (!ambilProspek(id)) return null;

  const kolom: string[] = [];
  const nilai: unknown[] = [];
  const set = (nama: string, v: unknown) => {
    kolom.push(`${nama} = ?`);
    nilai.push(v);
  };

  if (m.nama !== undefined) set("nama", m.nama);
  if (m.telepon !== undefined) set("telepon", m.telepon);
  if (m.email !== undefined) set("email", m.email);
  if (m.pesan !== undefined) set("pesan", m.pesan);
  if (m.sumber !== undefined) set("sumber", m.sumber);
  if (m.status !== undefined) set("status", m.status);
  if (m.catatan !== undefined) set("catatan", m.catatan);
  if (m.unit_id !== undefined) set("unit_id", m.unit_id);
  if (m.ditangani_oleh !== undefined) set("ditangani_oleh", m.ditangani_oleh);

  if (!kolom.length) return ambilProspek(id);

  set("diubah_pada", new Date().toISOString().replace("T", " ").slice(0, 19));
  nilai.push(id);
  jalankan(`UPDATE prospek SET ${kolom.join(", ")} WHERE id = ?`, ...nilai);
  return ambilProspek(id);
}

export function hapusProspek(id: number): boolean {
  if (!ambilProspek(id)) return false;
  jalankan("DELETE FROM prospek WHERE id = ?", id);
  return true;
}

/** Jumlah prospek per status — untuk kartu ringkasan dasbor. */
export function ringkasanProspek(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const s of STATUS_PROSPEK) out[s] = 0;
  for (const r of semua("SELECT status, COUNT(*) AS n FROM prospek GROUP BY status")) {
    out[String(r.status)] = Number(r.n);
  }
  return out;
}
