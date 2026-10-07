// Repositori unit — seluruh SQL tabel `unit` terkumpul di sini.
// Route API tidak menulis SQL langsung, jadi lapisan data bisa ditukar nanti
// (SQLite -> Postgres/Supabase) tanpa menyentuh route atau halaman.

import { jalankan, semua, satu } from "../db";

export const STATUS_UNIT = ["draf", "tersedia", "dipesan", "terjual"] as const;
export type StatusUnit = (typeof STATUS_UNIT)[number];

export type Unit = {
  id: number;
  slug: string;
  judul: string;
  merek: string;
  model: string | null;
  /** Slug jenis bodi (`suv`, `mpv`, …) — lihat `src/lib/bodi.ts`. */
  tipe: string | null;
  tahun: number | null;
  harga: number;
  harga_cicilan: string | null;
  kilometer: string | null;
  transmisi: string | null;
  bahan_bakar: string | null;
  warna: string | null;
  lokasi: string | null;
  deskripsi: string | null;
  status: StatusUnit;
  unggulan: boolean;
  dealer_id: number | null;
  galeri: unknown[];
  fitur: Record<string, string[]>;
  spesifikasi: Record<string, unknown>;
  dibuat_pada: string;
  diubah_pada: string;
};

type Baris = Record<string, unknown>;

function urai<T>(t: unknown, bawaan: T): T {
  if (typeof t !== "string" || t === "") return bawaan;
  try {
    return JSON.parse(t) as T;
  } catch {
    return bawaan;
  }
}

function teks(v: unknown): string | null {
  return v === null || v === undefined || v === "" ? null : String(v);
}

export function dariBaris(r: Baris): Unit {
  return {
    id: Number(r.id),
    slug: String(r.slug),
    judul: String(r.judul),
    merek: String(r.merek),
    model: teks(r.model),
    tipe: teks(r.tipe),
    tahun: r.tahun === null || r.tahun === undefined ? null : Number(r.tahun),
    harga: Number(r.harga),
    harga_cicilan: teks(r.harga_cicilan),
    kilometer: teks(r.kilometer),
    transmisi: teks(r.transmisi),
    bahan_bakar: teks(r.bahan_bakar),
    warna: teks(r.warna),
    lokasi: teks(r.lokasi),
    deskripsi: teks(r.deskripsi),
    status: String(r.status) as StatusUnit,
    unggulan: Number(r.unggulan) === 1,
    dealer_id: r.dealer_id === null || r.dealer_id === undefined ? null : Number(r.dealer_id),
    galeri: urai<unknown[]>(r.galeri, []),
    fitur: urai<Record<string, string[]>>(r.fitur, {}),
    spesifikasi: urai<Record<string, unknown>>(r.spesifikasi, {}),
    dibuat_pada: String(r.dibuat_pada),
    diubah_pada: String(r.diubah_pada),
  };
}

export type FilterUnit = {
  q?: string | null;
  merek?: string | null;
  status?: string | null;
  unggulan?: boolean;
  halaman?: number;
  batas?: number;
  urut?: string | null;
};

const URUTAN: Record<string, string> = {
  terbaru: "dibuat_pada DESC, id DESC",
  termurah: "harga ASC",
  termahal: "harga DESC",
  tahun: "tahun DESC, id DESC",
  judul: "judul ASC",
};

export function daftarUnit(f: FilterUnit = {}): { baris: Unit[]; total: number } {
  const syarat: string[] = [];
  const nilai: unknown[] = [];

  if (f.q) {
    syarat.push("(judul LIKE ? OR merek LIKE ? OR model LIKE ? OR deskripsi LIKE ?)");
    const pola = `%${f.q}%`;
    nilai.push(pola, pola, pola, pola);
  }
  if (f.merek) {
    syarat.push("merek = ?");
    nilai.push(f.merek);
  }
  if (f.status) {
    syarat.push("status = ?");
    nilai.push(f.status);
  }
  if (f.unggulan) syarat.push("unggulan = 1");

  const where = syarat.length ? `WHERE ${syarat.join(" AND ")}` : "";
  const total = Number(satu(`SELECT COUNT(*) AS n FROM unit ${where}`, ...nilai)?.n ?? 0);

  const batas = Math.min(100, Math.max(1, f.batas ?? 20));
  const halaman = Math.max(1, f.halaman ?? 1);
  const order = URUTAN[f.urut ?? "terbaru"] ?? URUTAN.terbaru;

  const baris = semua(
    `SELECT * FROM unit ${where} ORDER BY ${order} LIMIT ? OFFSET ?`,
    ...nilai,
    batas,
    (halaman - 1) * batas,
  ).map(dariBaris);

  return { baris, total };
}

export function ambilUnit(id: number): Unit | null {
  const r = satu("SELECT * FROM unit WHERE id = ?", id);
  return r ? dariBaris(r) : null;
}

