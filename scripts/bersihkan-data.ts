// Bersihkan data contoh supaya basis data mencerminkan keadaan MARF yang sebenarnya.
//
// Kenapa perlu: basis data awal diisi dari templat asal, jadi ia memuat data yang
// tidak pernah ada di MARF — tujuh showroom rekanan, empat prospek dengan nomor
// telepon dan surel karangan, dan 194 baris log aktivitas dari pekerjaan
// pengembangan. Semuanya tampil di panel dan di situs publik seolah sungguhan.
//
// Yang dikerjakan:
//   1. dealer       — sisakan showroom utama saja; unit yang menunjuk dealer yang
//                     dihapus dipindahkan ke showroom utama, bukan dikosongkan
//   2. prospek      — hapus semua (calon pembeli karangan)
//   3. log_aktivitas— hapus semua (riwayat pengembangan, bukan riwayat MARF)
//   4. pengguna     — nama akun staff jadi "Hendrik Marfundo"
//
// Idempoten: menjalankannya dua kali tidak mengubah apa pun pada kali kedua.
// Unit TIDAK disentuh — 18 unit tetap utuh.
//
// Jalankan (kering, tanpa menulis):
//   node --experimental-strip-types scripts/bersihkan-data.ts --kering
// Jalankan (sungguhan):
//   node --experimental-strip-types scripts/bersihkan-data.ts
//
// Basis data uji: tambahkan MARF_DB_PATH=./.data/marf-uji.db di depannya.

import { DatabaseSync } from "node:sqlite";
import { writeFileSync } from "node:fs";

const { allDealers } = await import("../src/data/dealers.ts");

const KERING = process.argv.includes("--kering");
const JALUR = process.env.MARF_DB_PATH ?? "./.data/marf.db";
const NAMA_STAFF = process.env.SEED_STAFF_NAMA?.trim() || "Hendrik Marfundo";
const EMAIL_STAFF = process.env.SEED_STAFF_EMAIL?.trim() || "staff@marf.id";

const db = new DatabaseSync(JALUR);
db.exec("PRAGMA foreign_keys = ON");

const angka = (sql: string): number => Number(db.prepare(sql).get()?.n ?? 0);

// Showroom yang disimpan: entri pertama `src/data/dealers.ts` — satu sumber
// kebenaran, sama dengan yang dipakai `seed.ts`. Kalau nanti showroom kedua
// ditambahkan di sana, skrip ini otomatis ikut menyimpannya.
const showroomUtama = allDealers[0];
if (!showroomUtama) {
  console.error("src/data/dealers.ts kosong — tidak ada showroom yang bisa disimpan.");
  process.exit(1);
}

const barisUtama = db.prepare("SELECT id, nama FROM dealer WHERE slug = ?").get(showroomUtama.slug) as
  | { id: number; nama: string }
  | undefined;

if (!barisUtama) {
  console.error(
    `Showroom '${showroomUtama.slug}' tidak ada di ${JALUR}.\n` +
      `Kalau basis data ini belum pernah di-seed, jalankan aplikasinya dulu.`,
  );
  process.exit(1);
}

console.log(`basis data : ${JALUR}${KERING ? "   [KERING — tidak ada yang ditulis]" : ""}`);
console.log(`showroom   : ${barisUtama.nama} (id=${barisUtama.id}, slug=${showroomUtama.slug})`);
console.log();

if (!KERING) db.exec("BEGIN");

// ── 1. Dealer ────────────────────────────────────────────────────────────────
const dealerDihapus = db
  .prepare("SELECT id, nama FROM dealer WHERE id <> ? ORDER BY id")
  .all(barisUtama.id) as { id: number; nama: string }[];

let unitDipindah = 0;
for (const d of dealerDihapus) {
  const n = angka(`SELECT COUNT(*) AS n FROM unit WHERE dealer_id = ${d.id}`);
  if (n) {
    if (!KERING) db.prepare("UPDATE unit SET dealer_id = ? WHERE dealer_id = ?").run(barisUtama.id, d.id);
    unitDipindah += n;
  }
  if (!KERING) db.prepare("DELETE FROM dealer WHERE id = ?").run(d.id);
  console.log(`  ${KERING ? "akan dihapus" : "dihapus     "} dealer id=${String(d.id).padEnd(3)} ${d.nama}${n ? `  (${n} unit dipindah)` : ""}`);
}
if (!dealerDihapus.length) console.log("  dealer      : sudah bersih");
if (unitDipindah) console.log(`  unit dipindah ke showroom utama: ${unitDipindah}`);

// ── 2. Prospek ───────────────────────────────────────────────────────────────
const nProspek = angka("SELECT COUNT(*) AS n FROM prospek");
if (nProspek && !KERING) db.exec("DELETE FROM prospek");
console.log(`  prospek     : ${nProspek ? `${KERING ? "akan dihapus" : "dihapus"} ${nProspek}` : "sudah kosong"}`);

// ── 3. Log aktivitas ─────────────────────────────────────────────────────────
const nLog = angka("SELECT COUNT(*) AS n FROM log_aktivitas");
if (nLog && !KERING) db.exec("DELETE FROM log_aktivitas");
console.log(`  log         : ${nLog ? `${KERING ? "akan dihapus" : "dihapus"} ${nLog}` : "sudah kosong"}`);

// ── 4. Nama akun staff ───────────────────────────────────────────────────────
const staff = db.prepare("SELECT id, nama FROM pengguna WHERE email = ? COLLATE NOCASE").get(EMAIL_STAFF) as
  | { id: number; nama: string }
  | undefined;

if (!staff) {
  console.log(`  staff       : akun ${EMAIL_STAFF} tidak ada — dilewati`);
} else if (staff.nama === NAMA_STAFF) {
  console.log(`  staff       : sudah bernama ${NAMA_STAFF}`);
} else {
  if (!KERING) db.prepare("UPDATE pengguna SET nama = ? WHERE id = ?").run(NAMA_STAFF, staff.id);
  console.log(`  staff       : ${KERING ? "akan diubah" : "diubah"} "${staff.nama}" -> "${NAMA_STAFF}"`);
}

if (!KERING) db.exec("COMMIT");

// Tandai waktu pembersihan.
//
// Pemeriksa butuh cara membedakan jejak pengembangan dari aktivitas baru: log
// MEMANG boleh terisi lagi setelah ini (setiap login mencatat dirinya), jadi
// "log kosong" bukan ukuran yang benar. Yang tidak boleh ada adalah baris yang
// lebih tua dari tanda ini.
if (!KERING) {
  const cap = new Date().toISOString().replace("T", " ").slice(0, 19);
  // Namanya mengikuti berkas basis datanya, jadi basis data uji dan produksi
  // tidak saling menimpa penanda.
  const penanda = `${JALUR}.bersih.txt`;
  writeFileSync(penanda, `${cap}\n`, "utf8");
  console.log(`\npenanda    : ${penanda} -> ${cap}`);
}

// ── Ringkasan akhir ──────────────────────────────────────────────────────────
console.log();
console.log("keadaan sekarang:");
for (const t of ["dealer", "unit", "prospek", "log_aktivitas", "pengguna", "sesi"]) {
  console.log(`  ${t.padEnd(15)} ${angka(`SELECT COUNT(*) AS n FROM ${t}`)}`);
}
console.log();
for (const p of db.prepare("SELECT email, nama, peran FROM pengguna ORDER BY id").all())
  console.log(`  pengguna: ${String(p.peran).padEnd(6)} ${String(p.email).padEnd(20)} ${p.nama}`);

db.close();
