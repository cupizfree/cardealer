// Jembatan antara tabel `unit` (ditulis panel) dan bentuk data yang sudah dipakai
// seluruh halaman publik (`Listing` di `src/data/listings.ts`).
//
// Sebelum ini, situs publik membaca `allListings` yang STATIS, sementara panel
// menulis ke SQLite. Dua dunia yang tidak pernah bertemu: unit yang ditambah di
// panel tidak akan muncul di katalog. Modul ini yang menyambungkannya.
//
// ATURAN: modul ini HANYA boleh diimpor dari komponen server / route server.
// Ia menyentuh `node:sqlite` lewat `./db`, jadi mengimpornya dari komponen
// "use client" akan menggagalkan build. Komponen klien menerima datanya lewat
// prop atau `KatalogProvider`.

import { semua } from "./db";
import { dariBaris, type Unit } from "./repo/unit";
import { ambilDealer } from "./repo/dealer";
import { alamatGambar } from "./galeri";
import { hitungKredit, rupiah } from "./kredit";
import { bodiDariTeks } from "./bodi";
import {
  allListings,
  type DealerInfo,
  type Listing,
  type ListingFeatures,
  type ListingGalleryImage,
  type ListingOverview,
  type ListingSpec,
} from "@/data/listings";

/** Status yang boleh tampil di situs publik. `draf` = belum dipublikasikan. */
const STATUS_TERBIT = ["tersedia", "dipesan"] as const;

const GAMBAR_CADANGAN = "/assets/images/card/card-1.jpg";

const KATEGORI_FITUR = [
  "Exterior",
  "Interior",
  "Safety",
  "Mechanical",
  "Technology",
  "Other",
] as const;

/** Simulasi awal saat unit belum punya angka cicilan sendiri. */
const SIMULASI = { uangMukaPersen: 20, tenorBulan: 36, bungaPerTahun: 8, pajakPersen: 0 };

function teks(v: unknown): string | null {
  return typeof v === "string" && v.trim() !== "" ? v : null;
}

function dariSpesifikasi(u: Unit, kunci: string): string | null {
  const s = u.spesifikasi as Record<string, unknown> | null;
  if (!s || typeof s !== "object") return null;
  return teks(s[kunci]);
}

function specDari(u: Unit): ListingSpec {
  return {
    mileage: teks(u.kilometer) ?? dariSpesifikasi(u, "mileage") ?? "-",
    year: u.tahun !== null ? String(u.tahun) : dariSpesifikasi(u, "year") ?? "-",
    fuel: teks(u.bahan_bakar) ?? dariSpesifikasi(u, "fuel") ?? "-",
    transmission: teks(u.transmisi) ?? dariSpesifikasi(u, "transmission") ?? "-",
  };
}

function overviewDari(u: Unit, spec: ListingSpec): ListingOverview {
  return {
    ...spec,
    color: teks(u.warna) ?? dariSpesifikasi(u, "color") ?? "-",
    location: teks(u.lokasi) ?? dariSpesifikasi(u, "location") ?? "-",
    interior: dariSpesifikasi(u, "interior") ?? "-",
    engine: dariSpesifikasi(u, "engine") ?? "-",
    vin: dariSpesifikasi(u, "vin") ?? "-",
    stockNumber: dariSpesifikasi(u, "stockNumber") ?? "-",
  };
}

/**
 * `fitur` disimpan sebagai JSON berkategori. Kategori di luar daftar resmi tetap
 * dibawa apa adanya — lebih baik tampil daripada hilang diam-diam.
 */
function fiturDari(u: Unit): ListingFeatures | undefined {
  const isi = u.fitur as Record<string, unknown> | null;
  if (!isi || typeof isi !== "object" || Object.keys(isi).length === 0) return undefined;

  const hasil = {} as ListingFeatures;
  for (const k of KATEGORI_FITUR) {
    const v = isi[k];
    hasil[k] = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  }
  for (const [k, v] of Object.entries(isi)) {
    if (k in hasil) continue;
    if (Array.isArray(v)) {
      (hasil as Record<string, string[]>)[k] = v.filter((x): x is string => typeof x === "string");
    }
  }
  return hasil;
}

function dealerDari(u: Unit): DealerInfo | undefined {
  if (u.dealer_id === null) return undefined;
  const d = ambilDealer(u.dealer_id);
  if (!d) return undefined;
  return {
    name: d.nama,
    verified: d.aktif,
    address: d.alamat ?? d.kota ?? "",
    phones: d.telepon ? [d.telepon] : [],
  };
}

