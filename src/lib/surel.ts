// Pengiriman surel.
//
// Sengaja tanpa dependensi npm: pengiriman lewat HTTP API (Resend dan yang
// setara) hanya butuh `fetch`, jadi tidak ada paket baru yang perlu dipasang
// dan dirawat.
//
// Konfigurasi lewat lingkungan:
//   SUREL_API_KEY   — kunci API. Tanpa ini, pengiriman dimatikan.
//   SUREL_API_URL   — bawaan https://api.resend.com/emails
//   SUREL_DARI      — alamat pengirim, mis. "MARF <no-reply@marf.id>"
//   MARF_URL        — alamat dasar situs, dipakai menyusun tautan reset
//
// Kalau `SUREL_API_KEY` tidak diisi, `kirimSurel` mengembalikan `terkirim:
// false` dengan alasan yang jelas. Pemanggil tidak boleh menganggapnya galat
// fatal — tautan reset tetap dibuat dan dicatat, sehingga admin bisa
// menyerahkannya sendiri.

export type HasilKirim = { terkirim: true; id?: string } | { terkirim: false; alasan: string };

export function surelAktif(): boolean {
  return Boolean(process.env.SUREL_API_KEY);
}

export function alamatDasar(req?: Request): string {
  const dariEnv = process.env.MARF_URL;
  if (dariEnv) return dariEnv.replace(/\/+$/, "");

  if (req) {
    // Di balik tunnel/proxy, alamat asli ada di header ini.
    const h = req.headers;
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (host) {
      const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
      return `${proto}://${host}`;
    }
  }

  return "http://localhost:3000";
}

export async function kirimSurel(ke: string, judul: string, isiHtml: string): Promise<HasilKirim> {
  const kunci = process.env.SUREL_API_KEY;
  if (!kunci) {
    return { terkirim: false, alasan: "SUREL_API_KEY belum diatur, jadi surel tidak dikirim." };
  }

  const url = process.env.SUREL_API_URL ?? "https://api.resend.com/emails";
  const dari = process.env.SUREL_DARI ?? "MARF <no-reply@marf.id>";

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kunci}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: dari, to: [ke], subject: judul, html: isiHtml }),
    });

    if (!r.ok) {
      const teks = await r.text().catch(() => "");
      return { terkirim: false, alasan: `Penyedia surel menolak (HTTP ${r.status}): ${teks.slice(0, 200)}` };
    }

    const j = (await r.json().catch(() => null)) as { id?: string } | null;
    return { terkirim: true, id: j?.id };
  } catch (e) {
    return { terkirim: false, alasan: `Tidak bisa menghubungi penyedia surel: ${e instanceof Error ? e.message : "galat tak dikenal"}` };
  }
}

/** Isi surel tautan reset sandi. */
export function surelResetSandi(nama: string, tautan: string, menit: number): string {
  return `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;color:#1c1c1c">
      <h2 style="color:#C8171F;margin:0 0 12px">Atur ulang sandi panel MARF</h2>
      <p>Halo ${nama},</p>
      <p>Ada permintaan mengatur ulang sandi untuk akun panel MARF Anda. Klik tautan di bawah untuk membuat sandi baru:</p>
      <p style="margin:24px 0">
        <a href="${tautan}"
           style="background:#C8171F;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block">
          Buat sandi baru
        </a>
      </p>
      <p style="font-size:13px;color:#667085">
        Tautan ini berlaku ${menit} menit dan hanya bisa dipakai sekali.
        Kalau Anda tidak meminta ini, abaikan saja surel ini — sandi Anda tidak berubah.
      </p>
      <p style="font-size:12px;color:#98a2b3;word-break:break-all">${tautan}</p>
    </div>
  `.trim();
}
