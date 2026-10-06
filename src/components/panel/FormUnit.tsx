"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { minta } from "@/lib/klien";
import {
  INPUT,
  KARTU,
  Medan,
  Pesan,
  TOMBOL,
  TOMBOL_BAHAYA,
  TOMBOL_UTAMA,
} from "./ui";

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
  /** Daftar alamat gambar. Yang pertama dipakai sebagai gambar utama. */
  galeri: string[];
  /**
   * Fitur per kategori. Kuncinya WAJIB tetap bahasa Inggris (`Exterior`,
   * `Interior`, `Safety`, `Mechanical`, `Technology`, `Other`) karena kunci itu
   * dipakai sebagai nama kolom di JSON `fitur` pada basis data dan
   * dibandingkan di `active === kunci` oleh `FeatureTabs`. Menerjemahkan
   * kuncinya membuat data yang sudah tersimpan tidak lagi cocok — persis
   * jebakan `ProductTabs.tsx` dulu. Yang diterjemahkan hanya labelnya.
   */
  fitur: Record<string, string[]>;
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
  galeri: [],
  fitur: {},
};

/**
 * Kunci di sini HARUS sama persis dengan `KATEGORI_FITUR` di `src/lib/katalog.ts`
 * dan `KATEGORI` di `FeatureTabs.tsx`. Label boleh berubah; kunci tidak.
 */
const KATEGORI_FITUR: Array<{ kunci: string; label: string; contoh: string }> = [
  { kunci: "Exterior", label: "Eksterior", contoh: "Lampu depan LED\nVelg alloy 16 inci" },
  { kunci: "Interior", label: "Interior", contoh: "Kursi 7 penumpang\nAC double blower" },
  { kunci: "Safety", label: "Keselamatan", contoh: "Dual SRS airbag\nABS + EBD" },
  { kunci: "Mechanical", label: "Mekanis", contoh: "Mesin 1.5L Dual VVT-i\nTransmisi CVT" },
  { kunci: "Technology", label: "Teknologi", contoh: "Layar sentuh 9 inci\nApple CarPlay" },
  { kunci: "Other", label: "Lainnya", contoh: "Buku servis lengkap\nBan cadangan" },
];

const MEREK = [
  "Toyota", "Honda", "Daihatsu", "Suzuki", "Mitsubishi", "Nissan",
  "Mazda", "Hyundai", "Wuling", "Chery", "BMW", "Mercedes-Benz",
];

const GRID = "grid gap-x-4 sm:grid-cols-2";

const TOMBOL_GALERI =
  "rounded-md border border-garis px-2 py-1 text-[12px] leading-none text-redup transition hover:border-[#c3c9d4] hover:text-[#1c1c1c] disabled:opacity-30 disabled:hover:border-garis disabled:hover:text-redup";

