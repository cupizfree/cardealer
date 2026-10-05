"use client";

import { useCallback, useEffect, useState } from "react";
import { minta } from "@/lib/klien";
import {
  BarisKosong,
  BarisMemuat,
  INPUT,
  JudulKartu,
  KARTU,
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

type Dealer = {
  id: number;
  slug: string;
  nama: string;
  kota: string | null;
  alamat: string | null;
  telepon: string | null;
  email: string | null;
  jam_buka: string | null;
  aktif: boolean;
};

const KOSONG = {
  nama: "",
  kota: "Purwokerto",
  alamat: "",
  telepon: "",
  email: "",
  jam_buka: "Senin–Sabtu, 08.00–17.00 WIB",
};

const GRID = "grid gap-x-4 sm:grid-cols-2";

export default function DaftarDealer() {
  const [baris, setBaris] = useState<Dealer[]>([]);
  const [f, setF] = useState(KOSONG);
  const [ubahId, setUbahId] = useState<number | null>(null);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);

  const muat = useCallback(async () => {
    setMemuat(true);
    const h = await minta<Dealer[]>("/api/dealer");
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
    setF(KOSONG);
    setUbahId(null);
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setGalat(null);
    setPesan(null);
    setSibuk(true);

    const badan = {
      nama: f.nama,
      kota: f.kota || null,
      alamat: f.alamat || null,
      telepon: f.telepon || null,
      email: f.email || null,
      jam_buka: f.jam_buka || null,
    };

    const h = ubahId
      ? await minta(`/api/dealer/${ubahId}`, { method: "PATCH", body: JSON.stringify(badan) })
      : await minta("/api/dealer", { method: "POST", body: JSON.stringify(badan) });

    setSibuk(false);
    if (!h.ok) {
      setGalat(h.pesan);
      return;
    }
    setPesan(ubahId ? `Dealer "${f.nama}" diperbarui.` : `Dealer "${f.nama}" ditambahkan.`);
    reset();
    muat();
  }

  function sunting(d: Dealer) {
    setUbahId(d.id);
    setF({
      nama: d.nama,
      kota: d.kota ?? "",
      alamat: d.alamat ?? "",
      telepon: d.telepon ?? "",
      email: d.email ?? "",
      jam_buka: d.jam_buka ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function hapus(d: Dealer) {
    if (!confirm(`Hapus dealer "${d.nama}"?`)) return;
    setGalat(null);
    const h = await minta(`/api/dealer/${d.id}`, { method: "DELETE" });
    if (!h.ok) {
      setGalat(h.pesan);
      return;
    }
    setPesan(`Dealer "${d.nama}" dihapus.`);
    muat();
  }

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[1fr_1.35fr]">
      <form className={KARTU} onSubmit={simpan}>
        <JudulKartu
          judul={ubahId ? "Ubah Dealer" : "Tambah Dealer"}
          ket={ubahId ? `Menyunting dealer #${ubahId}` : "Showroom rekanan yang menaungi unit"}
        />

        {galat && <Pesan jenis="galat">{galat}</Pesan>}
        {pesan && <Pesan jenis="sukses">{pesan}</Pesan>}

        <Medan label="Nama dealer" wajib>
          <input
            className={INPUT}
            value={f.nama}
            onChange={(e) => setF({ ...f, nama: e.target.value })}
            required
            placeholder="MARF Showroom Pusat"
          />
        </Medan>

        <div className={GRID}>
          <Medan label="Kota">
            <input className={INPUT} value={f.kota} onChange={(e) => setF({ ...f, kota: e.target.value })} />
          </Medan>
          <Medan label="Telepon">
            <input
              className={INPUT}
              value={f.telepon}
              onChange={(e) => setF({ ...f, telepon: e.target.value })}
              placeholder="0822-4109-8298"
            />
          </Medan>
        </div>

        <Medan label="Alamat">
          <input className={INPUT} value={f.alamat} onChange={(e) => setF({ ...f, alamat: e.target.value })} />
        </Medan>

        <div className={GRID}>
          <Medan label="Surel">
            <input
              className={INPUT}
              type="email"
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
            />
          </Medan>
          <Medan label="Jam buka">
            <input
              className={INPUT}
              value={f.jam_buka}
              onChange={(e) => setF({ ...f, jam_buka: e.target.value })}
            />
          </Medan>
        </div>

        <div className="mt-2 flex flex-wrap gap-2.5">
          <button type="submit" className={TOMBOL_UTAMA} disabled={sibuk}>
            {sibuk ? "Menyimpan…" : ubahId ? "Simpan perubahan" : "Tambah dealer"}
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
              <th className={TH}>Dealer</th>
              <th className={`${TH} hidden sm:table-cell`}>Kota</th>
              <th className={`${TH} hidden lg:table-cell`}>Telepon</th>
              <th className={`${TH} text-right`}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {memuat && baris.length === 0 && <BarisMemuat kolom={4} apa="dealer" />}
            {!memuat && baris.length === 0 && <BarisKosong kolom={4}>Belum ada dealer.</BarisKosong>}

            {baris.map((d) => (
              <tr key={d.id} className="transition hover:bg-[#fcfcfd]">
                <td className={TD}>
                  <div className="flex items-center gap-2">
                    <strong className="font-semibold">{d.nama}</strong>
                    {!d.aktif && <LencanaKecil />}
                  </div>
                  <div className="marf-pecah text-[11.5px] text-redup">{d.slug}</div>
                </td>
                <td className={`${TD} hidden sm:table-cell`}>{d.kota ?? "—"}</td>
                <td className={`${TD} hidden lg:table-cell`}>{d.telepon ?? "—"}</td>
                <td className={TD}>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <button className={`${TOMBOL} ${TOMBOL_KECIL}`} onClick={() => sunting(d)}>
                      Ubah
                    </button>
                    <button className={`${TOMBOL_BAHAYA} ${TOMBOL_KECIL}`} onClick={() => hapus(d)}>
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

function LencanaKecil() {
  return (
    <span className="whitespace-nowrap rounded-full bg-[#f0f1f3] px-2 py-[2px] text-[10px] font-bold uppercase tracking-wide text-redup">
      nonaktif
    </span>
  );
}
