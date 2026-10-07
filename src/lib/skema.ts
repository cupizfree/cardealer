// Skema database — sumber tunggal. Dijalankan idempoten oleh db.ts.
// Sengaja ditulis sebagai string TypeScript (bukan berkas .sql terpisah)
// supaya ikut terbundel dan tidak bergantung pada cwd saat runtime.

export const SKEMA = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS pengguna (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  email          TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  nama           TEXT    NOT NULL,
  kata_sandi     TEXT    NOT NULL,
  peran          TEXT    NOT NULL CHECK (peran IN ('admin','staff')),
  aktif          INTEGER NOT NULL DEFAULT 1,
  telepon        TEXT,
  dibuat_pada    TEXT    NOT NULL DEFAULT (datetime('now')),
  terakhir_masuk TEXT
);

CREATE TABLE IF NOT EXISTS sesi (
  token       TEXT    PRIMARY KEY,
  pengguna_id INTEGER NOT NULL REFERENCES pengguna(id) ON DELETE CASCADE,
  kedaluwarsa TEXT    NOT NULL,
  dibuat_pada TEXT    NOT NULL DEFAULT (datetime('now')),
  user_agent  TEXT
);
CREATE INDEX IF NOT EXISTS idx_sesi_pengguna ON sesi(pengguna_id);

-- Tautan reset sandi sekali pakai.
-- Yang disimpan hanya SIDIK (hash) token, bukan tokennya — kalau basis data
-- bocor, tautannya tidak bisa dipakai ulang.
CREATE TABLE IF NOT EXISTS reset_sandi (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  pengguna_id INTEGER NOT NULL REFERENCES pengguna(id) ON DELETE CASCADE,
  token_hash  TEXT    NOT NULL UNIQUE,
  kedaluwarsa TEXT    NOT NULL,
  dipakai     INTEGER NOT NULL DEFAULT 0,
  dibuat_pada TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_reset_pengguna ON reset_sandi(pengguna_id);

CREATE TABLE IF NOT EXISTS dealer (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    NOT NULL UNIQUE,
  nama        TEXT    NOT NULL,
  kota        TEXT,
  alamat      TEXT,
  telepon     TEXT,
  email       TEXT,
  jam_buka    TEXT,
  aktif       INTEGER NOT NULL DEFAULT 1,
  dibuat_pada TEXT    NOT NULL DEFAULT (datetime('now')),
  diubah_pada TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS unit (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT    NOT NULL UNIQUE,
  judul         TEXT    NOT NULL,
  merek         TEXT    NOT NULL,
  model         TEXT,
  tipe          TEXT,
  tahun         INTEGER,
  harga         INTEGER NOT NULL,
  harga_cicilan TEXT,
  kilometer     TEXT,
  transmisi     TEXT,
  bahan_bakar   TEXT,
  warna         TEXT,
  lokasi        TEXT,
  deskripsi     TEXT,
  status        TEXT    NOT NULL DEFAULT 'tersedia'
                        CHECK (status IN ('draf','tersedia','dipesan','terjual')),
  unggulan      INTEGER NOT NULL DEFAULT 0,
  dealer_id     INTEGER REFERENCES dealer(id) ON DELETE SET NULL,
  dibuat_oleh   INTEGER REFERENCES pengguna(id) ON DELETE SET NULL,
  galeri        TEXT    NOT NULL DEFAULT '[]',
  fitur         TEXT    NOT NULL DEFAULT '{}',
  spesifikasi   TEXT    NOT NULL DEFAULT '{}',
  dibuat_pada   TEXT    NOT NULL DEFAULT (datetime('now')),
  diubah_pada   TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_unit_status ON unit(status);
CREATE INDEX IF NOT EXISTS idx_unit_merek  ON unit(merek);
CREATE INDEX IF NOT EXISTS idx_unit_dealer ON unit(dealer_id);

CREATE TABLE IF NOT EXISTS prospek (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  nama           TEXT    NOT NULL,
  telepon        TEXT,
  email          TEXT,
  pesan          TEXT,
  sumber         TEXT    NOT NULL DEFAULT 'kontak'
                         CHECK (sumber IN ('kontak','jual-mobil','tukar-tambah','detail-unit','newsletter')),
  status         TEXT    NOT NULL DEFAULT 'baru'
                         CHECK (status IN ('baru','dihubungi','terjadwal','selesai','batal')),
  catatan        TEXT,
  unit_id        INTEGER REFERENCES unit(id) ON DELETE SET NULL,
  ditangani_oleh INTEGER REFERENCES pengguna(id) ON DELETE SET NULL,
  dibuat_pada    TEXT    NOT NULL DEFAULT (datetime('now')),
  diubah_pada    TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_prospek_status  ON prospek(status);
CREATE INDEX IF NOT EXISTS idx_prospek_petugas ON prospek(ditangani_oleh);

CREATE TABLE IF NOT EXISTS log_aktivitas (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  pengguna_id INTEGER REFERENCES pengguna(id) ON DELETE SET NULL,
  aksi        TEXT    NOT NULL,
  entitas     TEXT    NOT NULL,
  entitas_id  INTEGER,
  ringkasan   TEXT,
  dibuat_pada TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_log_dibuat ON log_aktivitas(dibuat_pada);
`;