export default function FormUnit({
  awal,
  id,
}: {
  awal?: Partial<NilaiUnit>;
  id?: number;
}) {
  const router = useRouter();
  const [n, setN] = useState<NilaiUnit>({
    ...KOSONG,
    ...awal,
    galeri: awal?.galeri ?? KOSONG.galeri,
  });
  const [dealer, setDealer] = useState<Dealer[]>([]);
  const [galat, setGalat] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);
  const [hapusSibuk, setHapusSibuk] = useState(false);
  const [urlBaru, setUrlBaru] = useState("");
  const [unggahSibuk, setUnggahSibuk] = useState(false);
  const [unggahGalat, setUnggahGalat] = useState<string | null>(null);

  useEffect(() => {
    minta<Dealer[]>("/api/dealer").then((h) => {
      if (h.ok) setDealer(h.data);
    });
  }, []);

  function set<K extends keyof NilaiUnit>(k: K, v: NilaiUnit[K]) {
    setN((l) => ({ ...l, [k]: v }));
  }

  // ── Galeri gambar ─────────────────────────────────────────────────────────
  // Gambar disimpan sebagai daftar alamat di kolom `galeri` (JSON). Alamatnya
  // bisa berupa berkas di dalam situs (/assets/images/…) atau gambar yang
  // diunggah dari ponsel lewat /api/unggah, yang disajikan kembali sebagai
  // /api/gambar/<nama>.

  function tambahGambar() {
    const u = urlBaru.trim();
    if (!u) return;
    setN((l) => ({ ...l, galeri: [...l.galeri, u] }));
    setUrlBaru("");
  }

  // Unggah berkas. `fetch` dipakai langsung, bukan pembungkus `minta`, karena
  // `minta` memaksa Content-Type: application/json — itu merusak multipart
  // (peramban harus menuliskan sendiri batas/boundary-nya).
  async function unggahBerkas(daftar: FileList | null) {
    if (!daftar || daftar.length === 0) return;
    setUnggahGalat(null);
    setUnggahSibuk(true);

    const berhasil: string[] = [];
    for (const berkas of Array.from(daftar)) {
      const badan = new FormData();
      badan.append("berkas", berkas);
      try {
        const r = await fetch("/api/unggah", { method: "POST", body: badan, credentials: "same-origin" });
        const j = (await r.json().catch(() => null)) as
          | { ok?: boolean; data?: { alamat?: string }; error?: { pesan?: string } }
          | null;
        if (j?.ok && j.data?.alamat) berhasil.push(j.data.alamat);
        else setUnggahGalat(j?.error?.pesan ?? `Gagal mengunggah ${berkas.name} (HTTP ${r.status}).`);
      } catch {
        setUnggahGalat(`Tidak bisa mengunggah ${berkas.name}.`);
      }
    }

    if (berhasil.length) setN((l) => ({ ...l, galeri: [...l.galeri, ...berhasil] }));
    setUnggahSibuk(false);
  }

  function buangGambar(i: number) {
    setN((l) => ({ ...l, galeri: l.galeri.filter((_, j) => j !== i) }));
  }

  function geserGambar(i: number, arah: number) {
    setN((l) => {
      const g = [...l.galeri];
      const j = i + arah;
      if (j < 0 || j >= g.length) return l;
      [g[i], g[j]] = [g[j], g[i]];
      return { ...l, galeri: g };
    });
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
      galeri: n.galeri,
      fitur: n.fitur,
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

  const judulBagian = "mb-3 border-b border-garis pb-2 text-[12px] font-bold uppercase tracking-[0.07em] text-redup";

  return (
    <form onSubmit={simpan} className={`${KARTU} max-w-3xl`}>
      {galat && <Pesan jenis="galat">{galat}</Pesan>}

      <p className={judulBagian}>Identitas kendaraan</p>

      <Medan label="Judul unit" wajib>
        <input
          className={INPUT}
          value={n.judul}
          onChange={(e) => set("judul", e.target.value)}
          placeholder="Toyota Avanza 1.5 G 2021"
          required
        />
      </Medan>

      <div className={GRID}>
        <Medan label="Merek" wajib>
          <input
            className={INPUT}
            value={n.merek}
            onChange={(e) => set("merek", e.target.value)}
            placeholder="Toyota"
            list="daftar-merek"
            required
          />
          <datalist id="daftar-merek">
            {MEREK.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </Medan>

        <Medan label="Model">
          <input
            className={INPUT}
            value={n.model}
            onChange={(e) => set("model", e.target.value)}
            placeholder="Avanza 1.5 G"
          />
        </Medan>
      </div>

      <div className={GRID}>
        <Medan label="Tahun">
          <input
            className={INPUT}
            type="number"
            min={1900}
            max={2100}
            value={n.tahun}
            onChange={(e) => set("tahun", e.target.value)}
            placeholder="2021"
          />
        </Medan>

        <Medan label="Warna">
          <input
            className={INPUT}
            value={n.warna}
            onChange={(e) => set("warna", e.target.value)}
            placeholder="Putih"
          />
        </Medan>
      </div>

      <div className="mt-6">
        <p className={judulBagian}>Harga & kondisi</p>

        <div className={GRID}>
          <Medan label="Harga (Rp)" wajib>
            <input
              className={INPUT}
              value={n.harga}
              onChange={(e) => set("harga", e.target.value)}
              placeholder="195000000"
              inputMode="numeric"
              required
            />
          </Medan>

          <Medan label="Cicilan per bulan">
            <input
              className={INPUT}
              value={n.harga_cicilan}
              onChange={(e) => set("harga_cicilan", e.target.value)}
              placeholder="Rp 3.030.000/bln"
            />
          </Medan>
        </div>

        <div className={GRID}>
          <Medan label="Kilometer">
            <input
              className={INPUT}
              value={n.kilometer}
              onChange={(e) => set("kilometer", e.target.value)}
              placeholder="32.000 km"
            />
          </Medan>

          <Medan label="Transmisi">
            <select
              className={INPUT}
              value={n.transmisi}
              onChange={(e) => set("transmisi", e.target.value)}
            >
              <option value="Otomatis">Otomatis</option>
              <option value="Manual">Manual</option>
              <option value="CVT">CVT</option>
            </select>
          </Medan>
        </div>

        <div className={GRID}>
          <Medan label="Bahan bakar">
            <select
              className={INPUT}
              value={n.bahan_bakar}
              onChange={(e) => set("bahan_bakar", e.target.value)}
            >
              <option value="Bensin">Bensin</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Listrik">Listrik</option>
            </select>
          </Medan>

          <Medan label="Lokasi">
            <input
              className={INPUT}
              value={n.lokasi}
              onChange={(e) => set("lokasi", e.target.value)}
              placeholder="Purwokerto, Jawa Tengah"
            />
          </Medan>
        </div>
      </div>

      <div className="mt-6">
        <p className={judulBagian}>Gambar unit</p>
        <p className="mb-3 text-[12.5px] leading-relaxed text-redup">
          Gambar pertama dipakai sebagai gambar utama. Unggah langsung dari ponsel (JPEG, PNG, WebP,
          GIF — maksimal 8 MB), atau tempel alamat gambar.
        </p>

        <div className="mb-3 flex flex-wrap gap-2">
          <label
            className={`${TOMBOL} ${unggahSibuk ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
          >
            {unggahSibuk ? "Mengunggah…" : "Unggah gambar"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                unggahBerkas(e.target.files);
                e.target.value = "";
              }}
            />
          </label>

          {/* Di ponsel, `capture` membuka kamera langsung, bukan galeri. */}
          <label
            className={`${TOMBOL_GALERI} px-3 py-2 text-[13px] ${unggahSibuk ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
          >
            Ambil foto
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                unggahBerkas(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        {unggahGalat && (
          <p className="mb-3 rounded-lg border border-marf bg-marf-muda px-3 py-2 text-[12.5px] text-marf-tua">
            {unggahGalat}
          </p>
        )}

        {n.galeri.length === 0 ? (
          <p className="mb-3 rounded-lg border border-dashed border-garis px-3 py-4 text-center text-[12.5px] text-redup">
            Belum ada gambar.
          </p>
        ) : (
          <ul className="mb-3 flex flex-col gap-2">
            {n.galeri.map((src, i) => (
              <li
                key={`${src}-${i}`}
                className="flex items-center gap-3 rounded-lg border border-garis bg-[#fcfcfd] p-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-12 w-16 shrink-0 rounded border border-garis bg-white object-cover"
                />
                <span className="marf-pecah min-w-0 flex-1 text-[12px] text-redup">{src}</span>
                {i === 0 && (
                  <span className="whitespace-nowrap rounded-full bg-marf-muda px-2 py-[2px] text-[10px] font-bold uppercase tracking-wide text-marf-tua">
                    utama
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => geserGambar(i, -1)}
                  disabled={i === 0}
                  aria-label="Naikkan gambar"
                  className={TOMBOL_GALERI}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => geserGambar(i, 1)}
                  disabled={i === n.galeri.length - 1}
                  aria-label="Turunkan gambar"
                  className={TOMBOL_GALERI}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => buangGambar(i)}
                  aria-label="Hapus gambar"
                  className="rounded-md border border-garis px-2 py-1 text-[12px] leading-none text-marf transition hover:border-marf hover:bg-marf-muda"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <input
            className={INPUT}
            value={urlBaru}
            onChange={(e) => setUrlBaru(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                tambahGambar();
              }
            }}
            placeholder="/assets/images/card/card-1.jpg"
            aria-label="Alamat gambar baru"
          />
          <button type="button" className={TOMBOL} onClick={tambahGambar}>
            Tambah
          </button>
        </div>
      </div>

      <div className="mt-6">
        <p className={judulBagian}>Fitur</p>
        <p className="mb-4 text-[12.5px] leading-relaxed text-redup">
          Satu fitur per baris. Kategori yang dibiarkan kosong tidak akan tampil
          di halaman unit — lebih baik kosong daripada diisi fitur yang bukan
          milik mobil ini.
        </p>

        <div className="grid gap-x-4 sm:grid-cols-2">
          {KATEGORI_FITUR.map(({ kunci, label, contoh }) => (
            <Medan key={kunci} label={label}>
              <textarea
                className={`${INPUT} min-h-20 resize-y leading-relaxed`}
                value={(n.fitur[kunci] ?? []).join("\n")}
                onChange={(e) =>
                  setN((l) => ({
                    ...l,
                    fitur: {
                      ...l.fitur,
                      [kunci]: e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    },
                  }))
                }
                placeholder={contoh}
              />
            </Medan>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className={judulBagian}>Penempatan</p>

        <div className={GRID}>
          <Medan label="Status">
            <select
              className={INPUT}
              value={n.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="draf">Draf</option>
              <option value="tersedia">Tersedia</option>
              <option value="dipesan">Dipesan</option>
              <option value="terjual">Terjual</option>
            </select>
          </Medan>

          <Medan label="Dealer">
            <select
              className={INPUT}
              value={n.dealer_id}
              onChange={(e) => set("dealer_id", e.target.value)}
            >
              <option value="">— tanpa dealer —</option>
              {dealer.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
          </Medan>
        </div>

        <Medan label="Deskripsi">
          <textarea
            className={`${INPUT} min-h-24 resize-y leading-relaxed`}
            value={n.deskripsi}
            onChange={(e) => set("deskripsi", e.target.value)}
            placeholder="Kondisi mesin, riwayat servis, kelengkapan dokumen…"
          />
        </Medan>

        <label className="mb-4 flex cursor-pointer items-center gap-2.5 text-[13.5px]">
          <input
            type="checkbox"
            checked={n.unggulan}
            onChange={(e) => set("unggulan", e.target.checked)}
            className="h-4 w-4 accent-marf"
          />
          Tandai sebagai unit unggulan
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-garis pt-5">
        <button type="submit" className={TOMBOL_UTAMA} disabled={sibuk}>
          {sibuk ? "Menyimpan…" : id ? "Simpan perubahan" : "Simpan unit"}
        </button>
        <button type="button" className={TOMBOL} onClick={() => router.push("/admin/unit")}>
          Batal
        </button>
        {id && (
          <button
            type="button"
            className={`${TOMBOL_BAHAYA} ml-auto`}
            onClick={hapus}
            disabled={hapusSibuk}
          >
            {hapusSibuk ? "Menghapus…" : "Hapus unit"}
          </button>
        )}
      </div>
    </form>
  );
}
