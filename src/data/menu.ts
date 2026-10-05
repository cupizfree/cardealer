// Navigasi situs MARF Showroom Mobil Purwokerto.
// Satu arah: showroom mobil. Seluruh label berbahasa Indonesia.
//
// CATATAN JUJUR soal tautan: template ini tidak punya mesin filter, jadi tautan
// kategori/harga/merek memakai parameter kueri (?tipe=, ?harga=, ?merek=) yang
// BELUM diproses halaman listing. Tautannya unik (menghindari peringatan
// duplicate-key React) dan siap disambungkan begitu filter asli dibuat.
// Tautan yang benar-benar berfungsi: rute /listing-* dan /listing-details/*.

export type SimpleLink = {
  label: string;
  href: string;
};

export type HomeMenuItem = SimpleLink & {
  image: string;
};

export type ListingMenuColumn = {
  title: string;
  links: SimpleLink[];
};

export type PagesMenuColumn = {
  title?: string;
  links: SimpleLink[];
};

// Kategori mobil — dipakai sebagai kisi bergambar di menu "Mobil".
export const homeMenuItems: HomeMenuItem[] = [
  { label: "SUV", href: "/listing-grid3-columns?tipe=suv", image: "/assets/images/card/card-1.jpg" },
  { label: "MPV", href: "/listing-grid3-columns?tipe=mpv", image: "/assets/images/card/card-2.jpg" },
  { label: "Sedan", href: "/listing-grid3-columns?tipe=sedan", image: "/assets/images/card/card-3.jpg" },
  { label: "Hatchback", href: "/listing-grid3-columns?tipe=hatchback", image: "/assets/images/card/card-4.jpg" },
  { label: "City Car", href: "/listing-grid3-columns?tipe=city-car", image: "/assets/images/card/card-5.jpg" },
  { label: "Pikap", href: "/listing-grid3-columns?tipe=pickup", image: "/assets/images/card/card-6.jpg" },
  { label: "Double Cabin", href: "/listing-grid3-columns?tipe=double-cabin", image: "/assets/images/card/card-7.jpg" },
  { label: "Minibus", href: "/listing-grid3-columns?tipe=minibus", image: "/assets/images/card/card-8.jpg" },
];

export const listingMenuColumns: ListingMenuColumn[] = [
  {
    title: "Jenis Mobil",
    links: [
      { label: "SUV", href: "/listing-grid3-columns?tipe=suv" },
      { label: "MPV", href: "/listing-grid3-columns?tipe=mpv" },
      { label: "Sedan", href: "/listing-grid3-columns?tipe=sedan" },
      { label: "Hatchback", href: "/listing-grid3-columns?tipe=hatchback" },
      { label: "City Car", href: "/listing-grid3-columns?tipe=city-car" },
      { label: "Pikap", href: "/listing-grid3-columns?tipe=pickup" },
    ],
  },
  {
    title: "Rentang Harga",
    links: [
      { label: "Di bawah Rp 100 juta", href: "/listing-grid3-columns?harga=0-100" },
      { label: "Rp 100 – 150 juta", href: "/listing-grid3-columns?harga=100-150" },
      { label: "Rp 150 – 200 juta", href: "/listing-grid3-columns?harga=150-200" },
      { label: "Rp 200 – 300 juta", href: "/listing-grid3-columns?harga=200-300" },
      { label: "Di atas Rp 300 juta", href: "/listing-grid3-columns?harga=300-plus" },
      { label: "Kredit & cicilan", href: "/calculator" },
    ],
  },
  {
    title: "Merek Populer",
    links: [
      { label: "Toyota", href: "/listing-grid3-columns?merek=toyota" },
      { label: "Honda", href: "/listing-grid3-columns?merek=honda" },
      { label: "Daihatsu", href: "/listing-grid3-columns?merek=daihatsu" },
      { label: "Suzuki", href: "/listing-grid3-columns?merek=suzuki" },
      { label: "Mitsubishi", href: "/listing-grid3-columns?merek=mitsubishi" },
      { label: "Nissan", href: "/listing-grid3-columns?merek=nissan" },
    ],
  },
  {
    title: "Tampilan Daftar",
    links: [
      { label: "Semua Unit", href: "/listing-grid3-columns" },
      { label: "Grid 4 Kolom", href: "/listing-grid4-columns" },
      { label: "Daftar + Sidebar", href: "/listing-liststyle-sidebar" },
      { label: "Dengan Peta", href: "/listing-liststyle-halfmap" },
      { label: "Peta Penuh", href: "/listing-topmap" },
    ],
  },
];

export const listingPromo = {
  image: "/assets/images/card/card-52.jpg",
  title: "Jual Mobil Anda",
  items: [
    "Pasang iklan dalam hitungan menit.",
    "Jangkau ribuan pembeli di Banyumas.",
    "Bantu urus dokumen dan pembayaran.",
  ],
  ctaLabel: "Jual Mobil Sekarang!",
  ctaHref: "/sell-your-car",
};

export const newsMenuLinks: SimpleLink[] = [
  { label: "Semua Artikel", href: "/blog-standard" },
  { label: "Daftar Artikel", href: "/blog-list" },
  { label: "Grid Artikel", href: "/blog-grid-style-1" },
  { label: "Tips & Panduan", href: "/blog-grid-style-2" },
  { label: "Berita Otomotif", href: "/blog-grid-style-3" },
  { label: "Detail Artikel", href: "/blog-details-1/compact-suv-vs-full-size-suv" },
];

export const pagesMenuColumns: PagesMenuColumn[] = [
  {
    title: "Tim Sales",
    links: [
      { label: "Daftar Sales", href: "/sale-agents" },
      { label: "Profil Sales", href: "/sale-agents-details/bagas-prasetyo" },
    ],
  },
  {
    title: "Showroom",
    links: [
      { label: "Daftar Showroom", href: "/dealers-listing" },
      { label: "Detail Showroom", href: "/dealer-details/marf-showroom-pusat" },
    ],
  },
  {
    links: [
      { label: "Simulasi Kredit", href: "/calculator" },
      { label: "Bandingkan Mobil", href: "/compare" },
      { label: "Jual Mobil", href: "/sell-your-car" },
      { label: "Ulasan Pelanggan", href: "/clients-reviews" },
      { label: "Pembiayaan", href: "/financing" },
      { label: "Servis & Perawatan", href: "/services-center" },
    ],
  },
  {
    title: "Toko Aksesori",
    links: [
      { label: "Produk", href: "/shop" },
      { label: "Detail Produk", href: "/product-details/fog-light-lamp-white-yellow-dual-colors" },
      { label: "Keranjang", href: "/shopping-cart" },
      { label: "Checkout", href: "/check-out" },
    ],
  },
  {
    links: [
      { label: "Tanya Jawab", href: "/faqs" },
      { label: "Halaman 404", href: "/404" },
      { label: "Segera Hadir", href: "/coming-soon" },
      { label: "Syarat & Ketentuan", href: "/terms" },
      { label: "Dasbor", href: "/dashboard" },
    ],
  },
];