export function ambilUnitSlug(slug: string): Unit | null {
  const r = satu("SELECT * FROM unit WHERE slug = ?", slug);
  return r ? dariBaris(r) : null;
}

export type MasukanUnit = {
  slug?: string;
  judul: string;
  merek: string;
  model?: string | null;
  tipe?: string | null;
  tahun?: number | null;
  harga: number;
  harga_cicilan?: string | null;
  kilometer?: string | null;
  transmisi?: string | null;
  bahan_bakar?: string | null;
  warna?: string | null;
  lokasi?: string | null;
  deskripsi?: string | null;
  status?: StatusUnit;
  unggulan?: boolean;
  dealer_id?: number | null;
  galeri?: unknown[];
  fitur?: Record<string, string[]>;
  spesifikasi?: Record<string, unknown>;
};

export function slugTerpakai(slug: string, kecualiId?: number): boolean {
  const r = kecualiId
    ? satu("SELECT id FROM unit WHERE slug = ? AND id <> ?", slug, kecualiId)
    : satu("SELECT id FROM unit WHERE slug = ?", slug);
  return !!r;
}

export function buatUnit(m: MasukanUnit, penggunaId: number | null): Unit {
  jalankan(
    `INSERT INTO unit
      (slug, judul, merek, model, tipe, tahun, harga, harga_cicilan, kilometer, transmisi,
       bahan_bakar, warna, lokasi, deskripsi, status, unggulan, dealer_id, dibuat_oleh,
       galeri, fitur, spesifikasi)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    m.slug ?? "",
    m.judul,
    m.merek,
    m.model ?? null,
    m.tipe ?? null,
    m.tahun ?? null,
    m.harga,
    m.harga_cicilan ?? null,
    m.kilometer ?? null,
    m.transmisi ?? null,
    m.bahan_bakar ?? null,
    m.warna ?? null,
    m.lokasi ?? null,
    m.deskripsi ?? null,
    m.status ?? "tersedia",
    m.unggulan ? 1 : 0,
    m.dealer_id ?? null,
    penggunaId,
    JSON.stringify(m.galeri ?? []),
    JSON.stringify(m.fitur ?? {}),
    JSON.stringify(m.spesifikasi ?? {}),
  );
  const id = Number(satu("SELECT last_insert_rowid() AS id")?.id ?? 0);
  return ambilUnit(id)!;
}

export function ubahUnit(id: number, m: Partial<MasukanUnit>): Unit | null {
  const ada = ambilUnit(id);
  if (!ada) return null;

  const kolom: string[] = [];
  const nilai: unknown[] = [];
  const set = (nama: string, v: unknown) => {
    kolom.push(`${nama} = ?`);
    nilai.push(v);
  };

  if (m.slug !== undefined) set("slug", m.slug);
  if (m.judul !== undefined) set("judul", m.judul);
  if (m.merek !== undefined) set("merek", m.merek);
  if (m.model !== undefined) set("model", m.model);
  if (m.tipe !== undefined) set("tipe", m.tipe);
  if (m.tahun !== undefined) set("tahun", m.tahun);
  if (m.harga !== undefined) set("harga", m.harga);
  if (m.harga_cicilan !== undefined) set("harga_cicilan", m.harga_cicilan);
  if (m.kilometer !== undefined) set("kilometer", m.kilometer);
  if (m.transmisi !== undefined) set("transmisi", m.transmisi);
  if (m.bahan_bakar !== undefined) set("bahan_bakar", m.bahan_bakar);
  if (m.warna !== undefined) set("warna", m.warna);
  if (m.lokasi !== undefined) set("lokasi", m.lokasi);
  if (m.deskripsi !== undefined) set("deskripsi", m.deskripsi);
  if (m.status !== undefined) set("status", m.status);
  if (m.unggulan !== undefined) set("unggulan", m.unggulan ? 1 : 0);
  if (m.dealer_id !== undefined) set("dealer_id", m.dealer_id);
  if (m.galeri !== undefined) set("galeri", JSON.stringify(m.galeri));
  if (m.fitur !== undefined) set("fitur", JSON.stringify(m.fitur));
  if (m.spesifikasi !== undefined) set("spesifikasi", JSON.stringify(m.spesifikasi));

  if (!kolom.length) return ada;

  set("diubah_pada", new Date().toISOString().replace("T", " ").slice(0, 19));
  nilai.push(id);
  jalankan(`UPDATE unit SET ${kolom.join(", ")} WHERE id = ?`, ...nilai);
  return ambilUnit(id);
}

export function hapusUnit(id: number): boolean {
  const ada = ambilUnit(id);
  if (!ada) return false;
  jalankan("DELETE FROM unit WHERE id = ?", id);
  return true;
}

/** Daftar merek unik — untuk isi dropdown filter. */
export function daftarMerek(): string[] {
  return semua("SELECT DISTINCT merek FROM unit ORDER BY merek").map((r) => String(r.merek));
}
