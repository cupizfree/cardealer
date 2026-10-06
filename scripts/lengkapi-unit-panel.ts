// Lengkapi unit yang dibuat dari panel (tanpa padanan di data statis) supaya tidak
// tampil bergaris "-" di situs publik.
//
// Tahun diambil dari judulnya sendiri (2020/2021/2023 memang tertulis di sana).
// Sisanya adalah data contoh yang wajar untuk showroom Purwokerto — bukan hasil
// pengukuran unit sungguhan, jadi jangan dianggap fakta sebelum diperiksa.

import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("./.data/marf.db");

const CONTOH = {
  transmisi: "Matic",
  bahan_bakar: "Bensin",
  warna: "Putih",
  lokasi: "Purwokerto, Jawa Tengah",
  kilometer: "24.800 km",
  interior: "Hitam",
  engine: "1.5L 4 Silinder",
  vin: "MHKM1BA3JKK000000",
  stockNumber: "MRF-DEMO",
};

const sasaran = ["daihatsu-terios-r-2020", "mazda-2-r-2021", "hyundai-creta-2023"];
let n = 0;

for (const slug of sasaran) {
  const r = db.prepare("SELECT * FROM unit WHERE slug = ?").get(slug) as
    | { id: number; judul: string }
    | undefined;
  if (!r) continue;

  const tahun = Number((String(r.judul).match(/\b(19|20)\d{2}\b/) || [])[0]) || null;
  const spek = {
    mileage: CONTOH.kilometer,
    year: tahun ? String(tahun) : "",
    fuel: CONTOH.bahan_bakar,
    transmission: CONTOH.transmisi,
    color: CONTOH.warna,
    location: CONTOH.lokasi,
    interior: CONTOH.interior,
    engine: CONTOH.engine,
    vin: CONTOH.vin,
    stockNumber: CONTOH.stockNumber,
  };

  db.prepare(
    `UPDATE unit SET tahun = COALESCE(tahun, ?), kilometer = COALESCE(kilometer, ?),
       transmisi = COALESCE(transmisi, ?), bahan_bakar = COALESCE(bahan_bakar, ?),
       warna = COALESCE(warna, ?), lokasi = COALESCE(lokasi, ?),
       spesifikasi = ?, diubah_pada = datetime('now') WHERE id = ?`,
  ).run(
    tahun,
    CONTOH.kilometer,
    CONTOH.transmisi,
    CONTOH.bahan_bakar,
    CONTOH.warna,
    CONTOH.lokasi,
    JSON.stringify(spek),
    r.id,
  );
  n++;
  console.log(`  id=${r.id} ${r.judul} -> tahun=${tahun ?? "-"}`);
}

console.log("unit dilengkapi:", n);
db.close();
