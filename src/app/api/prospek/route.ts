// GET  /api/prospek — daftar prospek (perlu masuk)
// POST /api/prospek — kiriman form dari situs publik (tanpa masuk)

import { angkaDari, bacaJson, dibuat, paramUrl, sukses, tangani, ApiError } from "@/lib/api";
import { wajibMasuk } from "@/lib/auth";
import { bacaProspek } from "@/lib/masukan";
import { catatLog } from "@/lib/repo/pengguna";
import { buatProspek, daftarProspek, ringkasanProspek } from "@/lib/repo/prospek";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return tangani(async () => {
    await wajibMasuk();
    const s = paramUrl(req);

    const halaman = angkaDari(s.get("halaman"), 1, 1, 10000);
    const batas = angkaDari(s.get("batas"), 20, 1, 100);

    const { baris, total } = daftarProspek({
      status: s.get("status"),
      sumber: s.get("sumber"),
      petugas: s.get("petugas") ? angkaDari(s.get("petugas"), 0, 1, 1_000_000_000) : null,
      q: s.get("q"),
      halaman,
      batas,
    });

    return sukses(baris, {
      total,
      halaman,
      batas,
      halamanTotal: Math.max(1, Math.ceil(total / batas)),
      ringkasan: ringkasanProspek(),
    });
  });
}

/**
 * Titik masuk publik — dipakai form kontak / jual mobil / tukar tambah di situs.
 * Sengaja dibatasi: pengirim anonim selalu masuk sebagai status "baru"
 * dan tidak boleh menitipkan catatan internal.
 */
export async function POST(req: Request) {
  return tangani(async () => {
    const b = await bacaJson(req);
    const m = bacaProspek(b, "baru");

    if (!m.telepon && !m.email) {
      throw new ApiError(422, "VALIDASI", "Isi nomor telepon atau surel supaya kami bisa menghubungi.");
    }

    const p = buatProspek({
      nama: String(m.nama),
      telepon: m.telepon ?? null,
      email: m.email ?? null,
      pesan: m.pesan ?? null,
      sumber: m.sumber ?? "kontak",
      status: "baru",
      catatan: null,
      unit_id: m.unit_id ?? null,
      ditangani_oleh: null,
    });

    // Jejak audit tanpa pengguna (kiriman publik).
    catatLog(null, "kirim", "prospek", p.id, `Prospek baru dari ${p.sumber}: ${p.nama}`);
    return dibuat({ id: p.id, diterima: true });
  });
}
