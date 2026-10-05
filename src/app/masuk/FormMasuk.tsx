"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { minta } from "@/lib/klien";

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
    <form onSubmit={kirim} className="panel-form">
      <label className="panel-medan">
        <span>Surel</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@marf.id"
          autoComplete="username"
          required
          autoFocus
        />
      </label>

      <label className="panel-medan">
        <span>Kata sandi</span>
        <div className="panel-medan__sandi">
          <input
            type={lihat ? "text" : "password"}
            value={sandi}
            onChange={(e) => setSandi(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          <button type="button" onClick={() => setLihat((v) => !v)} aria-label="Tampilkan kata sandi">
            {lihat ? "Sembunyi" : "Lihat"}
          </button>
        </div>
      </label>

      {galat && <p className="panel-galat">{galat}</p>}

      <button type="submit" className="panel-tombol panel-tombol--utama" disabled={sibuk}>
        {sibuk ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}
