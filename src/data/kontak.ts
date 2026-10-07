// Satu sumber untuk kontak showroom.
//
// Alasannya: sebelum ini alamat dan telepon MARF ditulis ulang secara manual di
// belasan berkas berbeda, dan hampir semuanya masih berisi data templat asal —
// "6205 Peachtree Dunwoody Rd, Atlanta, GA 30328", "15505 Roscoe Blvd, North
// Hills, USA", nomor fiktif Amerika "1-555-678-8888" / "1-333-123-6666", dan
// surel "themesflat@gmail.com" milik pembuat templat.
//
// Akibatnya bukan cuma salah tampil: nomor 555 di Amerika adalah nomor yang
// memang disediakan untuk fiksi, jadi siapa pun yang menekan "Hubungi Kami" di
// halaman Kontak tidak akan menghubungi siapa pun. Lebih buruk lagi, formulir
// pendaftaran dan formulir pertanyaan mengisi kolom email pengunjung dengan
// alamat surel orang lain sebagai nilai awal.
//
// Semua nilai diambil dari `allDealers` — sumber yang sama dengan halaman
// showroom — jadi tidak mungkin lagi berbeda antar halaman.
import { allDealers } from "./dealers";

const showroom = allDealers[0];

/** Hanya angka, untuk tautan `tel:`. */
const angkaTelepon = (nomor: string) => nomor.replace(/\D/g, "");

/** Format internasional untuk tautan WhatsApp (0… -> 62…). */
const angkaWhatsApp = (nomor: string) => angkaTelepon(nomor).replace(/^0/, "62");

export const KONTAK = {
  namaShowroom: showroom.name,
  alamat: showroom.address,
  telepon: showroom.phones[0],
  teleponHref: `tel:${angkaTelepon(showroom.phones[0])}`,
  whatsappHref: `https://wa.me/${angkaWhatsApp(showroom.phones[0])}`,
  slugShowroom: showroom.slug,
} as const;
