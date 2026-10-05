"use client";

import { useCallback, useEffect, useState } from "react";
import { minta, waktu } from "@/lib/klien";
import {
  BarisKosong,
  BarisMemuat,
  INPUT,
  JudulKartu,
  KARTU,
  Lencana,
  Medan,
  Pesan,
  TABEL,
  TABEL_BUNGKUS,
  TD,
  TH,
  TOMBOL,
  TOMBOL_BAHAYA,
  TOMBOL_KECIL,
  TOMBOL_UTAMA,
} from "./ui";

type Pengguna = {
  id: number;
  email: string;
  nama: string;
  peran: "admin" | "staff";
  aktif: boolean;
  telepon: string | null;
  dibuat_pada: string;
  terakhir_masuk: string | null;
};

const KOSONG = { nama: "", email: "", peran: "staff", kata_sandi: "", telepon: "" };
const GRID = "grid gap-x-4 sm:grid-cols-2";

export default function DaftarPengguna() {
  const [baris, setBaris] = useState<Pengguna[]>([]);
  const [f, setF] = useState({ ...KOSONG });
  const [ubahId, setUbahId] = useState<number | null>(null);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);

  const muat = useCallback(async () => {
    setMemuat(true);
    const h = await minta<Pengguna[]>("/api/pengguna");
    if (h.ok) {
      setBaris(h.data);
      setGalat(null);
    } else {
      setGalat(h.pesan);
    }
    setMemuat(false);
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  function reset() {
    setF({ ...KOSONG });
    setUbahId(null);
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setGalat(null);
    setPesan(null);
    setSibuk(true);

    const badan: Record<string, unknown> = {
      nama: f.nama,
      email: f.email,
      peran: f.peran,
      telepon: f.telepon || null,
    };
    if (f.kata_sandi) badan.kata_sandi = f.kata_sandi;

    const h = ubahId
      ? await minta(`/api/pengguna/${ubahId}`, { method: "PATCH", body: JSON.stringify(badan) })
      : await minta("/api/pengguna", { method: "POST", body: JSON.stringify(badan) });

    setSibuk(false);
    if (!h.ok) {
      setGalat(h.pesan);
      return;
    }
    setPesan(ubahId ? `Akun "${f.nama}" diperbarui.` : `Akun "${f.nama}" dibuat.`);
    reset();
    muat();
  }

  function sunting(p: Pengguna) {
    setUbahId(p.id);
    setF({ nama: p.nama, email: p.email, peran: p.peran, kata_sandi: "", telepon: p.telepon ?? "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function ubahAktif(p: Pengguna) {
    setGalat(null);
    setPesan(null);
    const h = await minta(`/api/pengguna/${p.id}`, {
      method: "PATCH",
      body: JSON.stringify({ aktif: !p.aktif }),
    });
    if (!h.ok) {
      setGalat(h.pesan);
      return;
    }
    setPesan(`Akun "${p.nama}" ${p.aktif ? "dinonaktifkan" : "diaktifkan"}.`);
    muat();
  }

  async function hapus(p: Pengguna) {
    if (!confirm(`Hapus akun "${p.nama}"?`)) return;
    setGalat(null);
    setPesan(null);
    const h = await minta(`/api/pengguna/${p.id}`, { method: "DELETE" });
    if (!h.ok) {
      setGalat(h.pesan);
      return;
    }
    setPesan(`Akun "${p.nama}" dihapus.`);
    muat();
  }

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[1fr_1.35fr]">
      <form className={KARTU} onSubmit={simpan}>
        <JudulKartu
          judul={ubahId ? "Ubah Akun" : "Tambah Akun"}
          ket={
            ubahId
              ? "Biarkan kata sandi kosong kalau tidak ingin menggantinya"
              : "Admin mengelola pengguna; staff hanya mengelola unit & prospek"
          }
        />

        {galat && <Pesan jenis="galat">{galat}</Pesan>}
        {pesan && <Pesan jenis="sukses">{pesan}</Pesan>}

        <Medan label="Nama lengkap" wajib>
          <input
            className={INPUT}
            value={f.nama}
            onChange={(e) => setF({ ...f, nama: e.target.value })}
            required
            placeholder="Nama pegawai"
          />
        </Medan>

        <Medan label="Surel" wajib>
          <input
            className={INPUT}
            type="email"
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
            required
            placeholder="nama@marf.id"
          />
        </Medan>

        <div className={GRID}>
          <Medan label="Peran" wajib>
            <select
              className={INPUT}
              value={f.peran}
              onChange={(e) => setF({ ...f, peran: e.target.value })}
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </Medan>

          <Medan label="Telepon">
            <input
              className={INPUT}
              value={f.telepon}
              onChange={(e) => setF({ ...f, telepon: e.target.value })}
            />
          </Medan>
        </div>

        <Medan label={ubahId ? "Kata sandi baru (opsional)" : "Kata sandi"} wajib={!ubahId}>
          <input
            className={INPUT}
            type="password"
            value={f.kata_sandi}
            onChange={(e) => setF({ ...f, kata_sandi: e.target.value })}
            required={!ubahId}
            minLength={8}
            autoComplete="new-password"
            placeholder="minimal 8 karakter"
          />
        </Medan>

        <div className="mt-2 flex flex-wrap gap-2.5">
          <button type="submit" className={TOMBOL_UTAMA} disabled={sibuk}>
            {sibuk ? "Menyimpan…" : ubahId ? "Simpan perubahan" : "Buat akun"}
          </button>
          {ubahId && (
            <button type="button" className={TOMBOL} onClick={reset}>
              Batal
            </button>
          )}
        </div>
      </form>

      <div className={TABEL_BUNGKUS}>
        <table className={TABEL}>
          <thead>
            <tr>
              <th className={TH}>Nama</th>
              <th className={TH}>Peran</th>
              <th className={`${TH} hidden md:table-cell`}>Terakhir masuk</th>
              <th className={`${TH} text-right`}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {memuat && baris.length === 0 && <BarisMemuat kolom={4} apa="pengguna" />}
            {!memuat && baris.length === 0 && <BarisKosong kolom={4}>Belum ada pengguna.</BarisKosong>}

            {baris.map((p) => (
              <tr key={p.id} className="transition hover:bg-[#fcfcfd]">
                <td className={TD}>
                  <div className="flex items-center gap-2">
                    <strong className="font-semibold">{p.nama}</strong>
                    {!p.aktif && (
                      <span className="whitespace-nowrap rounded-full bg-[#f0f1f3] px-2 py-[2px] text-[10px] font-bold uppercase tracking-wide text-redup">
                        nonaktif
                      </span>
                    )}
                  </div>
                  <div className="marf-pecah text-[11.5px] text-redup">{p.email}</div>
                </td>
                <td className={TD}>
                  <Lencana nilai={p.peran} />
                </td>
                <td className={`${TD} hidden text-[12.5px] md:table-cell`}>
                  {waktu(p.terakhir_masuk)}
                </td>
                <td className={TD}>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <button className={`${TOMBOL} ${TOMBOL_KECIL}`} onClick={() => sunting(p)}>
                      Ubah
                    </button>
                    <button className={`${TOMBOL} ${TOMBOL_KECIL}`} onClick={() => ubahAktif(p)}>
                      {p.aktif ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                    <button className={`${TOMBOL_BAHAYA} ${TOMBOL_KECIL}`} onClick={() => hapus(p)}>
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
