"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { minta } from "@/lib/klien";
import { INPUT, Medan, Pesan, TOMBOL_UTAMA } from "@/components/panel/ui";

export default function FormMasuk() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sandi, setSandi] = useState("");
  const [lihat, setLihat] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    setGalat(null);
    setSibuk(true);

    const h = await minta<{ pengguna: { peran: string; nama: string } }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, kata_sandi: sandi }),
    });

    if (!h.ok) {
      setGalat(h.pesan);
      setSibuk(false);
      return;
    }

    router.replace(h.data.pengguna.peran === "admin" ? "/admin" : "/staff");
    router.refresh();
  }

  return (
    <form onSubmit={kirim}>
      {galat && <Pesan jenis="galat">{galat}</Pesan>}

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

      <Medan label="Kata sandi" wajib>
        <div className="relative">
          <input
            className={`${INPUT} pr-20`}
            type={lihat ? "text" : "password"}
            value={sandi}
            onChange={(e) => setSandi(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setLihat((v) => !v)}
            aria-label={lihat ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[12px] font-semibold text-redup transition hover:bg-[#f2f4f7] hover:text-tinta"
          >
            {lihat ? "Sembunyi" : "Lihat"}
          </button>
        </div>
      </Medan>

      <button type="submit" className={`${TOMBOL_UTAMA} w-full py-2.5 text-sm`} disabled={sibuk}>
        {sibuk ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}
