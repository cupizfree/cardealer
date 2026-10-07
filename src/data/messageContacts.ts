// Daftar kontak di halaman Pesan (/message).
//
// Dulu berisi delapan orang dengan foto wajah, jam, dan pratinjau percakapan —
// "Bagas Prasetyo", "Rina Kusumawati", "Andi Wijaya", "Dewi Anggraini", "Fajar
// Ramadhan", "Maya Sari" (dua di antaranya muncul dua kali dengan foto
// berbeda). Semuanya karangan dari templat asal; dua di antaranya juga nama yang
// dulu dipajang sebagai tim sales MARF dan sebagai "pengulas" di setiap halaman
// unit.
//
// Tidak ada satu pun yang pernah bisa dibalas: panel ini memang tidak punya
// fungsi kirim pesan sama sekali — atribut `data-contact` di templat asal tidak
// pernah dibaca oleh skrip mana pun, dan percakapan yang tampil selalu milik
// "John Smith" (kontak yang ditandai aktif), apa pun yang diklik.
//
// Dikosongkan. Menampilkan delapan percakapan yang tidak bisa dibalas lebih
// buruk daripada menampilkan daftar kosong: pengunjung mengira showroom
// mengabaikan pesannya.
export type MessageContact = {
  id: string;
  name: string;
  avatarSrc: string;
  avatarAlt: string;
  preview: string;
  time: string;
  badge?: string;
  status?: "online" | "offline";
  active?: boolean;
};

export const messageContacts: MessageContact[] = [];
