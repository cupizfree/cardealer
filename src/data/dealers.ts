// Showroom MARF — dipakai halaman dealers-listing dan dealer-details.
// `slug` adalah kebab-case dari `name`.
export type Dealer = {
  id: number;
  slug: string;
  name: string;
  image: string;
  filledStars: number;
  address: string;
  phones: string[];
};

// Satu showroom saja untuk sekarang.
//
// Sebelumnya ada delapan entri di sini — MARF plus tujuh showroom rekanan
// (Berkah Motor, Auto Prima, Sinar Mobil, Metro Motor, Prima Auto, Urban Motor,
// Titan Motor). Ketujuhnya karangan dari templat asal: tidak ada hubungannya
// dengan MARF, dan halaman "Daftar Showroom" menyajikannya sebagai jaringan
// rekanan yang tidak pernah ada.
//
// MARF baru punya satu showroom. Kalau nanti benar-benar ada showroom kedua,
// tambahkan di sini — `seed.ts` membaca larik ini, jadi showroom baru ikut
// tertanam di basis data yang dibuat ulang.
export const allDealers: Dealer[] = [
  {
    id: 1,
    slug: "marf-showroom-pusat",
    name: "MARF Showroom Pusat",
    image: "/assets/images/pages/car-1.png",
    filledStars: 5,
    address: "Jl. A. Jaelani, Karangwangkal, Purwokerto Utara",
    phones: ["0822-4109-8298"],
  },
];

// Kartu showroom yang tampil dengan efek "sudah di-hover" bawaan template.
export const ACTIVE_DEALER_SLUG = "marf-showroom-pusat";
