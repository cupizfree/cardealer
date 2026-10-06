"use client";

import { useState } from "react";
import Link from "next/link";
import { minta } from "@/lib/klien";
import { INPUT, Medan, Pesan, TOMBOL_UTAMA } from "@/components/panel/ui";

export default function FormLupaSandi() {
  const [email, setEmail] = useState("");
  const [galat, setGalat] = useState<string | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    setGalat(null);
    setPesan(null);
    setSibuk(true);

    const h = await minta<{ pesan: string; dikirim: boolean; alasan?: string }>("/api/auth/lupa-sandi", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    setSibuk(false);

    if (!h.ok) {
      setGalat(h.pesan);
      return;
    }

    // Kalau penyedia surel belum diatur, katakan terus terang — jangan biarkan
    // pengguna menunggu surel yang tidak akan datang.
    setPesan(
      h.data.dikirim
        ? h.data.pesan
        : `${h.data.pesan} Catatan: pengiriman surel belum aktif, jadi hubungi admin untuk mendapatkan tautannya.`,
    );
  }

  return (
    <form onSubmit={kirim}>
      {galat && <Pesan jenis="galat">{galat}</Pesan>}
      {pesan && <Pesan jenis="sukses">{pesan}</Pesan>}

      <Medan label="Surel" wajib>
        <input
          className={INPUT}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@marf.id"
          autoComplete="username"
          required
          autoFocus
        />
      </Medan>

      <button type="submit" className={`${TOMBOL_UTAMA} w-full`} disabled={sibuk}>
        {sibuk ? "Mengirim…" : "Kirim tautan atur ulang"}
      </button>

      <p className="mt-4 text-center text-[12.5px]">
        <Link href="/masuk" className="font-semibold text-marf hover:underline">
          Kembali ke halaman masuk
        </Link>
      </p>
    </form>
  );
}
