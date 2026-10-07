// Backfill sekali jalan: isi kolom `tipe` tabel unit dari nama modelnya.
//
// Kenapa perlu: `src/lib/katalog.ts:142` sudah menurunkan jenis bodi saat kolomnya
// kosong, jadi situs publik tetap bisa menyaring `?tipe=suv` walau kolomnya null.
// Tapi itu justru bikin panel dan publik tidak sepakat — panel membaca kolomnya
// langsung, jadi dropdown "Jenis Mobil" tampil kosong untuk unit yang di halaman
// publik jelas tertulis SUV. Selama kolomnya kosong, `bodi.ts` yang menyebut
// kolom `tipe` sebagai "sumber kebenaran" itu belum benar.
//
// Sifatnya idempoten: nilai yang sudah terisi TIDAK PERNAH ditimpa. Yang ditulis
// cuma baris yang masih null/kosong, dan cuma kalau turunannya ketemu. Unit yang
// modelnya tidak dikenali dibiarkan kosong dan dilaporkan — bukan ditebak.
//
// Jalankan (kering, tanpa menulis):
//   MARF_DB_PATH=./.data/marf-uji.db node --experimental-strip-types scripts/backfill-tipe.ts --kering
// Jalankan (sungguhan):
//   MARF_DB_PATH=./.data/marf-uji.db node --experimental-strip-types scripts/backfill-tipe.ts

import { DatabaseSync } from "node:sqlite";

const { bodiDariTeks, labelBodi } = await import("../src/lib/bodi.ts");

const KERING = process.argv.includes("--kering");
const JALUR = process.env.MARF_DB_PATH ?? "./.data/marf.db";

const db = new DatabaseSync(JALUR);

const kolom = new Set(db.prepare("PRAGMA table_info(unit)").all().map((c) => c.name));
if (!kolom.has("tipe")) {
  console.error(`Tabel unit di ${JALUR} belum punya kolom 'tipe'. Jalankan aplikasinya dulu.`);
  process.exit(1);
}

let sudahTerisi = 0;
let diisi = 0;
let takDikenali = 0;

for (const r of db.prepare("SELECT id, slug, judul, model, tipe FROM unit ORDER BY id").all()) {
  if (r.tipe && String(r.tipe).trim()) {
    sudahTerisi++;
    continue;
  }

  const jenis = bodiDariTeks(r.slug, r.judul, r.model);
  if (!jenis) {
    takDikenali++;
    console.log(`  tak dikenali  id=${String(r.id).padEnd(3)} | ${r.judul}`);
    continue;
  }

  if (!KERING) db.prepare("UPDATE unit SET tipe = ? WHERE id = ?").run(jenis, r.id);
  diisi++;
  console.log(`  ${KERING ? "akan diisi  " : "diisi       "} id=${String(r.id).padEnd(3)} ${jenis.padEnd(12)} (${labelBodi(jenis)}) | ${r.judul}`);
}

console.log();
console.log(`basis data     : ${JALUR}${KERING ? "  [KERING — tidak ada yang ditulis]" : ""}`);
console.log(`sudah terisi   : ${sudahTerisi}`);
console.log(`${KERING ? "akan diisi" : "diisi"}     : ${diisi}`);
console.log(`tak dikenali   : ${takDikenali}`);

const sisa = db.prepare("SELECT COUNT(*) AS n FROM unit WHERE tipe IS NULL OR TRIM(tipe) = ''").get().n;
console.log(`masih kosong   : ${sisa}`);

db.close();
