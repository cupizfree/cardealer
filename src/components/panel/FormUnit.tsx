"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { minta } from "@/lib/klien";

type Dealer = { id: number; nama: string; kota: string | null };

export type NilaiUnit = {
  judul: string;
  merek: string;
  model: string;
  tahun: string;
  harga: string;
  harga_cicilan: string;
  kilometer: string;
  transmisi: string;
  bahan_bakar: string;
  warna: string;
  lokasi: string;
  deskripsi: string;
  status: string;
  unggulan: boolean;
  dealer_id: string;
};

const KOSONG: NilaiUnit = {
  judul: "",
  merek: "",
  model: "",
  tahun: "",
  harga: "",
  harga_cicilan: "",
  kilometer: "",
  transmisi: "Otomatis",
  bahan_bakar: "Bensin",
  warna: "",
  lokasi: "Purwokerto, Jawa Tengah",
  deskripsi: "",
  status: "tersedia",
  unggulan: false,
  dealer_id: "",
};

const MEREK = [
  "Toyota", "Honda", "Daihatsu", "Suzuki", "Mitsubishi", "Nissan",
  "Mazda", "Hyundai", "Wuling", "Chery", "BMW", "Mercedes-Benz",
];

export default function FormUnit({
  awal,
  id,
}: {
  awal?: Partial<NilaiUnit>;
  id?: number;
}) {
  const router = useRouter();
  const [n, setN] = useState<NilaiUnit>({ ...KOSONG, ...awal });
  const [dealer, setDealer] = useState<Dealer[]>([]);
  const [galat, setGalat] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);
  const [hapusSibuk, setHapusSibuk] = useState(false);

  useEffect(() => {
    minta<Dealer[]>("/api/dealer").then((h) => {
      if (h.ok) setDealer(h.data);
    });
  }, []);

  function set<K extends keyof NilaiUnit>(k: K, v: NilaiUnit[K]) {
    setN((l) => ({ ...l, [k]: v }));
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setGalat(null);
    setSibuk(true);

    const badan: Record<string, unknown> = {
      judul: n.judul,
      merek: n.merek,
      model: n.model || null,
      tahun: n.tahun ? Number(n.tahun) : null,
      harga: Number(String(n.harga).replace(/[^0-9]/g, "")) || 0,
      harga_cicilan: n.harga_cicilan || null,
      kilometer: n.kilometer || null,
      transmisi: n.transmisi || null,
      bahan_bakar: n.bahan_bakar || null,
      warna: n.warna || null,
      lokasi: n.lokasi || null,
      deskripsi: n.deskripsi || null,
      status: n.status,
      unggulan: n.unggulan,
      dealer_id: n.dealer_id ? Number(n.dealer_id) : null,
    };

    const h = id
      ? await minta(`/api/unit/${id}`, { method: "PATCH", body: JSON.stringify(badan) })
      : await minta("/api/unit", { method: "POST", body: JSON.stringify(badan) });

    if (!h.ok) {
      setGalat(h.pesan);
      setSibuk(false);
      return;
    }

    router.push("/admin/unit");
    router.refresh();
  }

  async function hapus() {
    if (!id) return;
    if (!confirm(`Hapus unit "${n.judul}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setHapusSibuk(true);
    const h = await minta(`/api/unit/${id}`, { method: "DELETE" });
    if (!h.ok) {
      setGalat(h.pesan);
      setHapusSibuk(false);
      return;
    }
    router.push("/admin/unit");
    router.refresh();
  }

  return (
    <form onSubmit={simpan} className="panel-kartu" style={{ maxWidth: 880 }}>
      {galat && <p className="panel-galat">{galat}</p>}

      <div className="panel-baris">
        <label className="panel-medan">
          <span>Judul unit *</span>
          <input value={n.judul} onChange={(e) => set("judul", e.target.value)} placeholder="Toyota Avanza 1.5 G 2021" required />
        </label>

        <label className="panel-medan">
          <span>Merek *</span>
          <input
            value={n.merek}
            onChange={(e) => set("merek", e.target.value)}
            placeholder="Toyota"
            list="daftar-merek"
            required
          />
          <datalist id="daftar-merek">
            {MEREK.map((m) => <option key={m} value={m} />)}
          </datalist>
        </label>
      </div>

      <div className="panel-baris">
        <label className="panel-medan">
          <span>Model</span>
          <input value={n.model} onChange={(e) => set("model", e.target.value)} placeholder="Avanza 1.5 G" />
        </label>

        <label className="panel-medan">
          <span>Tahun</span>
          <input
            type="number"
            min={1900}
            max={2100}
            value={n.tahun}
            onChange={(e) => set("tahun", e.target.value)}
            placeholder="2021"
          />
        </label>
      </div>

      <div className="panel-baris">
        <label className="panel-medan">
          <span>Harga (Rp) *</span>
          <input
            value={n.harga}
            onChange={(e) => set("harga", e.target.value)}
            placeholder="195000000"
            inputMode="numeric"
            required
          />
        </label>

        <label className="panel-medan">
          <span>Cicilan per bulan</span>
          <input value={n.harga_cicilan} onChange={(e) => set("harga_cicilan", e.target.value)} placeholder="Rp 3.030.000/bln" />
        </label>
      </div>

      <div className="panel-baris">
        <label className="panel-medan">
          <span>Kilometer</span>
          <input value={n.kilometer} onChange={(e) => set("kilometer", e.target.value)} placeholder="32.000 km" />
        </label>

        <label className="panel-medan">
          <span>Transmisi</span>
          <select value={n.transmisi} onChange={(e) => set("transmisi", e.target.value)}>
            <option value="Otomatis">Otomatis</option>
            <option value="Manual">Manual</option>
            <option value="CVT">CVT</option>
          </select>
        </label>
      </div>

      <div className="panel-baris">
        <label className="panel-medan">
          <span>Bahan bakar</span>
          <select value={n.bahan_bakar} onChange={(e) => set("bahan_bakar", e.target.value)}>
            <option value="Bensin">Bensin</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Listrik">Listrik</option>
          </select>
        </label>

        <label className="panel-medan">
          <span>Warna</span>
          <input value={n.warna} onChange={(e) => set("warna", e.target.value)} placeholder="Putih" />
        </label>
      </div>

      <div className="panel-baris">
        <label className="panel-medan">
          <span>Status</span>
          <select value={n.status} onChange={(e) => set("status", e.target.value)}>
            <option value="draf">Draf</option>
            <option value="tersedia">Tersedia</option>
            <option value="dipesan">Dipesan</option>
            <option value="terjual">Terjual</option>
          </select>
        </label>

        <label className="panel-medan">
          <span>Dealer</span>
          <select value={n.dealer_id} onChange={(e) => set("dealer_id", e.target.value)}>
            <option value="">— tanpa dealer —</option>
            {dealer.map((d) => (
              <option key={d.id} value={d.id}>{d.nama}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="panel-medan">
        <span>Lokasi</span>
        <input value={n.lokasi} onChange={(e) => set("lokasi", e.target.value)} placeholder="Purwokerto, Jawa Tengah" />
      </label>

      <label className="panel-medan">
        <span>Deskripsi</span>
        <textarea
          value={n.deskripsi}
          onChange={(e) => set("deskripsi", e.target.value)}
          placeholder="Kondisi mesin, riwayat servis, kelengkapan dokumen…"
        />
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 18, fontSize: 13.5 }}>
        <input
          type="checkbox"
          checked={n.unggulan}
          onChange={(e) => set("unggulan", e.target.checked)}
          style={{ width: "auto" }}
        />
        Tandai sebagai unit unggulan
      </label>

      <div className="panel-aksi">
        <button type="submit" className="panel-tombol panel-tombol--utama" disabled={sibuk}>
          {sibuk ? "Menyimpan…" : id ? "Simpan perubahan" : "Simpan unit"}
        </button>
        <button type="button" className="panel-tombol" onClick={() => router.push("/admin/unit")}>
          Batal
        </button>
        {id && (
          <button
            type="button"
            className="panel-tombol panel-tombol--bahaya"
            onClick={hapus}
            disabled={hapusSibuk}
            style={{ marginLeft: "auto" }}
          >
            {hapusSibuk ? "Menghapus…" : "Hapus unit"}
          </button>
        )}
      </div>
    </form>
  );
}
