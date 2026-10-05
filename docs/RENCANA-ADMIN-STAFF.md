# Rencana — Backend, REST API, Panel Admin & Staff MARF

Disusun: 5 Oktober 2026
Status: **SELESAI** — lihat bagian "Hasil" di bawah.

---

## 1. Keadaan Sekarang (hasil pemeriksaan, bukan asumsi)

| Diperiksa | Hasil |
|---|---|
| API route (`route.ts`) | **0** |
| Server action (`"use server"`) | **0** |
| `middleware.ts` | tidak ada |
| `getServerSideProps` / `cookies()` / `headers()` | **0** |
| Dependensi database | **0** |
| `fetch` ke API luar | **0** |
| Halaman prerender | 193 dari 195 |
| Sumber data | `src/data/*.ts` — TypeScript, dikompilasi ke bundle |

**Kesimpulan:** situs ini 100% statis. Server Next.js cuma menyajikan berkas + mengoptimasi gambar. Tidak ada yang bisa ditulis pengunjung, tidak ada autentikasi, tidak ada data yang bertahan.

**Uji bukti:** kata `"Toyota Avanza"` ditemukan di dalam bundle server → data masuk saat build, bukan diambil saat runtime.

---

## 2. Keputusan Arsitektur

### 2.1 Penyimpanan: SQLite lewat `node:sqlite`

**Dipilih karena kendala nyata, bukan selera:**

| Pilihan | Alasan diterima/ditolak |
|---|---|
| **`node:sqlite`** ✅ | Bawaan Node 26 — **nol instalasi**. Memori sisa 208 MB, `npm install` berat akan kena OOM. SQL nyata, ACID, persisten. |
| Supabase | Pola di byorderkasir hanya `.env.example` — **tanpa kredensial nyata**. Butuh akun + jaringan. |
| Postgres lokal 5599 | Yang jalan itu **embedded harness uji** dari `cache/scratch`, bukan server produksi. Tanpa klien `psql`. |
| Prisma/Drizzle | Butuh instalasi + generate → berat di memori. |

Sudah diuji: `CREATE TABLE` → `INSERT` → `SELECT` → tutup → buka ulang → **data masih ada**.

**Lapisan data dibuat swappable.** Semua akses lewat `src/lib/repo/*.ts`, bukan SQL tersebar di route. Kalau nanti pindah ke Supabase/Postgres, cukup ganti lapisan repo — route dan halaman tidak berubah.

### 2.2 REST API di dalam Next.js

Route handler App Router (`src/app/api/**/route.ts`). Konvensi RESTful penuh: kata benda jamak, kata kerja lewat metode HTTP, kode status benar.

### 2.3 Autentikasi: sesi cookie httpOnly

- Kata sandi di-hash **scrypt** (`node:crypto`) — bukan SHA polos, bukan plaintext
- Token sesi **acak 32 byte**, disimpan di tabel `sesi`, dikirim lewat cookie `httpOnly` + `sameSite=lax`
- Tidak ada JWT — sesi server-side lebih mudah dicabut
- Peran: **`admin`** (penuh) dan **`staff`** (terbatas)

---

## 3. Skema Database

```
pengguna ──┬──< sesi
           ├──< unit (dibuat_oleh)
           └──< log_aktivitas

dealer ────< unit
unit ──────< prospek
```

| Tabel | Isi |
|---|---|
| `pengguna` | admin & staff — email, nama, hash sandi, peran, aktif |
| `sesi` | token login, kedaluwarsa |
| `dealer` | showroom/cabang |
| `unit` | katalog mobil — 15 unit awal dari `src/data/listings.ts` |
| `prospek` | prospek dari form (kontak, jual mobil, tukar tambah) |
| `log_aktivitas` | jejak audit — siapa mengubah apa, kapan |

Kolom inti jadi kolom sungguhan (bisa di-query, diurut, difilter). Bagian bersarang (galeri, fitur) disimpan sebagai JSON teks.

---

## 4. REST API

