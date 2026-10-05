"use client";

import { useCallback, useEffect, useState } from "react";
import { minta } from "@/lib/klien";

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
    const h = await minta(`/api/dealer/${d.id}`, { method: "DELETE" });
    if (!h.ok) {
      setGalat(h.pesan);
      return;
    }
    setPesan(`Dealer "${d.nama}" dihapus.`);
    muat();
  }

  return (
    <>
      {galat && <p className="panel-galat">{galat}</p>}
      {pesan && <p className="panel-sukses">{pesan}</p>}

      <div className="panel-kisi panel-kisi--2" style={{ alignItems: "start" }}>
        <form className="panel-kartu" onSubmit={simpan}>
          <h2 className="panel-kartu__judul">{ubahId ? "Ubah Dealer" : "Tambah Dealer"}</h2>
          <p className="panel-kartu__ket">
            {ubahId ? `Menyunting dealer #${ubahId}` : "Showroom rekanan yang menaungi unit"}
          </p>

          <label className="panel-medan">
            <span>Nama dealer *</span>
            <input value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} required placeholder="MARF Showroom Pusat" />
          </label>

          <div className="panel-baris">
            <label className="panel-medan">
              <span>Kota</span>
              <input value={f.kota} onChange={(e) => setF({ ...f, kota: e.target.value })} />
            </label>
            <label className="panel-medan">
              <span>Telepon</span>
              <input value={f.telepon} onChange={(e) => setF({ ...f, telepon: e.target.value })} placeholder="0822-4109-8298" />
            </label>
          </div>

          <label className="panel-medan">
            <span>Alamat</span>
            <input value={f.alamat} onChange={(e) => setF({ ...f, alamat: e.target.value })} />
          </label>

          <div className="panel-baris">
            <label className="panel-medan">
              <span>Surel</span>
              <input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            </label>
            <label className="panel-medan">
              <span>Jam buka</span>
              <input value={f.jam_buka} onChange={(e) => setF({ ...f, jam_buka: e.target.value })} />
            </label>
          </div>

          <div className="panel-aksi">
            <button type="submit" className="panel-tombol panel-tombol--utama" disabled={sibuk}>
              {sibuk ? "Menyimpan…" : ubahId ? "Simpan perubahan" : "Tambah dealer"}
            </button>
            {ubahId && (
              <button type="button" className="panel-tombol" onClick={reset}>
                Batal
              </button>
            )}
          </div>
        </form>

        <div className="panel-tabel-bungkus">
          <table className="panel-tabel">
            <thead>
              <tr>
                <th>Dealer</th>
                <th>Kota</th>
                <th>Telepon</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {memuat && baris.length === 0 && (
                <tr><td colSpan={4} className="panel-kosong">Memuat dealer…</td></tr>
              )}
              {!memuat && baris.length === 0 && (
                <tr><td colSpan={4} className="panel-kosong">Belum ada dealer.</td></tr>
              )}
              {baris.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.nama}</strong>
                    {!d.aktif && (
                      <span className="panel-lencana panel-lencana--batal" style={{ marginLeft: 7 }}>nonaktif</span>
                    )}
                    <div style={{ fontSize: 11.5, color: "var(--redup)" }}>{d.slug}</div>
                  </td>
                  <td>{d.kota ?? "—"}</td>
                  <td>{d.telepon ?? "—"}</td>
                  <td>
                    <div className="panel-tabel__aksi">
                      <button className="panel-tombol panel-tombol--kecil" onClick={() => sunting(d)}>
                        Ubah
                      </button>
                      <button
                        className="panel-tombol panel-tombol--kecil panel-tombol--bahaya"
                        onClick={() => hapus(d)}
                      >
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
    </>
  );
}
