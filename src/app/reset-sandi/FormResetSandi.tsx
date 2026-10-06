"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { minta } from "@/lib/klien";
import { INPUT, Medan, Pesan, TOMBOL_UTAMA } from "@/components/panel/ui";

const MIN_PANJANG = 8;

export default function FormResetSandi({ token }: { token: string }) {
  const router = useRouter();
  const [sandi, setSandi] = useState("");
  const [ulangi, setUlangi] = useState("");
  const [lihat, setLihat] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    setGalat(null);
    setPesan(null);

    if (sandi.length < MIN_PANJANG) {
      setGalat(`Kata sandi minimal ${MIN_PANJANG} karakter.`);
      return;
    }
    if (sandi !== ulangi) {
      setGalat("Kedua kata sandi belum sama.");
      return;
    }

    setSibuk(true);
    const h = await minta<{ pesan: string }>("/api/auth/reset-sandi", {
      method: "POST",
      body: JSON.stringify({ token, kata_sandi: sandi }),
    });
    setSibuk(false);

    if (!h.ok) {
      setGalat(h.pesan);
      return;
    }

    setPesan(h.data.pesan);
    setTimeout(() => {
      router.replace("/masuk");
      router.refresh();
    }, 1600);
  }

  return (
    <form onSubmit={kirim}>
      {galat && <Pesan jenis="galat">{galat}</Pesan>}
      {pesan && <Pesan jenis="sukses">{pesan}</Pesan>}

      <Medan label="Kata sandi baru" wajib>
        <div className="relative">
          <input
            className={`${INPUT} pr-20`}
            type={lihat ? "text" : "password"}
            value={sandi}
            onChange={(e) => setSandi(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            minLength={MIN_PANJANG}
            required
            autoFocus
          />
          <button
            type="button"
            onClick={() => setLihat((v) => !v)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md px-2.5 py-1 text-[12px] font-semibold text-redup hover:bg-[#f2f4f7] hover:text-tinta"
          >
            {lihat ? "Sembunyi" : "Lihat"}
          </button>
        </div>
      </Medan>

      <Medan label="Ulangi kata sandi baru" wajib>
        <input
          className={INPUT}
          type={lihat ? "text" : "password"}
          value={ulangi}
          onChange={(e) => setUlangi(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          minLength={MIN_PANJANG}
          required
        />
      </Medan>

      <button type="submit" className={`${TOMBOL_UTAMA} w-full`} disabled={sibuk || Boolean(pesan)}>
        {sibuk ? "Menyimpan…" : "Simpan kata sandi baru"}
      </button>

      <p className="mt-4 text-center text-[12.5px]">
        <Link href="/masuk" className="font-semibold text-marf hover:underline">
          Kembali ke halaman masuk
        </Link>
      </p>
    </form>
  );
}
