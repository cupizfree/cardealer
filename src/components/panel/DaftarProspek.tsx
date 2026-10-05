"use client";

import { useCallback, useEffect, useState } from "react";
import { minta, waktu } from "@/lib/klien";
import {
  BarisKosong,
  BarisMemuat,
  INPUT,
  JudulKartu,
  KARTU,
  KisiKartu,
  Lencana,
  Medan,
  Pesan,
  SELECT,
  Stat,
  TABEL,
  TABEL_BUNGKUS,
  TD,
  TH,
  TOMBOL,
  TOMBOL_BAHAYA,
  TOMBOL_KECIL,
  TOMBOL_UTAMA,
} from "./ui";

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
  const [sibuk, setSibuk] = useState(false);

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
    setGalat(null);
    setSibuk(true);
    const h = await minta(`/api/prospek/${p.id}`, { method: "PATCH", body: JSON.stringify(ubah) });
    setSibuk(false);
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
    <div className="space-y-4">
      {galat && <Pesan jenis="galat">{galat}</Pesan>}
      {pesan && <Pesan jenis="sukses">{pesan}</Pesan>}

      <KisiKartu lebar={170}>
        {STATUS.slice(0, 4).map((s, i) => (
          <Stat
            key={s}
            label={s}
            angka={ringkasan[s] ?? 0}
            aksen={(["marf", "biru", "ungu", "hijau"] as const)[i]}
          />
        ))}
      </KisiKartu>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))]">
        <input
          className={`${INPUT} sm:col-span-2 lg:col-span-1`}
          placeholder="Cari nama, telepon, surel, pesan…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className={SELECT} value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="">Semua status</option>
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select className={SELECT} value={fSumber} onChange={(e) => setFSumber(e.target.value)}>
          <option value="">Semua sumber</option>
          {SUMBER.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="self-center text-[12.5px] font-medium text-redup sm:col-span-2 sm:justify-self-end lg:col-span-3">
          {total} prospek
        </span>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[1.35fr_1fr]">
        <div className={TABEL_BUNGKUS}>
          <table className={TABEL}>
            <thead>
              <tr>
                <th className={TH}>Nama</th>
                <th className={`${TH} hidden sm:table-cell`}>Kontak</th>
                <th className={`${TH} hidden md:table-cell`}>Sumber</th>
                <th className={TH}>Status</th>
                <th className={`${TH} text-right`}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {memuat && baris.length === 0 && <BarisMemuat kolom={5} apa="prospek" />}
              {!memuat && baris.length === 0 && (
                <BarisKosong kolom={5}>Belum ada prospek dengan filter ini.</BarisKosong>
              )}

              {baris.map((p) => (
                <tr
                  key={p.id}
                  className={`transition ${
                    pilih?.id === p.id ? "bg-marf-muda/60" : "hover:bg-[#fcfcfd]"
                  }`}
                >
                  <td className={TD}>
                    <strong className="font-semibold">{p.nama}</strong>
                    <div className="text-[11.5px] text-redup">{waktu(p.dibuat_pada)}</div>
                  </td>
                  <td className={`${TD} hidden text-[12.5px] sm:table-cell`}>
                    {p.telepon ?? "—"}
                    {p.email && <div className="marf-pecah text-redup">{p.email}</div>}
                  </td>
                  <td className={`${TD} hidden text-[12.5px] md:table-cell`}>{p.sumber}</td>
                  <td className={TD}>
                    <Lencana nilai={p.status} />
                    {p.nama_petugas && (
                      <div className="mt-1 text-[11px] text-redup">{p.nama_petugas}</div>
                    )}
                  </td>
                  <td className={TD}>
                    <div className="flex justify-end">
                      <button className={`${TOMBOL} ${TOMBOL_KECIL}`} onClick={() => buka(p)}>
                        Buka
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="xl:sticky xl:top-24">
          {!pilih ? (
            <div className={`${KARTU} px-5 py-14 text-center text-[13.5px] text-redup`}>
              Pilih satu prospek di sebelah kiri untuk melihat rinciannya.
            </div>
          ) : (
            <section className={KARTU}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-[16px] font-bold tracking-tight">{pilih.nama}</h2>
                  <p className="mt-0.5 text-[12.5px] text-redup">
                    {pilih.sumber} · masuk {waktu(pilih.dibuat_pada)}
                  </p>
                </div>
                <button className={`${TOMBOL} ${TOMBOL_KECIL} shrink-0`} onClick={() => setPilih(null)}>
                  Tutup
                </button>
              </div>

              <div className="mb-4 grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-lg border border-garis bg-[#fbfcfd] px-3.5 py-2.5">
                  <div className="mb-1 text-[10.5px] font-bold uppercase tracking-[0.07em] text-redup">
                    Telepon
                  </div>
                  <div className="text-[14px] font-semibold">{pilih.telepon ?? "—"}</div>
                </div>
                <div className="rounded-lg border border-garis bg-[#fbfcfd] px-3.5 py-2.5">
                  <div className="mb-1 text-[10.5px] font-bold uppercase tracking-[0.07em] text-redup">
                    Surel
                  </div>
                  <div className="marf-pecah text-[13px] font-semibold">{pilih.email ?? "—"}</div>
                </div>
              </div>

              {pilih.pesan && (
                <div className="mb-4">
                  <div className="mb-1.5 text-[11.5px] font-bold text-redup">PESAN</div>
                  <p className="rounded-lg border border-garis bg-[#fafbfc] px-3.5 py-3 text-[13.5px] leading-relaxed">
                    {pilih.pesan}
                  </p>
                </div>
              )}

              <Medan label="Status">
                <select
                  className={INPUT}
                  value={pilih.status}
                  disabled={sibuk}
                  onChange={(e) => {
                    const baru = e.target.value;
                    setPilih({ ...pilih, status: baru });
                    simpan(pilih, { status: baru });
                  }}
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Medan>

              <Medan label="Catatan internal">
                <textarea
                  className={`${INPUT} min-h-24 resize-y leading-relaxed`}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Hasil telepon, jadwal test drive, penawaran…"
                />
              </Medan>

              <div className="flex flex-wrap gap-2.5 border-t border-garis pt-4">
                <button
                  className={TOMBOL_UTAMA}
                  onClick={() => simpan(pilih, { catatan })}
                  disabled={sibuk}
                >
                  {sibuk ? "Menyimpan…" : "Simpan catatan"}
                </button>
                {peran === "admin" && (
                  <button className={`${TOMBOL_BAHAYA} ml-auto`} onClick={() => hapus(pilih)}>
                    Hapus
                  </button>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
