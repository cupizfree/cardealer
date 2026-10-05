-- Skema MARF Showroom Mobil — SQLite
-- Dijalankan idempoten: semua pakai IF NOT EXISTS.

PRAGMA foreign_keys = ON;

-- ── Pengguna: admin & staff ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pengguna (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  nama          TEXT    NOT NULL,
  kata_sandi    TEXT    NOT NULL,              -- scrypt: "scrypt$N$r$p$salt$hash"
  peran         TEXT    NOT NULL CHECK (peran IN ('admin','staff')),
  aktif         INTEGER NOT NULL DEFAULT 1,
  telepon       TEXT,
  dibuat_pada   TEXT    NOT NULL DEFAULT (datetime('now')),
  terakhir_masuk TEXT
);

-- ── Sesi login ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sesi (
  token         TEXT    PRIMARY KEY,
  pengguna_id   INTEGER NOT NULL REFERENCES pengguna(id) ON DELETE CASCADE,
  kedaluwarsa   TEXT    NOT NULL,
  dibuat_pada   TEXT    NOT NULL DEFAULT (datetime('now')),
  user_agent    TEXT
);
CREATE INDEX IF NOT EXISTS idx_sesi_pengguna ON sesi(pengguna_id);

-- ── Dealer / showroom ──────────────────────────────────────────────────────
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

-- ── Unit mobil ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS unit (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT    NOT NULL UNIQUE,
  judul         TEXT    NOT NULL,
  merek         TEXT    NOT NULL,
  model         TEXT,
  tahun         INTEGER,
  harga         INTEGER NOT NULL,              -- rupiah, bilangan bulat
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
  -- bagian bersarang disimpan sebagai JSON teks
  galeri        TEXT    NOT NULL DEFAULT '[]',
  fitur         TEXT    NOT NULL DEFAULT '{}',
  spesifikasi   TEXT    NOT NULL DEFAULT '{}',
  dibuat_pada   TEXT    NOT NULL DEFAULT (datetime('now')),
  diubah_pada   TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_unit_status ON unit(status);
CREATE INDEX IF NOT EXISTS idx_unit_merek  ON unit(merek);
CREATE INDEX IF NOT EXISTS idx_unit_dealer ON unit(dealer_id);

-- ── Prospek dari form situs ────────────────────────────────────────────────
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
CREATE INDEX IF NOT EXISTS idx_prospek_status ON prospek(status);
CREATE INDEX IF NOT EXISTS idx_prospek_petugas ON prospek(ditangani_oleh);

-- ── Jejak audit ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS log_aktivitas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  pengguna_id  INTEGER REFERENCES pengguna(id) ON DELETE SET NULL,
  aksi         TEXT    NOT NULL,               -- 'buat' | 'ubah' | 'hapus' | 'masuk'
  entitas      TEXT    NOT NULL,               -- 'unit' | 'dealer' | 'prospek' | 'pengguna'
  entitas_id   INTEGER,
  ringkasan    TEXT,
  dibuat_pada  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_log_dibuat ON log_aktivitas(dibuat_pada);
