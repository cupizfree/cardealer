# MARF Showroom Mobil

**Showroom mobil terpercaya di Purwokerto.** Katalog unit lengkap, simulasi kredit transparan, dan proses jual-beli yang jelas dari awal sampai STNK — lengkap dengan panel internal untuk admin dan staff showroom.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Sass](https://img.shields.io/badge/Sass-1.89-CC6699?logo=sass&logoColor=white)](https://sass-lang.com)

---

## Kenapa MARF

Beli mobil bekas itu rawan. Harga bisa naik-turun tanpa alasan, kondisi unit sering beda dari foto, dan angka cicilan baru ketahuan saat sudah duduk di depan meja.

MARF dibangun untuk menghapus keraguan itu:

- **Harga terbuka.** Setiap unit tampil dengan harga, tahun, kilometer, dan transmisinya. Tidak ada angka yang disembunyikan sampai Anda datang.
- **Simulasi kredit mandiri.** Hitung cicilan sendiri kapan saja, tanpa harus menghubungi sales dulu.
- **Kondisi unit terperinci.** Kelengkapan, spesifikasi, dan fitur tercatat per unit — bukan sekadar foto dan harga.
- **Satu pintu untuk jual dan beli.** Mau tukar tambah atau jual unit lama? Alurnya ada di tempat yang sama.

---

## Fitur

### Untuk pembeli

- **Katalog unit** — 15 unit siap jual, dengan pencarian, filter, dan beberapa pilihan tampilan (kisi maupun daftar dengan peta).
- **Halaman detail unit** — galeri foto, spesifikasi lengkap, fitur per kategori, dan ringkasan kondisi.
- **Simulasi kredit** — kalkulator cicilan dengan uang muka, tenor, dan estimasi bunga.
- **Bandingkan unit** — sandingkan beberapa unit berdampingan sebelum memutuskan.
- **Pembiayaan** — informasi skema kredit dan syarat pengajuan.

### Untuk penjual

- **Jual mobil** — formulir pengajuan dengan penilaian awal.
- **Tukar tambah** — alur penawaran unit lama sebagai bagian dari pembayaran.

### Umum

- **Artikel & blog** — panduan perawatan, tips membeli, dan berita otomotif.
- **Ulasan pelanggan** — pengalaman pembeli sebelumnya.
- **Pusat layanan** — servis, perawatan, dan bengkel rekanan.
- **Showroom & dealer** — daftar lokasi dengan peta.
- **FAQ & kontak** — pertanyaan umum dan kanal komunikasi langsung.
- **Sepenuhnya berbahasa Indonesia** — termasuk format harga, tanggal, dan istilah otomotifnya.

---

## Panel Admin & Staff

Selain situs publik, ada panel internal untuk mengelola showroom. Dua peran, satu basis data.

**Masuk di `/masuk`.** Setelah masuk, admin diarahkan ke `/admin`, staff ke `/staff`.

### Admin

| Halaman | Isi |
|---|---|
| `/admin` | Ringkasan: unit tersedia, nilai persediaan, prospek, aktivitas terakhir |
| `/admin/unit` | Daftar unit — cari, filter merek/status, ubah status langsung dari tabel |
| `/admin/unit/baru` | Formulir tambah unit |
| `/admin/unit/[id]` | Ubah rincian unit, atau hapus |
| `/admin/dealer` | Kelola dealer rekanan |
| `/admin/prospek` | Kiriman dari form situs — ubah status, tulis catatan internal |
| `/admin/pengguna` | Kelola akun admin & staff |
| `/admin/log` | Jejak aktivitas |

### Staff

| Halaman | Isi |
|---|---|
| `/staff` | Ringkasan prospek dan unit |
| `/staff/prospek` | Antrean prospek — tindak lanjuti kiriman pelanggan |
| `/staff/unit` | Perbarui status ketersediaan unit |

Staff **tidak** bisa mengelola pengguna. Admin tidak bisa menghapus akunnya sendiri, dan admin aktif terakhir tidak bisa dihapus atau diturunkan — supaya sistem tidak pernah terkunci.

### Akun awal

Akun dibuat otomatis saat basis data masih kosong. Surelnya bawaan, **kata sandinya tidak** — sandi dibaca dari lingkungan, tidak pernah ditulis di repositori ini.

| Peran | Surel bawaan | Variabel sandi |
|---|---|---|
| Admin | `admin@marf.id` | `SEED_ADMIN_SANDI` |
| Staff | `staff@marf.id` | `SEED_STAFF_SANDI` |

Setel keduanya di `.env` sebelum menjalankan pertama kali (lihat `.env.example`):

```bash
SEED_ADMIN_SANDI="kata-sandi-panjang-yang-anda-pilih"
SEED_STAFF_SANDI="kata-sandi-lain-yang-berbeda"
```

Kalau variabelnya kosong, server membuat sandi acak dan **mencetaknya sekali ke konsol**. Catat dari log saat itu — nilainya tidak ditampilkan lagi. Cara ini disengaja: berkas di repositori publik bukan tempat menyimpan rahasia, dan sandi yang pernah ter-commit tetap bisa dibaca dari riwayat git meski barisnya dihapus kemudian.

> **Jangan pernah menulis kata sandi ke berkas apa pun di repositori ini** — termasuk README, `docs/`, dan skrip uji. Skrip uji membacanya dari `.env` atau dari variabel lingkungan.

### Pembatasan percobaan masuk

`/api/auth/login` menolak setelah **5 percobaan gagal** dari kombinasi surel + alamat IP yang sama, selama 15 menit (`429` `TERLALU_BANYAK_PERCOBAAN`). Percobaan yang berhasil menghapus catatannya.

Catatan ini hidup di memori proses, jadi hilang saat server dimulai ulang dan tidak berlaku lintas proses. Untuk satu proses Next.js ini memadai; kalau nanti dijalankan di beberapa proses, pindahkan ke basis data atau Redis — lihat `src/lib/pembatasan.ts`.

---

## Backend & REST API

Situs publik tetap dirender statis seperti semula. Yang baru: lapisan API dan basis data untuk panel internal.

### Pilihan teknologi

- **Basis data: SQLite lewat `node:sqlite`** — modul bawaan Node 22.5+. Nol dependensi npm, nol layanan luar. Berkasnya di `./.data/marf.db`, dibuat otomatis saat pertama dijalankan.
- **Sesi: server-side, bukan JWT** — token acak 32 bita disimpan di tabel `sesi`, dikirim lewat cookie `httpOnly`. Logout langsung mencabut sesi di server; JWT tidak bisa begitu.
- **Kata sandi: `scrypt`** — fungsi turunan kunci bawaan Node, dengan garam per akun dan perbandingan waktu-tetap.

### Titik akhir

Semua balasan berbentuk `{ ok, data }` atau `{ ok: false, error: { kode, pesan } }`.

| Metode | Rute | Akses | Kegunaan |
|---|---|---|---|
| `POST` | `/api/auth/login` | publik | Masuk, dapat cookie sesi |
| `POST` | `/api/auth/logout` | masuk | Cabut sesi |
| `GET` | `/api/auth/me` | publik | Siapa yang sedang masuk |
| `GET` | `/api/unit` | publik¹ | Daftar unit — cari, filter, urut, halaman |
| `POST` | `/api/unit` | masuk | Tambah unit |
| `GET` | `/api/unit/:id` | publik¹ | Satu unit |
| `PATCH` | `/api/unit/:id` | masuk | Ubah unit |
| `DELETE` | `/api/unit/:id` | masuk | Hapus unit |
| `GET` | `/api/dealer` | publik¹ | Daftar dealer |
| `POST` | `/api/dealer` | masuk | Tambah dealer |
| `GET` `PATCH` `DELETE` | `/api/dealer/:id` | masuk² | Satu dealer |
| `GET` | `/api/prospek` | masuk | Daftar prospek |
| `POST` | `/api/prospek` | **publik** | Kiriman form situs |
| `GET` `PATCH` `DELETE` | `/api/prospek/:id` | masuk | Satu prospek |
| `GET` `POST` | `/api/pengguna` | **admin** | Daftar & tambah akun |
| `PATCH` `DELETE` | `/api/pengguna/:id` | **admin** | Ubah & hapus akun |
| `GET` | `/api/statistik` | masuk | Ringkasan dasbor |
| `POST` | `/api/seed` | publik | Isi data awal (idempoten) |

¹ Pengunjung anonim hanya melihat unit berstatus `tersedia`; yang sudah terjual atau masih draf tersembunyi.
² `DELETE` ditolak dengan `409` kalau dealer masih menaungi unit.

### Kode galat

| Kode HTTP | Arti |
|---|---|
| `401` | Belum masuk |
| `403` | Peran kurang (staff mencoba akses khusus admin) |
| `404` | Tidak ditemukan — atau tidak berhak melihat |
| `409` | Bentrok: slug/surel sudah dipakai, atau aturan penjagaan |
| `422` | Validasi gagal |
| `429` | Terlalu banyak percobaan masuk — tunggu 15 menit |

### Form situs kini benar-benar mengirim

Form kontak di `/contact-us` sebelumnya hanya tampilan. Sekarang mengirim ke `POST /api/prospek`, dan kirimannya muncul di `/admin/prospek` serta `/staff/prospek` dengan status `baru`.

### Struktur basis data

```
pengguna        admin & staff (scrypt, peran, status aktif)
sesi            token sesi aktif + kedaluwarsa
dealer          showroom rekanan
unit            persediaan kendaraan (galeri/fitur/spesifikasi sebagai JSON)
prospek         kiriman dari form situs
log_aktivitas   jejak audit setiap perubahan
```

Semua galat basis data ditangani sebagai nilai, bukan pengecualian yang lolos ke pengguna.

### Catatan penyebaran

Berkas `./.data/marf.db` **tidak** ikut ke git (lihat `.gitignore`) karena berisi hash kata sandi dan token sesi. Untuk penyebaran yang butuh lebih dari satu proses, ganti lapisan repo di `src/lib/repo/` ke Postgres atau Supabase — route dan halaman tidak perlu diubah karena SQL-nya terkumpul di situ.

---

## Tumpukan Teknologi

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Kerangka | **Next.js 15.5** (App Router) | Render statis untuk halaman katalog — cepat dan murah di-hosting |
| UI | **React 19** | Komponen server untuk halaman berat data, komponen klien hanya untuk yang interaktif |
| Bahasa | **TypeScript** | Bentuk data unit dan dealer dipastikan saat kompilasi, bukan saat runtime |
| Gaya | **Sass** + variabel terpusat | Palet ada di satu berkas, bukan tersebar di ratusan komponen |
| Gaya panel | **Tailwind 4.3** (lewat CLI) | Panel admin/staff ditulis dengan utilitas; situs publik tetap Sass murni |
| Slider | **Swiper 14** | Galeri unit dan carousel beranda |
| Animasi | **WOW.js** | Animasi saat gulir, dipakai hemat agar tidak mengganggu |
| Basis data | **SQLite** (`node:sqlite`) | Bawaan Node — nol dependensi, nol layanan luar untuk panel internal |
| Autentikasi | **scrypt + sesi server** | Tanpa JWT; logout benar-benar mencabut sesi |

**193 halaman statis** dibangun dari **59 rute** publik, **204 komponen**, **13 titik akhir API**, dan **11 halaman panel**.

---

## Menjalankan Secara Lokal

```bash
npm install       # pasang dependensi
npm run dev       # mode pengembangan
npm run build     # build produksi (sekaligus membangun CSS panel)
npm run start     # jalankan hasil build
npm run lint      # periksa gaya kode
npm run css:panel # bangun ulang CSS panel saja
```

Buka [http://localhost:3000](http://localhost:3000).

### Catatan gaya panel

Panel admin & staff memakai **Tailwind 4**, tetapi **tidak** lewat `postcss.config`.
Tailwind di-build terpisah menjadi `src/styles/panel.css` dengan
`@tailwindcss/cli` (`npm run css:panel`), dan berkas itu diimpor langsung oleh
layout panel.

Alasannya: menambahkan `postcss.config` akan **menimpa bawaan Next.js**
(autoprefixer, dll.) dan ikut memproses 32 berkas SCSS situs (19.948 baris) —
berisiko merusak tampilan situs publik. Dengan jalur CLI, Tailwind hanya
menyentuh panel, dan halaman situs tidak memuat CSS panel sama sekali.

Dua hal penting kalau mengubah `src/styles/panel.src.css`:

1. **Jangan bungkus utilitas dengan `@layer`.** Situs punya reset universal
   tanpa layer (`* { margin: 0; padding: 0; color: #1c1c1c }`). Dalam kaskade
   CSS, deklarasi tanpa layer selalu menang atas yang berlayer — utilitas jadi
   kalah dan kartu kehilangan padding, jarak menyusut, warna teks tertimpa.
2. **Jangan tambahkan `postcss.config`.** Cukup `npm run css:panel`.

### Catatan build

Build produksi membutuhkan memori sekitar **800 MB**. Di mesin dengan RAM terbatas, batasi heap V8 agar proses tidak dimatikan kernel:

```bash
NODE_OPTIONS="--max-old-space-size=768" npm run build
```

---

## Struktur Proyek

```
src/
├── app/               # Rute App Router
│   ├── (blog)/        #   Artikel & blog
│   ├── (dashboard)/   #   Panel pemilik unit
│   ├── (listings)/    #   Katalog & detail unit
│   ├── (other-pages)/ #   FAQ, kontak, syarat
│   ├── (panel)/       #   Panel internal — admin/ & staff/
│   ├── api/           #   13 titik akhir REST
│   ├── masuk/         #   Halaman login
│   └── home-02 … home-10   # Varian beranda
├── components/        # 204 komponen, dikelompokkan per halaman
│   └── panel/         #   Komponen panel (dasbor, tabel, formulir)
├── data/              # Data contoh untuk seed basis data
├── lib/               # Inti backend
│   ├── db.ts          #   Koneksi SQLite + transaksi
│   ├── skema.ts       #   Definisi tabel
│   ├── auth.ts        #   Sesi & penjagaan peran
│   ├── sandi.ts       #   Hash scrypt
│   ├── api.ts         #   Bentuk balasan & validasi
│   ├── masukan.ts     #   Penerjemah badan permintaan
│   ├── seed.ts        #   Isi data awal
│   └── repo/          #   Semua SQL terkumpul di sini
└── types/             # Tipe bersama

.data/                 # Basis data SQLite (tidak masuk git)
public/assets/
├── images/            # Foto unit, logo, favicon
└── scss/              # Lembar gaya: variabel, komponen, halaman
```

**Data katalog.** Situs publik masih membaca `src/data/` saat build — halaman tetap statis dan cepat. Panel internal membaca basis data lewat `src/lib/repo/`. Saat basis data masih kosong, `src/lib/seed.ts` mengisinya dari `src/data/` supaya keduanya mulai dari titik yang sama.

| Berkas | Isi |
|---|---|
| `src/data/listings.ts` | 15 unit mobil |
| `src/data/dealers.ts` | 8 dealer |
| `src/data/saleAgents.ts` | 12 agen penjualan |
| `src/data/products.ts` | 10 produk & layanan |
| `src/data/menu.ts` | Menu navigasi |
| `src/data/footer.ts` | Konten footer |

---

## Identitas Merek

| | |
|---|---|
| Merah utama | `#C8171F` |
| Mode gelap | `#1C1C1C` |
| Header | `#FFFFFF` |
| Logo | Crest MARF, rasio 66×54 |

Palet lengkap ada di `public/assets/scss/abstracts/variables.scss`.

---

## Kontak

**MARF Showroom Mobil**
Purwokerto, Kabupaten Banyumas, Jawa Tengah

- WhatsApp: [0822-4109-8298](https://wa.me/6282241098298)
- Jam buka: Senin–Sabtu, 08.00–17.00 WIB
- Minggu & hari libur: dengan perjanjian

---

## Kredit

Antarmuka dibangun di atas templat **Aurexo** oleh [Themesflat](https://github.com/themesflatdev/aurexo-nextjs), lalu diubah menyeluruh: palet warna diganti ke identitas MARF, seluruh teks diterjemahkan ke bahasa Indonesia, logo dan favicon diganti, serta data contoh ditukar dengan unit dan dealer sungguhan.

Struktur, rute, dan komponen mengikuti templat asalnya; isi dan tampilannya milik MARF.

---

## Lisensi

Kode proyek ini (backend SQLite, autentikasi, API, panel admin/staff, skema basis data, skrip, serta seluruh isi dan terjemahan bahasa Indonesia) dirilis dengan **lisensi MIT** — lihat [`LICENSE`](LICENSE).

Antarmuka situs publik dibangun di atas templat komersial **Aurexo** milik Themesflat. Repositori templat itu tidak menyertakan berkas lisensi apa pun, sehingga hak ciptanya tetap pada pemiliknya. Bagian antarmuka yang berasal dari templat tersebut **tidak** dicakup hibah MIT di atas dan tetap tunduk pada ketentuan lisensi templat dari pembuatnya.

---

## Pengembangan

```bash
npm install
npm run dev            # server pengembangan
npm run build          # build produksi
npm run uji            # uji lengkap di basis data terpisah
```

Panduan lengkap untuk kontributor dan agen AI ada di [`CLAUDE.md`](CLAUDE.md).

Uji berjalan di basis data terpisah (`.data/marf-uji.db`, port 3101) sehingga tidak pernah menyentuh data produksi.
