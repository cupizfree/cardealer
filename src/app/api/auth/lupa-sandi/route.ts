// POST /api/auth/lupa-sandi — minta tautan atur ulang sandi.
//
// Selalu menjawab dengan pesan yang sama, ada atau tidaknya akun itu. Kalau
// jawabannya berbeda, siapa pun bisa memakai formulir ini untuk menebak surel
// mana yang terdaftar di panel.

import { bacaJson, sukses, tangani, wajibEmail } from "@/lib/api";
import { ambilUntukLogin, catatLog } from "@/lib/repo/pengguna";
import { bersihkanTokenKedaluwarsa, buatTokenReset, MENIT_BERLAKU } from "@/lib/repo/reset";
import { alamatDasar, kirimSurel, surelResetSandi, surelAktif } from "@/lib/surel";

export const dynamic = "force-dynamic";

const PESAN = "Kalau surel itu terdaftar, tautan atur ulang sandi sudah dikirim. Periksa kotak masuk Anda.";

export async function POST(req: Request) {
  return tangani(async () => {
    const b = await bacaJson(req);
    const email = wajibEmail(b.email);

    bersihkanTokenKedaluwarsa();

    const p = ambilUntukLogin(email);

    // Pengguna tidak ada atau tidak aktif: jawab seolah berhasil, jangan bocorkan apa pun.
    if (!p || !p.aktif) {
      return sukses({ pesan: PESAN, dikirim: false });
    }

    const { token, kedaluwarsa } = buatTokenReset(p.id);
    const tautan = `${alamatDasar(req)}/reset-sandi?token=${token}`;

    const hasil = surelAktif()
      ? await kirimSurel(p.email, "Atur ulang sandi panel MARF", surelResetSandi(p.nama, tautan, MENIT_BERLAKU))
      : ({ terkirim: false, alasan: "Penyedia surel belum dikonfigurasi." } as const);

    if (hasil.terkirim) {
      catatLog(p.id, "minta-reset", "pengguna", p.id, `Tautan atur ulang sandi dikirim ke ${p.email}`);
      return sukses({ pesan: PESAN, dikirim: true, berlaku_sampai: kedaluwarsa });
    }

    // Tanpa penyedia surel, tautannya dicatat supaya admin bisa menyerahkannya
    // langsung ke yang bersangkutan. Dicatat sebagai aksi admin-nya, bukan
    // sebagai aksi pengguna, agar jejaknya jelas.
    catatLog(
      null,
      "reset-manual",
      "pengguna",
      p.id,
      `Surel tidak terkirim (${hasil.alasan}). Tautan atur ulang sandi untuk ${p.email}: ${tautan}`,
    );

    return sukses({
      pesan: PESAN,
      dikirim: false,
      alasan: hasil.alasan,
      berlaku_sampai: kedaluwarsa,
    });
  });
}
