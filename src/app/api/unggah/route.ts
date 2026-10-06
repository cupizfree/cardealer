// POST /api/unggah — unggah gambar dari panel (multipart/form-data, medan "berkas").
//
// Dipakai FormUnit supaya admin/staff bisa mengunggah gambar langsung dari
// ponsel, bukan hanya menempel alamat URL.
//
// Mengembalikan { alamat } yang siap dimasukkan ke kolom `galeri`.

import { dibuat, gagal, tangani, ApiError } from "@/lib/api";
import { wajibMasuk } from "@/lib/auth";
import { catatLog } from "@/lib/repo/pengguna";
import { MAKS_BYTE, simpanGambar } from "@/lib/unggah";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return tangani(async () => {
    const p = await wajibMasuk();

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      throw new ApiError(400, "BUKAN_MULTIPART", "Permintaan harus berupa multipart/form-data.");
    }

    const berkas = form.get("berkas");
    if (!(berkas instanceof File)) {
      throw new ApiError(422, "BERKAS_HILANG", 'Medan "berkas" wajib diisi dengan sebuah gambar.');
    }

    const hasil = await simpanGambar(berkas);
    const alamat = `/api/gambar/${hasil.nama}`;

    catatLog(p.id, "unggah", "gambar", null, `Unggah gambar ${hasil.nama} (${(hasil.byte / 1024).toFixed(0)} KB)`);

    return dibuat({ alamat, nama: hasil.nama, byte: hasil.byte, maks_byte: MAKS_BYTE });
  });
}

export function GET() {
  return gagal(405, "METODE_SALAH", "Gunakan POST untuk mengunggah gambar.");
}