Semua di bawah `/api`. Format respons konsisten:

```json
{ "ok": true,  "data": ..., "meta": { "total": 15, "halaman": 1 } }
{ "ok": false, "error": { "kode": "TIDAK_DITEMUKAN", "pesan": "..." } }
```

| Metode | Jalur | Akses | Guna |
|---|---|---|---|
| `POST` | `/api/auth/login` | publik | Masuk, dapat cookie sesi |
| `POST` | `/api/auth/logout` | login | Keluar, cabut sesi |
| `GET` | `/api/auth/me` | login | Profil yang sedang masuk |
| `GET` | `/api/unit` | publik | Daftar unit — `?q=&merek=&status=&halaman=&batas=` |
| `POST` | `/api/unit` | staff+ | Tambah unit |
| `GET` | `/api/unit/:id` | publik | Detail unit |
| `PATCH` | `/api/unit/:id` | staff+ | Ubah unit |
| `DELETE` | `/api/unit/:id` | admin | Hapus unit |
| `GET` | `/api/dealer` | publik | Daftar dealer |
| `POST` | `/api/dealer` | admin | Tambah dealer |
| `PATCH`/`DELETE` | `/api/dealer/:id` | admin | Ubah / hapus |
| `GET` | `/api/prospek` | staff+ | Daftar prospek |
| `POST` | `/api/prospek` | publik | **Form situs mengirim ke sini** |
| `PATCH` | `/api/prospek/:id` | staff+ | Ubah status/tindak lanjut |
| `GET` | `/api/pengguna` | admin | Daftar pengguna |
| `POST` | `/api/pengguna` | admin | Tambah staff |
| `PATCH`/`DELETE` | `/api/pengguna/:id` | admin | Ubah / nonaktifkan |
| `GET` | `/api/statistik` | staff+ | Angka dasbor |

Aturan status: `200` berhasil · `201` dibuat · `400` masukan salah · `401` belum masuk · `403` peran tidak cukup · `404` tidak ada · `409` bentrok (slug/email ganda) · `422` validasi gagal.

---

## 5. Halaman Admin

Rute: `/admin/*` — hanya peran `admin`.

| Halaman | Isi |
|---|---|
| `/admin` | Dasbor: jumlah unit per status, prospek baru, stok terlaris, aktivitas terakhir |
| `/admin/unit` | Tabel unit — cari, filter status/merek, urut, aksi cepat ubah status |
| `/admin/unit/baru` | Form tambah unit |
| `/admin/unit/[id]` | Form ubah + hapus |
| `/admin/dealer` | Kelola showroom |
| `/admin/prospek` | Kotak masuk prospek — ubah status, tugaskan ke staff |
| `/admin/staf` | Kelola pengguna — tambah, ubah peran, nonaktifkan |
| `/admin/aktivitas` | Jejak audit |

## 6. Halaman Staff

Rute: `/staff/*` — peran `staff` dan `admin`.

| Halaman | Isi |
|---|---|
| `/staff` | Dasbor ringkas: prospek yang ditugaskan, unit perlu perhatian |
| `/staff/unit` | Lihat & ubah unit (tidak bisa hapus) |
| `/staff/prospek` | Tangani prospek yang ditugaskan |

**Batas peran ditegakkan di server**, bukan cuma disembunyikan di UI. Route API memeriksa peran; halaman memeriksa sesi.

---

## 7. Akun Awal

Dibuat saat seed pertama. **Kata sandi harus diganti setelah masuk pertama.**

| Peran | Email | Sandi awal |
|---|---|---|
| admin | `admin@marf.id` | `MarfAdmin#2026` |
| staff | `staff@marf.id` | `MarfStaff#2026` |

Akun ini dibuat otomatis oleh `src/lib/seed.ts` saat basis data masih kosong. **Ganti sebelum dipakai sungguhan** — nilainya tertulis di README publik.

---

## 8. Urutan Pengerjaan

