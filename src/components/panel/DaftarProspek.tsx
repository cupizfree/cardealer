"use client";

import { useCallback, useEffect, useState } from "react";
import { minta, waktu } from "@/lib/klien";

type Prospek = {
  id: number;
  nama: string;
  telepon: string | null;
  email: string | null;
  pesan: string | null;
  sumber: string;
  status: string;
  catatan: string | null;
  nama_petugas: string | null;
  dibuat_pada: string;
};

const STATUS = ["baru", "dihubungi", "terjadwal", "selesai", "batal"];
const SUMBER = ["kontak", "jual-mobil", "tukar-tambah", "detail-unit", "newsletter"];

export default function DaftarProspek({ peran }: { peran: "admin" | "staff" }) {
  const [baris, setBaris] = useState<Prospek[]>([]);
  const [ringkasan, setRingkasan] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [fStatus, setFStatus] = useState("");
  const [fSumber, setFSumber] = useState("");
  const [q, setQ] = useState("");
  const [pilih, setPilih] = useState<Prospek | null>(null);
  const [catatan, setCatatan] = useState("");
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);

  const muat = useCallback(async () => {
    setMemuat(true);
    const s = new URLSearchParams({ batas: "50" });
    if (fStatus) s.set("status", fStatus);
    if (fSumber) s.set("sumber", fSumber);
    if (q) s.set("q", q);

    const h = await minta<Prospek[]>(`/api/prospek?${s}`);
    if (h.ok) {
      setBaris(h.data);
      setTotal(Number(h.meta?.total ?? 0));
      setRingkasan((h.meta?.ringkasan as Record<string, number>) ?? {});
      setGalat(null);
    } else {
      setGalat(h.pesan);
    }
    setMemuat(false);
  }, [fStatus, fSumber, q]);

  useEffect(() => {
    muat();
  }, [muat]);

  function buka(p: Prospek) {
    setPilih(p);
    setCatatan(p.catatan ?? "");
    setPesan(null);
  }

  async function simpan(p: Prospek, ubah: Partial<{ status: string; catatan: string }>) {
    setPesan(null);
    const h = await minta(`/api/prospek/${p.id}`, {
      method: "PATCH",
      body: JSON.stringify(ubah),
    });
    if (!h.ok) {
      setGalat(h.pesan);
      return;
    }
    setPesan(`Prospek "${p.nama}" diperbarui.`);
    setPilih(null);
    muat();
  }

  async function hapus(p: Prospek) {
    if (!confirm(`Hapus prospek "${p.nama}"?`)) return;
    const h = await minta(`/api/prospek/${p.id}`, { method: "DELETE" });
    if (!h.ok) {
      setGalat(h.pesan);
      return;
    }
    setPesan(`Prospek "${p.nama}" dihapus.`);
    setPilih(null);
    muat();
  }

  return (
    <>
      {galat && <p className="panel-galat">{galat}</p>}
      {pesan && <p className="panel-sukses">{pesan}</p>}

      <div className="panel-kisi panel-kisi--4" style={{ marginBottom: 18 }}>
        {STATUS.slice(0, 4).map((s) => (
          <div key={s} className="panel-stat">
            <p className="panel-stat__label">{s}</p>
            <p className="panel-stat__angka">{ringkasan[s] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="panel-alat">
        <input
          placeholder="Cari nama, telepon, surel, pesan…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="">Semua status</option>
          {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={fSumber} onChange={(e) => setFSumber(e.target.value)}>
          <option value="">Semua sumber</option>
          {SUMBER.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="panel-alat__dorong" style={{ fontSize: 12.5, color: "var(--redup)" }}>
          {total} prospek
        </span>
      </div>

      <div className="panel-kisi panel-kisi--2" style={{ alignItems: "start" }}>
        <div className="panel-tabel-bungkus">
          <table className="panel-tabel">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Kontak</th>
                <th>Sumber</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {memuat && baris.length === 0 && (
                <tr><td colSpan={5} className="panel-kosong">Memuat prospek…</td></tr>
              )}
              {!memuat && baris.length === 0 && (
                <tr><td colSpan={5} className="panel-kosong">Belum ada prospek dengan filter ini.</td></tr>
              )}
              {baris.map((p) => (
                <tr key={p.id} style={pilih?.id === p.id ? { background: "#fdf2f3" } : undefined}>
                  <td>
                    <strong>{p.nama}</strong>
                    <div style={{ fontSize: 11.5, color: "var(--redup)" }}>{waktu(p.dibuat_pada)}</div>
                  </td>
                  <td style={{ fontSize: 12.5 }}>
                    {p.telepon ?? "—"}
                    {p.email && <div style={{ color: "var(--redup)" }}>{p.email}</div>}
                  </td>
                  <td style={{ fontSize: 12.5 }}>{p.sumber}</td>
                  <td>
                    <span className={`panel-lencana panel-lencana--${p.status}`}>{p.status}</span>
                    {p.nama_petugas && (
                      <div style={{ fontSize: 11, color: "var(--redup)", marginTop: 3 }}>{p.nama_petugas}</div>
                    )}
                  </td>
                  <td>
                    <div className="panel-tabel__aksi">
                      <button className="panel-tombol panel-tombol--kecil" onClick={() => buka(p)}>
                        Buka
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel-kartu">
          {!pilih ? (
            <p className="panel-kosong">Pilih satu prospek di sebelah kiri untuk melihat rinciannya.</p>
          ) : (
            <>
              <h2 className="panel-kartu__judul">{pilih.nama}</h2>
              <p className="panel-kartu__ket">
                {pilih.sumber} · masuk {waktu(pilih.dibuat_pada)}
              </p>

              <dl className="panel-rincian" style={{ marginBottom: 16 }}>
                <div>
                  <dt>Telepon</dt>
                  <dd>{pilih.telepon ?? "—"}</dd>
                </div>
                <div>
                  <dt>Surel</dt>
                  <dd style={{ fontSize: 12.5, wordBreak: "break-all" }}>{pilih.email ?? "—"}</dd>
                </div>
              </dl>

              {pilih.pesan && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11.5, color: "var(--redup)", fontWeight: 700, marginBottom: 5 }}>
                    PESAN
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13.5,
                      lineHeight: 1.65,
                      background: "#fafbfc",
                      border: "1px solid var(--garis)",
                      borderRadius: 9,
                      padding: 12,
                    }}
                  >
                    {pilih.pesan}
                  </p>
                </div>
              )}

              <label className="panel-medan">
                <span>Status</span>
                <select
                  value={pilih.status}
                  onChange={(e) => {
                    const baru = e.target.value;
                    setPilih({ ...pilih, status: baru });
                    simpan(pilih, { status: baru });
                  }}
                >
                  {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>

              <label className="panel-medan">
                <span>Catatan internal</span>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Hasil telepon, jadwal test drive, penawaran…"
                />
              </label>

              <div className="panel-aksi">
                <button
                  className="panel-tombol panel-tombol--utama"
                  onClick={() => simpan(pilih, { catatan })}
                >
                  Simpan catatan
                </button>
                <button className="panel-tombol" onClick={() => setPilih(null)}>
                  Tutup
                </button>
                {peran === "admin" && (
                  <button
                    className="panel-tombol panel-tombol--bahaya"
                    onClick={() => hapus(pilih)}
                    style={{ marginLeft: "auto" }}
                  >
                    Hapus
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
