// Navigasi situs MARF Showroom Mobil Purwokerto.
//
// Menu showroom menjawab dua hal: unit apa yang ada, dan layanan apa yang
// tersedia. Bukan "mau tata letak halaman yang mana" — kolom seperti "Grid 4
// Kolom" / "Daftar + Sidebar" / "Dengan Peta", lima tautan ke satu blog yang
// sama dengan gaya berbeda, dan tautan "Halaman 404" itu sisa templat, bukan
// pilihan yang dicari pembeli.
//
// Kolom "Jenis Mobil" dan "Merek" TIDAK ditulis di sini: keduanya dibaca dari
// stok yang sedang tayang lewat `src/lib/faset.ts`. Yang tetap di sini hanya
// yang memang tetap — rentang harga, layanan, dan halaman informasi.

import { RENTANG_HARGA } from "@/lib/saring";

export type SimpleLink = {
  label: string;
  href: string;
};

export type ListingMenuColumn = {
  title: string;
  links: SimpleLink[];
};

export type PagesMenuColumn = {
  title?: string;
  links: SimpleLink[];
};

const KATALOG = "/listing-grid3-columns";

/**
 * Slug WAJIB sama dengan `RENTANG_HARGA` di `src/lib/saring.ts` — kalau tidak,
 * tautannya membuka katalog tanpa menyaring apa pun. Diturunkan dari sumber yang
 * sama supaya tidak bisa melenceng.
 */
export const kolomHarga: ListingMenuColumn = {
  title: "Rentang Harga",
  links: RENTANG_HARGA.map((r) => ({
    label: r.label,
    href: `${KATALOG}?harga=${r.slug}`,
  })),
};

/** Yang benar-benar dikerjakan showroom. */
export const layananMenuColumns: PagesMenuColumn[] = [
  {
    links: [
      { label: "Simulasi Kredit", href: "/calculator" },
      { label: "Pembiayaan", href: "/financing" },
      { label: "Servis & Perawatan", href: "/services-center" },
      { label: "Jual / Tukar Tambah", href: "/sell-your-car" },
      { label: "Bandingkan Mobil", href: "/compare" },
    ],
  },
];

/**
 * Halaman pendukung.
 *
 * Menggantikan menu "Halaman" templat, yang isinya tautan demo: "Halaman 404",
 * "Segera Hadir", "Dasbor", plus halaman internal toko (Detail Produk,
 * Keranjang, Pembayaran — ketiganya sudah bisa dicapai dari `/shop`).
 *
 * Footer situs ini tidak punya daftar tautan sama sekali, jadi halaman yang
 * tidak ada di sini benar-benar tidak bisa dicapai. Itu sebabnya "Tanya Jawab"
 * dan "Syarat & Ketentuan" tetap dibawa meski jarang diklik.
 */
export const informasiMenuColumns: PagesMenuColumn[] = [
  {
    links: [
      { label: "Ulasan Pelanggan", href: "/clients-reviews" },
      { label: "Daftar Showroom", href: "/dealers-listing" },
      { label: "Tanya Jawab", href: "/faqs" },
      { label: "Toko Aksesori", href: "/shop" },
      { label: "Syarat & Ketentuan", href: "/terms" },
    ],
  },
];

export const listingPromo = {
  image: "/assets/images/card/card-52.jpg",
  title: "Jual Mobil Anda",
  items: [
    "Penilaian harga hari itu juga.",
    "Tukar tambah dengan unit kami.",
    "Dokumen dan pembayaran kami urus.",
  ],
  ctaLabel: "Jual Mobil Sekarang!",
  ctaHref: "/sell-your-car",
};
