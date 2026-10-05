// Repositori dealer/showroom.

import { jalankan, semua, satu } from "../db";

export type Dealer = {
  id: number;
  slug: string;
  nama: string;
  kota: string | null;
  alamat: string | null;
  telepon: string | null;
  email: string | null;
  jam_buka: string | null;
  aktif: boolean;
  dibuat_pada: string;
  diubah_pada: string;
};

type Baris = Record<string, unknown>;

function teks(v: unknown): string | null {
  return v === null || v === undefined || v === "" ? null : String(v);
}

export function dariBaris(r: Baris): Dealer {
  return {
    id: Number(r.id),
    slug: String(r.slug),
    nama: String(r.nama),
    kota: teks(r.kota),
    alamat: teks(r.alamat),
    telepon: teks(r.telepon),
    email: teks(r.email),
    jam_buka: teks(r.jam_buka),
    aktif: Number(r.aktif) === 1,
    dibuat_pada: String(r.dibuat_pada),
    diubah_pada: String(r.diubah_pada),
  };
}

export function daftarDealer(hanyaAktif = false): Dealer[] {
  const where = hanyaAktif ? "WHERE aktif = 1" : "";
  return semua(`SELECT * FROM dealer ${where} ORDER BY nama`).map(dariBaris);
}

export function ambilDealer(id: number): Dealer | null {
  const r = satu("SELECT * FROM dealer WHERE id = ?", id);
  return r ? dariBaris(r) : null;
}

export function slugDealerTerpakai(slug: string, kecualiId?: number): boolean {
  const r = kecualiId
    ? satu("SELECT id FROM dealer WHERE slug = ? AND id <> ?", slug, kecualiId)
    : satu("SELECT id FROM dealer WHERE slug = ?", slug);
  return !!r;
}

export type MasukanDealer = {
  slug: string;
  nama: string;
  kota?: string | null;
  alamat?: string | null;
  telepon?: string | null;
  email?: string | null;
  jam_buka?: string | null;
  aktif?: boolean;
};

export function buatDealer(m: MasukanDealer): Dealer {
  jalankan(
    `INSERT INTO dealer (slug, nama, kota, alamat, telepon, email, jam_buka, aktif)
     VALUES (?,?,?,?,?,?,?,?)`,
    m.slug,
    m.nama,
    m.kota ?? null,
    m.alamat ?? null,
    m.telepon ?? null,
    m.email ?? null,
    m.jam_buka ?? null,
    m.aktif === false ? 0 : 1,
  );
  const id = Number(satu("SELECT last_insert_rowid() AS id")?.id ?? 0);
  return ambilDealer(id)!;
}

export function ubahDealer(id: number, m: Partial<MasukanDealer>): Dealer | null {
  if (!ambilDealer(id)) return null;

  const kolom: string[] = [];
  const nilai: unknown[] = [];
  const set = (nama: string, v: unknown) => {
    kolom.push(`${nama} = ?`);
    nilai.push(v);
  };

  if (m.slug !== undefined) set("slug", m.slug);
  if (m.nama !== undefined) set("nama", m.nama);
  if (m.kota !== undefined) set("kota", m.kota);
  if (m.alamat !== undefined) set("alamat", m.alamat);
  if (m.telepon !== undefined) set("telepon", m.telepon);
  if (m.email !== undefined) set("email", m.email);
  if (m.jam_buka !== undefined) set("jam_buka", m.jam_buka);
  if (m.aktif !== undefined) set("aktif", m.aktif ? 1 : 0);

  if (!kolom.length) return ambilDealer(id);

  set("diubah_pada", new Date().toISOString().replace("T", " ").slice(0, 19));
  nilai.push(id);
  jalankan(`UPDATE dealer SET ${kolom.join(", ")} WHERE id = ?`, ...nilai);
  return ambilDealer(id);
}

export function hapusDealer(id: number): boolean {
  if (!ambilDealer(id)) return false;
  jalankan("DELETE FROM dealer WHERE id = ?", id);
  return true;
}

/** Berapa unit yang menunjuk ke dealer ini — dipakai sebelum menolak hapus. */
export function jumlahUnitDealer(id: number): number {
  return Number(satu("SELECT COUNT(*) AS n FROM unit WHERE dealer_id = ?", id)?.n ?? 0);
}
