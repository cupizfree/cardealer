// Ganti kata sandi akun yang sudah ada — untuk merotasi sandi yang pernah bocor.
//
// Kenapa skrip ini ada: sandi awal proyek ini pernah tertulis di README sebuah
// repositori PUBLIK, dan pernah ter-commit. Menghapus barisnya dari berkas
// TIDAK menghapusnya dari riwayat git — siapa pun masih bisa menjalankan
// `git log -p` dan membacanya. Satu-satunya perbaikan yang sungguhan adalah
// mengganti sandinya, dan itu yang dilakukan skrip ini.
//
// Jalankan:
//   SEED_ADMIN_SANDI="sandi-baru" node --experimental-strip-types scripts/ganti-sandi.ts
//
// Hanya akun yang variabelnya diisi yang diubah. Yang kosong dilewati, bukan
// dikosongkan. Sesi yang sedang berjalan untuk akun itu ikut dicabut — kalau
// tidak, sesi penyerang yang sudah masuk tetap hidup setelah sandinya diganti.
//
// `--kering` menampilkan apa yang AKAN dilakukan tanpa menulis apa pun.

import { DatabaseSync } from "node:sqlite";

// `sandi.ts` tidak mengimpor apa pun selain `node:crypto`, jadi bisa dimuat
// langsung — berbeda dari modul lain yang memakai alias "@/".
const { hashSandi } = await import("../src/lib/sandi.ts");

const KERING = process.argv.includes("--kering");
const JALUR = process.env.MARF_DB_PATH ?? "./.data/marf.db";

const TARGET = [
  { peran: "admin", variabel: "SEED_ADMIN_SANDI", surel: process.env.SEED_ADMIN_EMAIL?.trim() || "admin@marf.id" },
  { peran: "staff", variabel: "SEED_STAFF_SANDI", surel: process.env.SEED_STAFF_EMAIL?.trim() || "staff@marf.id" },
];

const db = new DatabaseSync(JALUR);

console.log(`basis data: ${JALUR}${KERING ? "   [KERING — tidak ada yang ditulis]" : ""}`);
console.log();

let diubah = 0;
let dilewati = 0;
let takAda = 0;

for (const t of TARGET) {
  const sandi = process.env[t.variabel]?.trim();
  if (!sandi) {
    console.log(`  lewat    ${t.peran.padEnd(6)} ${t.variabel} kosong — tidak diubah`);
    dilewati++;
    continue;
  }

  const baris = db.prepare("SELECT id, email FROM pengguna WHERE email = ?").get(t.surel);
  if (!baris) {
    console.log(`  tak ada  ${t.peran.padEnd(6)} ${t.surel} tidak ditemukan di basis data`);
    takAda++;
    continue;
  }

  // Panjangnya saja yang dilaporkan — nilainya tidak pernah dicetak.
  console.log(
    `  ${KERING ? "akan ubah" : "diubah  "} ${t.peran.padEnd(6)} ${t.surel} ` +
      `(id=${baris.id}, sandi ${sandi.length} karakter)`,
  );

  if (KERING) continue;

  db.prepare("UPDATE pengguna SET kata_sandi = ? WHERE id = ?").run(hashSandi(sandi), baris.id);
  const sesi = db.prepare("DELETE FROM sesi WHERE pengguna_id = ?").run(baris.id);
  console.log(`           sesi dicabut: ${sesi.changes}`);
  diubah++;
}

if (!KERING && diubah > 0) {
  db.prepare(
    `INSERT INTO log_aktivitas (pengguna_id, aksi, entitas, entitas_id, ringkasan)
     VALUES (NULL, ?, ?, NULL, ?)`,
  ).run("ganti-sandi", "pengguna", `Rotasi kata sandi lewat skrip: ${diubah} akun`);
}

console.log();
console.log(`diubah  : ${diubah}`);
console.log(`dilewati: ${dilewati}`);
console.log(`tak ada : ${takAda}`);

if (KERING) console.log("\nJalankan ulang tanpa --kering untuk menerapkan.");

db.close();
