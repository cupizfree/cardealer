// Koneksi SQLite tunggal untuk seluruh aplikasi.
// Memakai node:sqlite (bawaan Node 22.5+/26) — tanpa dependensi npm.

import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { SKEMA } from "./skema";

export type Baris = Record<string, unknown>;

let _db: DatabaseSync | null = null;

function jalurDb(): string {
  const p = process.env.MARF_DB_PATH || "./.data/marf.db";
  return resolve(process.cwd(), p);
}

export function db(): DatabaseSync {
  if (_db) return _db;

  const jalur = jalurDb();
  mkdirSync(dirname(jalur), { recursive: true });

  const d = new DatabaseSync(jalur);
  d.exec("PRAGMA journal_mode = WAL;");
  d.exec("PRAGMA foreign_keys = ON;");
  d.exec("PRAGMA busy_timeout = 5000;");
  d.exec("PRAGMA synchronous = NORMAL;");
  d.exec(SKEMA);
  tambahKolomBaru(d);

  _db = d;
  return d;
}

/**
 * Kolom yang ditambahkan setelah rilis pertama.
 *
 * `CREATE TABLE IF NOT EXISTS` tidak menyentuh tabel yang sudah ada, jadi
 * menambah kolom ke `SKEMA` saja tidak akan muncul di basis data lama — dan
 * `SELECT tipe FROM unit` akan gagal di basis data produksi yang sudah terisi.
 * Tambahkan di sini, idempoten.
 */
function tambahKolomBaru(d: DatabaseSync) {
  const kolom = new Set(
    (d.prepare("PRAGMA table_info(unit)").all() as { name: string }[]).map((k) => k.name),
  );
  if (!kolom.has("tipe")) d.exec("ALTER TABLE unit ADD COLUMN tipe TEXT");
}

/** Jalankan fungsi dalam transaksi. Batal kalau melempar. */
export function transaksi<T>(fn: (d: DatabaseSync) => T): T {
  const d = db();
  d.exec("BEGIN");
  try {
    const hasil = fn(d);
    d.exec("COMMIT");
    return hasil;
  } catch (e) {
    try {
      d.exec("ROLLBACK");
    } catch {
      /* transaksi mungkin sudah batal */
    }
    throw e;
  }
}

export function semua(sql: string, ...params: unknown[]): Baris[] {
  return db().prepare(sql).all(...(params as never[])) as Baris[];
}

export function satu(sql: string, ...params: unknown[]): Baris | undefined {
  return db().prepare(sql).get(...(params as never[])) as Baris | undefined;
}

export function jalankan(sql: string, ...params: unknown[]) {
  return db().prepare(sql).run(...(params as never[]));
}

/** ID baris yang baru saja dimasukkan. */
export function idBaru(): number {
  const r = satu("SELECT last_insert_rowid() AS id");
  return Number(r?.id ?? 0);
}

export function sekarang(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}