1. Lapisan data — skema, koneksi, migrasi, seed
2. Autentikasi — hash, sesi, RBAC
3. REST API — seluruh endpoint
4. Halaman admin
5. Halaman staff
6. Build + verifikasi dengan permintaan HTTP sungguhan

---

## 9. Batas Jujur

**Yang akan ada setelah ini:** backend sungguhan dengan data yang bertahan, API yang bisa dipanggil pihak ketiga, login dengan peran, panel admin dan staff yang berfungsi.

**Yang belum ada:**

- **Unggah foto.** Belum ada penyimpanan berkas. Galeri unit masih merujuk berkas di `public/`. Perlu S3/objek storage kalau mau unggah dari panel.
- **Multi-cabang.** Skema sudah punya `dealer_id` di unit, tapi pembatasan data per cabang belum ditegakkan.
- **Reset sandi lewat email.** Belum ada pengiriman email. Reset dilakukan admin lewat panel.
- **Uji otomatis.** Belum ada suite tes. Verifikasi dilakukan dengan permintaan HTTP langsung.
- **Produksi.** SQLite bagus untuk satu server. Kalau nanti banyak cabang menulis bersamaan, pindah ke Postgres lewat lapisan repo yang sudah disiapkan.

---

## 10. Hasil — apa yang benar-benar dibangun

Semua bagian di atas dikerjakan dan diuji terhadap server produksi.

### Berkas yang dibuat

| Kelompok | Berkas |
|---|---|
| Skema & koneksi | `src/lib/skema.ts`, `src/lib/db.ts` |
| Autentikasi | `src/lib/sandi.ts`, `src/lib/auth.ts` |
| API | `src/lib/api.ts`, `src/lib/masukan.ts` |
| Data | `src/lib/seed.ts`, `src/lib/repo/{unit,dealer,prospek,pengguna}.ts` |
| REST API | 13 berkas `route.ts` di `src/app/api/` |
| Panel | 11 halaman di `src/app/(panel)/` |
| Komponen panel | 7 berkas di `src/components/panel/` |
| Login | `src/app/masuk/` |
| Tipe | `src/types/node-sqlite.d.ts` |

### Yang diuji

- `npx tsc --noEmit` — **0 galat**
- `npx next build` — **hijau**, 193 halaman statis + 13 rute API + 11 halaman panel
- Skrip `uji-produksi.sh` terhadap server produksi — **43 lulus, 0 gagal**, mencakup:
  - akses publik vs perlu-masuk pada setiap rute
  - CRUD unit lengkap (buat, ubah, hapus, 404 sesudahnya)
  - bentrok slug → `409`
  - validasi → `422`
  - penjagaan peran: staff → `/api/pengguna` = `403`
  - pengalihan halaman: belum masuk → `/masuk`, staff → `/admin` = `307`
  - situs publik tetap utuh (`/`, `/contact-us`, katalog, `/about-us`)

### Penyimpangan dari rencana

1. **Basis data: SQLite lewat `node:sqlite`, bukan Prisma + Postgres.** Alasannya memori: `npm install` Prisma di lingkungan ini (2 GiB, tanpa swap) sering dimatikan kernel. `node:sqlite` nol dependensi dan sudah teruji. Lapisan `src/lib/repo/` dibuat supaya perpindahan ke Postgres nanti tidak menyentuh route maupun halaman.
2. **`src/lib/sandi.ts` dipisah** dari `auth.ts` agar seed bisa memakai hashing tanpa terseret `next/headers`.
3. **`src/types/node-sqlite.d.ts` ditambahkan** karena `@types/node` proyek ini masih 20.x — lebih tua dari `node:sqlite`. Murni kekurangan tipe; modulnya ada di runtime. Hapus berkas ini kalau `@types/node` sudah dinaikkan.
4. **`/.data/` masuk `.gitignore`** — berisi hash kata sandi dan token sesi. Ini ditemukan saat pemeriksaan sebelum commit, bukan setelahnya.
5. **Form kontak `/contact-us` disambungkan** ke `POST /api/prospek` — sebelumnya murni tampilan.
