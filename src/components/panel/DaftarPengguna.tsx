"use client";

import { useCallback, useEffect, useState } from "react";
import { minta, waktu } from "@/lib/klien";

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
    // Kata sandi hanya dikirim kalau diisi — supaya tidak menimpa saat menyunting.
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
    const h = await minta(`/api/pengguna/${p.id}`, { method: "DELETE" });
    if (!h.ok) {
      setGalat(h.pesan);
      return;
    }
    setPesan(`Akun "${p.nama}" dihapus.`);
    muat();
  }

  return (
    <>
      {galat && <p className="panel-galat">{galat}</p>}
      {pesan && <p className="panel-sukses">{pesan}</p>}

      <div className="panel-kisi panel-kisi--2" style={{ alignItems: "start" }}>
        <form className="panel-kartu" onSubmit={simpan}>
          <h2 className="panel-kartu__judul">{ubahId ? "Ubah Akun" : "Tambah Akun"}</h2>
          <p className="panel-kartu__ket">
            {ubahId
              ? "Biarkan kata sandi kosong kalau tidak ingin menggantinya"
              : "Admin bisa mengelola pengguna; staff hanya mengelola unit & prospek"}
          </p>

          <label className="panel-medan">
            <span>Nama lengkap *</span>
            <input value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} required placeholder="Nama pegawai" />
          </label>

          <label className="panel-medan">
            <span>Surel *</span>
            <input
              type="email"
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
              required
              placeholder="nama@marf.id"
            />
          </label>

          <div className="panel-baris">
            <label className="panel-medan">
              <span>Peran *</span>
              <select value={f.peran} onChange={(e) => setF({ ...f, peran: e.target.value })}>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label className="panel-medan">
              <span>Telepon</span>
              <input value={f.telepon} onChange={(e) => setF({ ...f, telepon: e.target.value })} />
            </label>
          </div>

          <label className="panel-medan">
            <span>{ubahId ? "Kata sandi baru (opsional)" : "Kata sandi *"}</span>
            <input
              type="password"
              value={f.kata_sandi}
              onChange={(e) => setF({ ...f, kata_sandi: e.target.value })}
              required={!ubahId}
              minLength={8}
              autoComplete="new-password"
              placeholder="minimal 8 karakter"
            />
          </label>

          <div className="panel-aksi">
            <button type="submit" className="panel-tombol panel-tombol--utama" disabled={sibuk}>
              {sibuk ? "Menyimpan…" : ubahId ? "Simpan perubahan" : "Buat akun"}
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
                <th>Nama</th>
                <th>Peran</th>
                <th>Terakhir masuk</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {memuat && baris.length === 0 && (
                <tr><td colSpan={4} className="panel-kosong">Memuat pengguna…</td></tr>
              )}
              {baris.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.nama}</strong>
                    {!p.aktif && (
                      <span className="panel-lencana panel-lencana--batal" style={{ marginLeft: 7 }}>nonaktif</span>
                    )}
                    <div style={{ fontSize: 11.5, color: "var(--redup)" }}>{p.email}</div>
                  </td>
                  <td>
                    <span className={`panel-lencana panel-lencana--${p.peran}`}>{p.peran}</span>
                  </td>
                  <td style={{ fontSize: 12.5 }}>{waktu(p.terakhir_masuk)}</td>
                  <td>
                    <div className="panel-tabel__aksi">
                      <button className="panel-tombol panel-tombol--kecil" onClick={() => sunting(p)}>
                        Ubah
                      </button>
                      <button className="panel-tombol panel-tombol--kecil" onClick={() => ubahAktif(p)}>
                        {p.aktif ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                      <button
                        className="panel-tombol panel-tombol--kecil panel-tombol--bahaya"
                        onClick={() => hapus(p)}
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