function cicilanDari(u: Unit): string {
  if (teks(u.harga_cicilan)) return u.harga_cicilan as string;

  const hasil = hitungKredit({
    harga: u.harga,
    uangMuka: Math.round((u.harga * SIMULASI.uangMukaPersen) / 100),
    tenorBulan: SIMULASI.tenorBulan,
    bungaPerTahun: SIMULASI.bungaPerTahun,
    pajakPersen: SIMULASI.pajakPersen,
    tukarTambah: 0,
  });
  return `${rupiah(hasil.cicilanBulanan)}/bulan`;
}

/** Ubah satu baris tabel `unit` menjadi `Listing` yang dimengerti situs publik. */
export function unitKeListing(u: Unit): Listing {
  const gambar = alamatGambar(u.galeri);
  const utama = gambar[0] ?? GAMBAR_CADANGAN;
  const spec = specDari(u);

  const galeri: ListingGalleryImage[] = (gambar.length ? gambar : [utama]).map((src) => ({
    src,
    alt: u.judul,
  }));

  return {
    id: u.id,
    slug: u.slug,
    title: u.judul,
    image: utama,
    brandLabel: u.merek,
    bodyStyle: teks(u.tipe) ?? bodiDariTeks(u.slug, u.judul, u.model) ?? undefined,
    badge: u.unggulan ? { text: "Istimewa", colorClass: "bg-primary-2" } : undefined,
    photoCount: galeri.length,
    videoCount: 0,
    price: rupiah(u.harga),
    financing: { monthlyPrice: cicilanDari(u), detailsLabel: "Lihat Simulasi" },
    spec,
    overview: overviewDari(u, spec),
    gallery: galeri,
    description: teks(u.deskripsi) ?? undefined,
    features: fiturDari(u),
    location: teks(u.lokasi) ? { address: u.lokasi as string, mapEmbedUrl: "" } : undefined,
    dealer: dealerDari(u),
  };
}

function barisTerbit(): Unit[] {
  const tanda = STATUS_TERBIT.map(() => "?").join(", ");
  return semua(
    `SELECT * FROM unit WHERE status IN (${tanda}) ORDER BY unggulan DESC, dibuat_pada DESC, id DESC`,
    ...STATUS_TERBIT,
  ).map(dariBaris);
}

/**
 * Seluruh unit yang boleh tampil di situs publik.
 *
 * Basis data kosong -> jatuh ke data statis `allListings`. Tanpa ini, situs akan
 * tampil kosong melompong saat basis data belum diisi — kerusakan yang jauh lebih
 * buruk daripada menampilkan data contoh.
 */
export function muatKatalog(): Listing[] {
  const baris = barisTerbit();
  if (baris.length === 0) {
    // Cadangan statis belum punya kolom `tipe`; turunkan dari judulnya supaya
    // penyaring jenis bodi tetap berfungsi di basis data kosong.
    return allListings.map((l) => ({
      ...l,
      bodyStyle: l.bodyStyle ?? bodiDariTeks(l.slug, l.title) ?? undefined,
    }));
  }
  return baris.map(unitKeListing);
}

/** Unit unggulan lebih dulu, lalu sisanya. */
export function muatUnggulan(jumlah = 8): Listing[] {
  return muatKatalog().slice(0, jumlah);
}

/** Satu unit berdasarkan slug. `null` bila tidak ada. */
export function muatListing(slug: string): Listing | null {
  const katalog = muatKatalog();
  return katalog.find((l) => l.slug === slug) ?? null;
}

/**
 * Unit serupa untuk bagian "Unit Terkait".
 *
 * Sinyal "mirip" yang jujur cuma merek yang sama; kalau tidak cukup, ambil unit
 * lain terdekat. Tidak ada bidang kategori yang bisa diandalkan, jadi tidak
 * dipalsukan.
 */
export function muatSerupa(listing: Listing, jumlah = 4): Listing[] {
  const katalog = muatKatalog().filter((l) => l.id !== listing.id);
  const semerek = katalog.filter((l) => l.brandLabel === listing.brandLabel);
  const lain = katalog.filter((l) => l.brandLabel !== listing.brandLabel);
  return [...semerek, ...lain].slice(0, jumlah);
}

/** Daftar merek untuk isian filter. */
export function muatMerek(): string[] {
  return [...new Set(muatKatalog().map((l) => l.brandLabel))].sort();
}
