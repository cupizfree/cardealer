// GET /api/gambar/<nama> — menyajikan gambar yang diunggah lewat panel.
//
// Gambar sengaja tidak disimpan di `public/`, karena direktori itu ter-bangun
// ulang setiap kali image dibuat dan unggahan pengguna akan hilang. Berkasnya
// ada di `.data/unggah/`, di luar jangkauan statis Next.js.

import { NextResponse } from "next/server";
import { existsSync } from "node:fs";
import { ApiError } from "@/lib/api";
import { bacaGambar, jenisDariNama, jalurGambar, namaSah } from "@/lib/unggah";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ berkas: string }> }) {
  const { berkas } = await params;

  // Nama berkas diperiksa ketat sebelum menyentuh sistem berkas: tanpa garis
  // miring, tanpa "..", hanya huruf kecil/angka/strip dengan ekstensi gambar.
  if (!namaSah(berkas)) {
    return NextResponse.json(
      { ok: false, error: { kode: "NAMA_TIDAK_SAH", pesan: "Nama berkas gambar tidak sah." } },
      { status: 400 },
    );
  }

  let jalur: string;
  try {
    jalur = jalurGambar(berkas);
  } catch (e) {
    const kode = e instanceof ApiError ? e.status : 500;
    return NextResponse.json(
      { ok: false, error: { kode: "NAMA_TIDAK_SAH", pesan: "Nama berkas gambar tidak sah." } },
      { status: kode },
    );
  }

  if (!existsSync(jalur)) {
    return NextResponse.json(
      { ok: false, error: { kode: "TIDAK_ADA", pesan: "Gambar tidak ditemukan." } },
      { status: 404 },
    );
  }

  const isi = bacaGambar(berkas);
  return new NextResponse(new Uint8Array(isi), {
    status: 200,
    headers: {
      "Content-Type": jenisDariNama(berkas),
      "Content-Length": String(isi.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
