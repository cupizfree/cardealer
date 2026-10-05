// Daftar showroom rekanan MARF — dipakai halaman dealers-listing.
// `slug` adalah kebab-case sintetis dari `name`: di template asal semua tombol
// "Detail Showroom" menunjuk satu berkas yang sama, jadi slug dibuat sendiri di sini.
export type Dealer = {
  id: number;
  slug: string;
  name: string;
  image: string;
  filledStars: number;
  address: string;
  phones: string[];
};

export const allDealers: Dealer[] = [
  { id: 1, slug: "marf-showroom-pusat", name: "MARF Showroom Pusat", image: "/assets/images/pages/car-1.png", filledStars: 5, address: "Jl. A. Jaelani, Karangwangkal, Purwokerto Utara", phones: ["0822-4109-8298"] },
  { id: 2, slug: "berkah-motor-purwokerto", name: "Berkah Motor Purwokerto", image: "/assets/images/pages/car-2.png", filledStars: 4, address: "Jl. Jend. Sudirman No. 204, Purwokerto", phones: ["0281-635555"] },
  { id: 3, slug: "auto-prima-banyumas", name: "Auto Prima Banyumas", image: "/assets/images/pages/car-3.png", filledStars: 4, address: "Jl. Raya Baturraden KM 7, Purwokerto", phones: ["0281-633333"] },
  { id: 4, slug: "sinar-mobil-sokaraja", name: "Sinar Mobil Sokaraja", image: "/assets/images/pages/car-4.png", filledStars: 4, address: "Jl. Raya Sokaraja No. 12, Banyumas", phones: ["0281-632222"] },
  { id: 5, slug: "metro-motor-purwokerto", name: "Metro Motor Purwokerto", image: "/assets/images/pages/car-5.png", filledStars: 4, address: "Jl. Gerilya No. 88, Purwokerto Selatan", phones: ["0281-631111"] },
  { id: 6, slug: "prima-auto-cilacap", name: "Prima Auto Cilacap", image: "/assets/images/pages/car-6.png", filledStars: 4, address: "Jl. Raya Adipala KM 5, Cilacap", phones: ["0282-532222"] },
  { id: 7, slug: "urban-motor-purbalingga", name: "Urban Motor Purbalingga", image: "/assets/images/pages/car-7.png", filledStars: 4, address: "Jl. Mayjen Sungkono No. 45, Purbalingga", phones: ["0281-894444"] },
  { id: 8, slug: "titan-motor-kebumen", name: "Titan Motor Kebumen", image: "/assets/images/pages/car-8.png", filledStars: 4, address: "Jl. Pahlawan No. 76, Kebumen", phones: ["0287-381222"] },
];

// Kartu showroom yang tampil dengan efek "sudah di-hover" bawaan template.
export const ACTIVE_DEALER_SLUG = "auto-prima-banyumas";
