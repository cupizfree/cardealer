// PATCH  /api/pengguna/:id — ubah pengguna (khusus admin)
// DELETE /api/pengguna/:id — hapus pengguna (khusus admin)
//
// Dua penjaga: admin tidak boleh menghapus dirinya sendiri, dan
// admin aktif terakhir tidak boleh dihapus — supaya sistem tidak terkunci.

import { ApiError, bacaJson, sukses, tangani } from "@/lib/api";
import { wajibPeran } from "@/lib/auth";
import { bacaPengguna } from "@/lib/masukan";
import {
  ambilPengguna,
  catatLog,
  emailTerpakai,
  hapusPengguna,
  jumlahAdminAktif,
  ubahPengguna,
} from "@/lib/repo/pengguna";

export const dynamic = "force-dynamic";

type Konteks = { params: Promise<{ id: string }> };

async function idDari(k: Konteks): Promise<number> {
  const { id } = await k.params;
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) {
    throw new ApiError(400, "ID_TIDAK_SAH", "ID pengguna harus bilangan bulat positif.");
  }
  return n;
}

export async function PATCH(req: Request, k: Konteks) {
  return tangani(async () => {
    const admin = await wajibPeran("admin");
    const id = await idDari(k);
    const target = ambilPengguna(id);
    if (!target) throw new ApiError(404, "TIDAK_DITEMUKAN", "Pengguna tidak ditemukan.");

    const b = await bacaJson(req);
    const m = bacaPengguna(b, "ubah");

    if (m.email && emailTerpakai(m.email, id)) {
      throw new ApiError(409, "EMAIL_TERPAKAI", `Surel "${m.email}" sudah terdaftar.`);
    }

    // Jangan biarkan admin menurunkan atau menonaktifkan dirinya sendiri
    // kalau dia satu-satunya admin aktif.
    const menurunkanDiri = id === admin.id && (m.peran === "staff" || m.aktif === false);
    if (menurunkanDiri && jumlahAdminAktif() <= 1) {
      throw new ApiError(
        409,
        "ADMIN_TERAKHIR",
        "Anda admin aktif terakhir — angkat admin lain dulu sebelum menurunkan diri sendiri.",
      );
    }

    const p = ubahPengguna(id, m);
    catatLog(admin.id, "ubah", "pengguna", id, `Ubah ${target.peran} "${target.nama}"`);
    return sukses(p);
  });
}

export async function DELETE(_req: Request, k: Konteks) {
  return tangani(async () => {
    const admin = await wajibPeran("admin");
    const id = await idDari(k);
    const target = ambilPengguna(id);
    if (!target) throw new ApiError(404, "TIDAK_DITEMUKAN", "Pengguna tidak ditemukan.");

    if (id === admin.id) {
      throw new ApiError(409, "DIRI_SENDIRI", "Anda tidak bisa menghapus akun sendiri.");
    }
    if (target.peran === "admin" && target.aktif && jumlahAdminAktif() <= 1) {
      throw new ApiError(409, "ADMIN_TERAKHIR", "Ini admin aktif terakhir — tidak bisa dihapus.");
    }

    hapusPengguna(id);
    catatLog(admin.id, "hapus", "pengguna", id, `Hapus ${target.peran} "${target.nama}"`);
    return sukses({ dihapus: true, id });
  });
}
