// Backfill sekali jalan: isi kolom `galeri` + `spesifikasi` tabel unit dari data
// statis `src/data/listings.ts`, supaya panel dan situs publik memakai data yang
// sama. Tanpa ini, 17 dari 18 unit tampil tanpa gambar dan tanpa spesifikasi.
//
// Jalankan: node --experimental-strip-types scripts/backfill-unit.ts

import { DatabaseSync } from "node:sqlite";

const daftar = (await import("../src/data/listings.ts")).allListings;

// Gambar cadangan untuk unit yang tidak punya padanan di data statis.
const CADANGAN = [
  "/assets/images/card/card-2.jpg",
  "/assets/images/card/card-5.jpg",
  "/assets/images/card/card-7.jpg",
  "/assets/images/card/card-10.jpg",
];

const db = new DatabaseSync("./.data/marf.db");

function angkaDariHarga(teks: string): number {
  const n = Number(String(teks).replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

let diisiGaleri = 0;
let diisiSpek = 0;
let tanpaPadanan = 0;
let cadanganKe = 0;

for (const r of db.prepare("SELECT id, slug, galeri, spesifikasi FROM unit").all()) {
  const s = daftar.find((l) => l.slug === r.slug);

  if (!s) {
    tanpaPadanan++;
    const g = JSON.parse(String(r.galeri || "[]"));
    if (g.length === 0) {
      const gambar = CADANGAN[cadanganKe++ % CADANGAN.length];
      db.prepare("UPDATE unit SET galeri = ? WHERE id = ?").run(JSON.stringify([gambar]), r.id);
      diisiGaleri++;
    }
    continue;
  }

  const galeriLama = JSON.parse(String(r.galeri || "[]"));
  if (galeriLama.length === 0) {
    const gambar = s.gallery?.length ? s.gallery.map((g) => g.src) : [s.image];
    db.prepare("UPDATE unit SET galeri = ? WHERE id = ?").run(JSON.stringify(gambar), r.id);
    diisiGaleri++;
  }

  const spekLama = JSON.parse(String(r.spesifikasi || "{}"));
  if (Object.keys(spekLama).length === 0) {
    const o = s.overview;
    const spek = {
      mileage: o?.mileage ?? s.spec.mileage,
      year: o?.year ?? s.spec.year,
      fuel: o?.fuel ?? s.spec.fuel,
      transmission: o?.transmission ?? s.spec.transmission,
      color: o?.color ?? "",
      location: o?.location ?? "",
      interior: o?.interior ?? "",
      engine: o?.engine ?? "",
      vin: o?.vin ?? "",
      stockNumber: o?.stockNumber ?? "",
    };
    db.prepare("UPDATE unit SET spesifikasi = ? WHERE id = ?").run(JSON.stringify(spek), r.id);
    diisiSpek++;
  }

  if (s.features && Object.keys(s.features).length > 0) {
    const fiturLama = JSON.parse(
      String(db.prepare("SELECT fitur FROM unit WHERE id = ?").get(r.id).fitur || "{}"),
    );
    if (Object.keys(fiturLama).length === 0) {
      db.prepare("UPDATE unit SET fitur = ? WHERE id = ?").run(JSON.stringify(s.features), r.id);
    }
  }

  if (s.description) {
    const d = db.prepare("SELECT deskripsi FROM unit WHERE id = ?").get(r.id).deskripsi;
    if (d === null || d === "") {
      db.prepare("UPDATE unit SET deskripsi = ? WHERE id = ?").run(s.description, r.id);
    }
  }

  // Harga statis dipakai sebagai acuan bila kolom harga kosong atau nol.
  const h = Number(db.prepare("SELECT harga FROM unit WHERE id = ?").get(r.id).harga);
  const target = angkaDariHarga(s.price);
  if ((!h || h === 0) && target > 0) {
    db.prepare("UPDATE unit SET harga = ? WHERE id = ?").run(target, r.id);
  }
}

console.log("galeri diisi   :", diisiGaleri);
console.log("spesifikasi    :", diisiSpek);
console.log("tanpa padanan  :", tanpaPadanan);
console.log();
for (const r of db
  .prepare(
    "SELECT id, judul, galeri, spesifikasi, fitur, deskripsi FROM unit ORDER BY id",
  )
  .all()) {
  const g = JSON.parse(String(r.galeri || "[]")).length;
  const s = Object.keys(JSON.parse(String(r.spesifikasi || "{}"))).filter(
    (k) => JSON.parse(String(r.spesifikasi))[k] !== "",
  ).length;
  const f = Object.keys(JSON.parse(String(r.fitur || "{}"))).length;
  const d = r.deskripsi ? "ada" : "-";
  console.log(
    `  id=${String(r.id).padEnd(3)} img=${String(g).padEnd(2)} spek=${String(s).padEnd(2)} fitur=${String(f).padEnd(2)} deskripsi=${d.padEnd(4)} | ${r.judul}`,
  );
}

db.close();
