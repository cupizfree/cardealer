// Tim sales MARF Showroom Mobil Purwokerto.
//
// Isinya satu orang. Sebelumnya dua belas entri — padahal cuma delapan nama
// unik (Bagas Prasetyo dan Rina Kusumawati masing-masing dua kali), dan
// keempat entri terakhir memakai `slug` yang sama dengan empat yang pertama.
// Semuanya karangan dari templat asal: tidak satu pun bekerja di MARF.
//
// `photo` sengaja dibiarkan kosong, bukan diisi foto stok orang lain. Kartu
// tanpa foto menampilkan inisial nama (lihat `common/FotoOrang.tsx`). Begitu
// foto asli Hendrik ada, isi `photo` di sini saja — tidak ada kode lain yang
// perlu diubah.
export type SaleAgent = {
  id: number;
  slug: string;
  name: string;
  role: string;
  photo?: string;
  active?: boolean;
};

export const allSaleAgents: SaleAgent[] = [
  {
    id: 1,
    slug: "hendrik-marfundo",
    name: "Hendrik Marfundo",
    role: "Staff Showroom",
    active: true,
  },
];
