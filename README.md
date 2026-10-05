# MARF Showroom Mobil

**Showroom mobil terpercaya di Purwokerto.** Katalog unit lengkap, simulasi kredit transparan, dan proses jual-beli yang jelas dari awal sampai STNK.

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

## Tumpukan Teknologi

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Kerangka | **Next.js 15.5** (App Router) | Render statis untuk halaman katalog — cepat dan murah di-hosting |
| UI | **React 19** | Komponen server untuk halaman berat data, komponen klien hanya untuk yang interaktif |
| Bahasa | **TypeScript** | Bentuk data unit dan dealer dipastikan saat kompilasi, bukan saat runtime |
| Gaya | **Sass** + variabel terpusat | Palet ada di satu berkas, bukan tersebar di ratusan komponen |
| Slider | **Swiper 14** | Galeri unit dan carousel beranda |
| Animasi | **WOW.js** | Animasi saat gulir, dipakai hemat agar tidak mengganggu |

**195 halaman statis** dibangun dari **59 rute** dan **204 komponen**.

---

## Menjalankan Secara Lokal

```bash
npm install     # pasang dependensi
npm run dev     # mode pengembangan
npm run build   # build produksi
npm run start   # jalankan hasil build
npm run lint    # periksa gaya kode
```

Buka [http://localhost:3000](http://localhost:3000).

### Catatan build

Build produksi membutuhkan memori sekitar **800 MB**. Di mesin dengan RAM terbatas, batasi heap V8 agar proses tidak dimatikan kernel:

```bash
NODE_OPTIONS="--max-old-space-size=768" npm run build
```

---

## Struktur Proyek

```
src/
├── app/               # Rute App Router — 59 halaman
│   ├── (blog)/        #   Artikel & blog
│   ├── (dashboard)/   #   Panel pemilik unit
│   ├── (listings)/    #   Katalog & detail unit
│   ├── (other-pages)/ #   FAQ, kontak, syarat
│   └── home-02 … home-10   # Varian beranda
├── components/        # 204 komponen, dikelompokkan per halaman
├── data/              # Sumber data: unit, dealer, agen, produk, menu, footer
└── types/             # Tipe bersama

public/assets/
├── images/            # Foto unit, logo, favicon
└── scss/              # Lembar gaya: variabel, komponen, halaman
```

**Data terpusat.** Isi katalog, dealer, dan agen tinggal disunting di `src/data/` — tidak perlu menyentuh komponen.

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
