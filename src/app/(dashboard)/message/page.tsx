import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pesan",
  description:
    "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Halaman Pesan di panel.
//
// Sebelumnya halaman ini menampilkan inbox lengkap: delapan kontak dengan foto
// wajah dan jam, satu percakapan terbuka dengan "Andi Wijaya
// <grew-sra@gmail.com>", dan kolom ketik yang benar-benar bisa dipakai —
// menekan kirim menambahkan gelembung pesan baru dengan jam saat itu.
//
// Tapi tidak ada backend di baliknya. Pesan yang "terkirim" hanya hidup di
// memori peramban dan hilang begitu halaman ditutup; tidak ada tabel pesan di
// basis data, dan tidak ada kode yang mengirim ke mana pun. Staf yang menulis
// pesan di situ akan mengira pesannya terkirim.
//
// Sampai ada backend pesan, halaman ini mengatakan apa adanya. Komponennya
// (MessageContactList, MessageChat, MessageItem, MessageOptionsMenu,
// MessageProfile) sudah dihapus karena tidak ada lagi yang memakainya.
export default function MessagePage() {
  return (
    <>
      <p className="h3 mb-40">Pesan</p>

      <div className="innerpage__content">
        <p className="text-secondary">
          Belum ada pesan. Fitur pesan di panel belum tersambung ke mana pun — pesan yang
          ditulis di sini tidak akan tersimpan atau terkirim. Untuk sekarang, hubungi
          showroom lewat WhatsApp di 0822-4109-8298.
        </p>
      </div>
    </>
  );
}
