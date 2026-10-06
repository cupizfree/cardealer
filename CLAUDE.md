# MARF Showroom — panduan proyek

Situs showroom mobil MARF (Purwokerto): katalog publik plus panel internal untuk
admin dan staff. Panduan ini untuk agen AI maupun pengembang yang bekerja di
repositori ini.

## Tumpukan

- **Next.js 15** (App Router) + **React 19**, TypeScript
- **Sass/SCSS** untuk antarmuka situs publik
- **Tailwind 4** khusus panel, di-build lewat `@tailwindcss/cli`
- **SQLite** lewat `node:sqlite` (bawaan Node 22.5+) — tanpa dependensi npm
- Node **24+** (dikembangkan di Node 26)

## Perintah

```bash
npm run dev              # server pengembangan
npm run build            # build CSS panel, lalu next build
npm run start            # server produksi (bawaan port 3000)
npm run css:panel        # build ulang CSS panel saja
npm run uji              # uji lengkap di basis data TERPISAH (port 3101)
```

## Basis data

- Berkas: `.data/marf.db` — **tidak ikut git** (`.gitignore`), 404 di GitHub
- Jalur bisa diubah lewat `MARF_DB_PATH`; skema dibuat otomatis saat koneksi pertama
- Enam tabel: `pengguna`, `sesi`, `dealer`, `unit`, `prospek`, `log_aktivitas`
- SQL terpusat di `src/lib/repo/` — jangan menulis SQL di komponen
- Sandi disimpan dengan scrypt + garam (`src/lib/sandi.ts`)

### Basis data uji terpisah — WAJIB

`npm run uji` menyalakan server uji di port **3101** dengan
`MARF_DB_PATH=./.data/marf-uji.db`, mengisi data awal, menjalankan
`scripts/uji-produksi.sh`, lalu memeriksa kebocoran.

Jangan pernah menjalankan uji tulis-menulis terhadap basis data produksi. Versi
lama melakukannya dan meninggalkan dua unit sampah setiap kali dijalankan.

Setiap unit yang dibuat oleh uji **harus** dihapus di akhir. `uji-produksi.sh`
mencatat setiap ID yang dibuat ke larik `DIBUAT` dan menghapusnya lewat `trap`
saat keluar — termasuk masuk ulang, karena bagian akhir uji mengetes `logout`
dan cookie admin sudah mati saat pembersihan berjalan.

## Katalog publik membaca basis data

Situs publik membaca katalog dari basis data, bukan dari data statis:

- `src/lib/katalog.ts` — jembatan. `muatKatalog()` mengubah baris tabel `unit`
  menjadi bentuk `Listing` yang dipakai seluruh komponen
- Hanya unit berstatus `tersedia` atau `dipesan` yang terbit
- Kalau basis data kosong, `muatKatalog()` jatuh ke `src/data/listings.ts`
- `src/components/common/KatalogProvider.tsx` menyalurkan katalog ke komponen
  klien lewat konteks; komponen klien memakai `useKatalog()` / `useListings()`

`src/data/listings.ts` **hanya** cadangan dan sumber data awal. Jangan
menjadikannya sumber utama di tempat baru.

`layout.tsx` menetapkan `dynamic = "force-dynamic"` supaya perubahan dari panel
langsung terlihat tanpa build ulang.

## Aturan yang sudah memakan korban

- **Jangan ganti teks massal di seluruh pohon sumber.** Penggantian literal ikut
  mengubah nama identifier dan jalur impor (`sortListings` → `sortUnit`,
  `INITIAL_GALLERY` → `INITIAL_GSEMUAERY`). Pakai tambalan presisi per berkas.
- **Kalau menerjemahkan nama yang dibandingkan di tempat lain, ubah
  pembandingnya juga.** `ProductTabs.tsx` pernah menampilkan tab yang tidak akan
  pernah aktif karena nama tab diterjemahkan tetapi `active === "..."` tidak.
- **Build harus jalan sendirian.** Matikan server lain, `tsserver`, dan peramban
  tanpa kepala dulu, lalu batasi heap:
  `NODE_OPTIONS="--max-old-space-size=896"`. Kalau tidak, kena SIGKILL karena
  kehabisan memori.
- **`ss -lptn -p` tidak bisa melihat pemilik soket di lingkungan ini.** Untuk
  mematikan proses, cari lewat `/proc/*/environ` (lihat `scripts/uji.sh`).
- **Cookie sesi ber-flag `Secure`.** Uji API lewat HTTPS/tunnel, bukan HTTP polos,
  atau login akan gagal tanpa pesan.
- **Tailwind dipasang tanpa `postcss.config` dan tanpa `@layer`.** Reset
  universal situs (`* { margin:0; padding:0; color:#1c1c1c }`) selalu menang.
- **Harga dalam Rupiah**, bilangan bulat, tanpa desimal.

## Tata letak

```
src/app/            rute App Router (publik, (dashboard), (panel), api/)
src/components/     komponen antarmuka
src/lib/            backend: db, skema, auth, repo/, katalog.ts, kredit.ts
src/data/           data statis (cadangan katalog, konten pemasaran)
src/styles/         sumber dan hasil build CSS panel
scripts/            skrip sekali-jalan dan harness uji
```

## Dokumen lama

`docs/migration/` dan `.claude/rules/` adalah catatan dari pekerjaan awal
memindahkan templat Aurexo ke Next.js. Keduanya masih merujuk proyek tetangga
(`../aurexo`, `../luminor-nextjs`) yang **sudah tidak ada**. Jangan dijadikan
acuan; simpan sebagai catatan sejarah saja.

## Kredit

Antarmuka dibangun di atas templat **Aurexo** oleh
[Themesflat](https://github.com/themesflatdev/aurexo-nextjs), lalu diubah
menyeluruh. Lihat `LICENSE` untuk catatan cakupan lisensi.
