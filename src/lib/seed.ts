// Seed awal: akun admin & staff, dealer, unit, dan beberapa prospek contoh.
// IDEMPOTEN — kalau tabel pengguna sudah berisi, tidak melakukan apa pun.
// Dipanggil dari route login supaya basis data menyala sendiri saat pertama dipakai.

import { jalankan, satu, transaksi } from "./db";
import { hashSandi } from "./sandi";
import { allListings, FITUR_UNIT } from "@/data/listings";
import { allDealers } from "@/data/dealers";

/** "Rp 195.000.000" -> 195000000 */
function angkaDariHarga(teks: string | undefined): number {
  if (!teks) return 0;
  const n = Number(String(teks).replace(/[^0-9]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export const AKUN_AWAL = [
  { email: "admin@marf.id", nama: "Admin MARF", peran: "admin" as const, sandi: "MarfAdmin#2026" },
  { email: "staff@marf.id", nama: "Staff MARF", peran: "staff" as const, sandi: "MarfStaff#2026" },
];

export type HasilSeed = {
  dilewati: boolean;
  pengguna: number;
  dealer: number;
  unit: number;
  prospek: number;
};

export function seedJikaKosong(): HasilSeed {
  const jumlahPengguna = Number(satu("SELECT COUNT(*) AS n FROM pengguna")?.n ?? 0);
  if (jumlahPengguna > 0) {
    return { dilewati: true, pengguna: 0, dealer: 0, unit: 0, prospek: 0 };
  }

  return transaksi(() => {
    // ── Pengguna ────────────────────────────────────────────────────────────
    for (const a of AKUN_AWAL) {
      jalankan(
        "INSERT INTO pengguna (email, nama, kata_sandi, peran, aktif) VALUES (?,?,?,?,1)",
        a.email,
        a.nama,
        hashSandi(a.sandi),
        a.peran,
      );
    }

    // ── Dealer ──────────────────────────────────────────────────────────────
    const idDealer = new Map<string, number>();
    let nDealer = 0;

    if (allDealers.length) {
      for (const d of allDealers) {
        jalankan(
          `INSERT INTO dealer (slug, nama, kota, alamat, telepon, jam_buka, aktif)
           VALUES (?,?,?,?,?,?,1)`,
          d.slug,
          d.name,
          "Purwokerto",
          d.address,
          Array.isArray(d.phones) ? (d.phones[0] ?? null) : null,
          "Senin–Sabtu, 08.00–17.00 WIB",
        );
        const id = Number(satu("SELECT last_insert_rowid() AS id")?.id ?? 0);
        idDealer.set(d.slug, id);
        nDealer++;
      }
    } else {
      // Tidak ada data dealer di src/data — pasang showroom utama.
      jalankan(
        `INSERT INTO dealer (slug, nama, kota, alamat, telepon, jam_buka, aktif)
         VALUES (?,?,?,?,?,?,1)`,
        "marf-purwokerto",
        "MARF Showroom Mobil Purwokerto",
        "Purwokerto",
        "Purwokerto, Kabupaten Banyumas, Jawa Tengah",
        "0822-4109-8298",
        "Senin–Sabtu, 08.00–17.00 WIB",
      );
      const id = Number(satu("SELECT last_insert_rowid() AS id")?.id ?? 0);
      idDealer.set("marf-purwokerto", id);
      nDealer = 1;
    }

    const dealerUtama = [...idDealer.values()][0] ?? null;
    const adminId = Number(satu("SELECT id FROM pengguna WHERE peran='admin' LIMIT 1")?.id ?? 0);

    // ── Unit ────────────────────────────────────────────────────────────────
    let nUnit = 0;
    for (const l of allListings) {
      const spec = l.spec ?? { mileage: "", year: "", fuel: "", transmission: "" };
      const ov = (l.overview ?? {}) as Record<string, string>;

      jalankan(
        `INSERT INTO unit
          (slug, judul, merek, model, tahun, harga, harga_cicilan, kilometer, transmisi,
           bahan_bakar, warna, lokasi, deskripsi, status, unggulan, dealer_id, dibuat_oleh,
           galeri, fitur, spesifikasi)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        l.slug,
        l.title,
        l.brandLabel,
        l.title.replace(l.brandLabel, "").trim() || null,
        Number(spec.year) || null,
        angkaDariHarga(l.price),
        l.financing?.monthlyPrice ?? null,
        spec.mileage || null,
        ov.transmission || spec.transmission || null,
        spec.fuel || null,
        ov.color ?? null,
        ov.location ?? l.location?.address ?? "Purwokerto, Jawa Tengah",
        l.description ?? null,
        "tersedia",
        l.badge ? 1 : 0,
        dealerUtama,
        adminId || null,
        JSON.stringify(l.gallery ?? []),
        JSON.stringify(l.features ?? FITUR_UNIT[l.slug] ?? {}),
        JSON.stringify(ov),
      );
      nUnit++;
    }

    // ── Prospek contoh ──────────────────────────────────────────────────────
    const contoh = [
      {
        nama: "Budi Santoso",
        telepon: "0812-3456-7890",
        email: "budi@contoh.id",
        pesan: "Tertarik dengan Avanza 1.5 G. Bisa minta info cicilan 3 tahun?",
        sumber: "kontak",
        status: "baru",
      },
      {
        nama: "Siti Rahayu",
        telepon: "0856-7890-1234",
        email: "siti@contoh.id",
        pesan: "Mau jual Honda Jazz 2019, kilometernya 45 ribu. Bisa dinilai?",
        sumber: "jual-mobil",
        status: "dihubungi",
      },
      {
        nama: "Andi Pratama",
        telepon: "0878-1234-5678",
        email: "andi@contoh.id",
        pesan: "Tukar tambah Xenia 2018 dengan Xpander. Selisihnya berapa?",
        sumber: "tukar-tambah",
        status: "terjadwal",
      },
      {
        nama: "Dewi Lestari",
        telepon: "0813-9876-5432",
        email: "dewi@contoh.id",
        pesan: "Unit Brio Satya masih ada? Sudah pernah uji coba.",
        sumber: "detail-unit",
        status: "selesai",
      },
    ];

    const staffId = Number(satu("SELECT id FROM pengguna WHERE peran='staff' LIMIT 1")?.id ?? 0);
    let nProspek = 0;
    for (const p of contoh) {
      jalankan(
        `INSERT INTO prospek (nama, telepon, email, pesan, sumber, status, ditangani_oleh)
         VALUES (?,?,?,?,?,?,?)`,
        p.nama,
        p.telepon,
        p.email,
        p.pesan,
        p.sumber,
        p.status,
        p.status === "baru" ? null : staffId || null,
      );
      nProspek++;
    }

    jalankan(
      `INSERT INTO log_aktivitas (pengguna_id, aksi, entitas, entitas_id, ringkasan)
       VALUES (?,?,?,?,?)`,
      adminId || null,
      "seed",
      "sistem",
      null,
      `Seed awal: ${AKUN_AWAL.length} pengguna, ${nDealer} dealer, ${nUnit} unit, ${nProspek} prospek`,
    );

    return { dilewati: false, pengguna: AKUN_AWAL.length, dealer: nDealer, unit: nUnit, prospek: nProspek };
  });
}
