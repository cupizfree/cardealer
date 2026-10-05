// Data tim sales MARF Showroom Mobil Purwokerto.
// `slug` sintetis (kebab-case dari `name`) — di template asal tidak ada rute per-sales.
export type SaleAgent = {
  id: number;
  slug: string;
  name: string;
  role: string;
  photo: string;
  active?: boolean;
};

export const allSaleAgents: SaleAgent[] = [
  { id: 1, slug: "bagas-prasetyo", name: "Bagas Prasetyo", role: "Sales Senior", photo: "/assets/images/pages/sale-agent-1.jpg" },
  { id: 2, slug: "rina-kusumawati", name: "Rina Kusumawati", role: "Kepala Tim Sales", photo: "/assets/images/pages/sale-agent-2.jpg", active: true },
  { id: 3, slug: "dimas-nugroho", name: "Dimas Nugroho", role: "Manajer Akun", photo: "/assets/images/pages/sale-agent-3.jpg" },
  { id: 4, slug: "ayu-lestari", name: "Ayu Lestari", role: "Manajer Relasi Pelanggan", photo: "/assets/images/pages/sale-agent-4.jpg" },
  { id: 5, slug: "fajar-ramadhan", name: "Fajar Ramadhan", role: "Koordinator Sales", photo: "/assets/images/pages/sale-agent-5.jpg" },
  { id: 6, slug: "dewi-anggraini", name: "Dewi Anggraini", role: "Manajer Penjualan", photo: "/assets/images/pages/sale-agent-6.jpg" },
  { id: 7, slug: "yoga-pratama", name: "Yoga Pratama", role: "Pemimpin Sales", photo: "/assets/images/pages/sale-agent-7.jpg" },
  { id: 8, slug: "nurul-hidayah", name: "Nurul Hidayah", role: "Kepala Tim Sales", photo: "/assets/images/pages/sale-agent-8.jpg" },
  { id: 9, slug: "bagas-prasetyo", name: "Bagas Prasetyo", role: "Sales Senior", photo: "/assets/images/pages/sale-agent-1.jpg" },
  { id: 10, slug: "rina-kusumawati", name: "Rina Kusumawati", role: "Kepala Tim Sales", photo: "/assets/images/pages/sale-agent-2.jpg", active: true },
  { id: 11, slug: "dimas-nugroho", name: "Dimas Nugroho", role: "Manajer Akun", photo: "/assets/images/pages/sale-agent-3.jpg" },
  { id: 12, slug: "ayu-lestari", name: "Ayu Lestari", role: "Manajer Relasi Pelanggan", photo: "/assets/images/pages/sale-agent-4.jpg" },
];
