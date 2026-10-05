// GET    /api/prospek/:id — satu prospek
// PATCH  /api/prospek/:id — ubah status / catatan / penanggung jawab
// DELETE /api/prospek/:id — hapus prospek

import { ApiError, bacaJson, sukses, tangani } from "@/lib/api";
import { wajibMasuk } from "@/lib/auth";
import { bacaProspek } from "@/lib/masukan";
import { catatLog } from "@/lib/repo/pengguna";
import { ambilProspek, hapusProspek, ubahProspek } from "@/lib/repo/prospek";

export const dynamic = "force-dynamic";

type Konteks = { params: Promise<{ id: string }> };

async function idDari(k: Konteks): Promise<number> {
  const { id } = await k.params;
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) {
    throw new ApiError(400, "ID_TIDAK_SAH", "ID prospek harus bilangan bulat positif.");
  }
  return n;
}

export async function GET(_req: Request, k: Konteks) {
  return tangani(async () => {
    await wajibMasuk();
    const id = await idDari(k);
    const p = ambilProspek(id);
    if (!p) throw new ApiError(404, "TIDAK_DITEMUKAN", "Prospek tidak ditemukan.");
    return sukses(p);
  });
}

export async function PATCH(req: Request, k: Konteks) {
  return tangani(async () => {
    const u = await wajibMasuk();
    const id = await idDari(k);
    if (!ambilProspek(id)) throw new ApiError(404, "TIDAK_DITEMUKAN", "Prospek tidak ditemukan.");

    const b = await bacaJson(req);
    const m = bacaProspek(b, "ubah");

    // Kalau status diubah tapi penanggung jawab belum diisi, isi otomatis.
    if (m.status && m.status !== "baru" && m.ditangani_oleh === undefined) {
      m.ditangani_oleh = u.id;
    }

    const p = ubahProspek(id, m);
    catatLog(u.id, "ubah", "prospek", id, `Prospek "${p?.nama}" → ${p?.status}`);
    return sukses(p);
  });
}

export async function DELETE(_req: Request, k: Konteks) {
  return tangani(async () => {
    const u = await wajibMasuk();
    const id = await idDari(k);
    const p = ambilProspek(id);
    if (!p) throw new ApiError(404, "TIDAK_DITEMUKAN", "Prospek tidak ditemukan.");

    hapusProspek(id);
    catatLog(u.id, "hapus", "prospek", id, `Hapus prospek "${p.nama}"`);
    return sukses({ dihapus: true, id });
  });
}
