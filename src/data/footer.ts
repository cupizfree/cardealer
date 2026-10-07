// Konten footer MARF Showroom Mobil Purwokerto — seluruhnya bahasa Indonesia.
// Strukturnya sama seperti template asal; hanya isi dan kontaknya yang diganti.

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export const footerOpeningHours = {
  line1: "Senin–Sabtu, 08.00 – 17.00 WIB",
  line2: "Minggu & hari libur: dengan perjanjian",
};

export const footerColumns: FooterColumn[] = [
  {
    title: "TAUTAN CEPAT",
    links: [
      { label: "Tentang Kami", href: "/about-us" },
      { label: "Beli Mobil", href: "/listing-grid3-columns" },
      { label: "Jual Mobil", href: "/sell-your-car" },
      { label: "Simulasi Kredit", href: "/calculator" },
      { label: "Ulasan Pelanggan", href: "/clients-reviews" },
      { label: "Artikel", href: "/blog-standard" },
      { label: "Hubungi Kami", href: "/contact-us" },
    ],
  },
  {
    title: "JUAL & BELI",
    links: [
      { label: "Pembiayaan", href: "/financing" },
      { label: "Cari Mobil", href: "/listing-grid3-columns" },
      { label: "Cari Showroom", href: "/dealers-listing" },
      { label: "Daftar Unit + Peta", href: "/listing-liststyle-halfmap" },
      { label: "Unit Garansi", href: "/listing-grid4-columns" },
      { label: "Kalkulator Cicilan", href: "/calculator" },
    ],
  },
];

export const footerContact = {
  phone: "0822-4109-8298",
  phoneHref: "tel:+6282241098298",
  whatsapp: "https://wa.me/6282241098298",
  address: "Purwokerto, Kabupaten Banyumas, Jawa Tengah",
  mapHref: "https://www.google.com/maps/search/?api=1&query=Showroom+Mobil+Purwokerto",
};

export type SocialLink = { name: string; href: string };

// Ganti ke akun resmi MARF begitu tersedia — sementara mengarah ke WhatsApp showroom
// supaya tidak ada tautan mati ke akun orang lain.
export const footerSocialLinks: SocialLink[] = [
  { name: "facebook", href: "https://wa.me/6282241098298" },
  { name: "instagram", href: "https://wa.me/6282241098298" },
  { name: "tiktok", href: "https://wa.me/6282241098298" },
  { name: "x", href: "https://wa.me/6282241098298" },
];

export const footerBottomLinks: FooterLink[] = [
  { label: "Syarat & Ketentuan", href: "/terms" },
  { label: "Kebijakan Privasi", href: "/terms" },
  { label: "Kebijakan Cookie", href: "/terms" },
];
