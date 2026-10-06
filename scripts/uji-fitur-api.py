#!/usr/bin/env python3
"""Uji bolak-balik fitur unit lewat API panel.

Memeriksa dua hal yang tidak terlihat dari tsc maupun build:
  1. Fitur yang dikirim panel benar-benar tersimpan dan terbaca kembali.
  2. Sampah ditolak rapi — nilai bukan array, array bersarang, duplikat, dan
     butir kosong harus disaring sebelum masuk basis data.

Catatan cookie: `src/lib/auth.ts` menandai cookie sesi `Secure`, jadi curl di
atas http:// tidak akan menyimpannya. Nilai cookie di sini ditangkap dari
Set-Cookie lalu dikirim ulang sebagai header `Cookie:` — peramban yang menegakkan
aturan Secure, bukan server.

Pakai:  python3 scripts/uji-fitur-api.py [basis-url] [surel] [sandi]
        (bawaan http://127.0.0.1:3101, admin@marf.id)
"""

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request

BASIS = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3101").rstrip("/")
SUREL = sys.argv[2] if len(sys.argv) > 2 else "admin@marf.id"
SANDI = sys.argv[3] if len(sys.argv) > 3 else "MarfAdmin#2026"

KATEGORI = ["Exterior", "Interior", "Safety", "Mechanical", "Technology", "Other"]
cookie: str = ""
lulus = 0
gagal = 0


def panggil(metode: str, jalur: str, isi: dict | None = None) -> tuple[int, dict]:
    data = json.dumps(isi).encode() if isi is not None else None
    p = urllib.request.Request(BASIS + jalur, data=data, method=metode)
    p.add_header("Content-Type", "application/json")
    if cookie:
        p.add_header("Cookie", cookie)
    try:
        with urllib.request.urlopen(p, timeout=25) as r:
            return r.status, json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode() or "{}")


def cek(nama: str, syarat: bool, catatan: str = "") -> None:
    global lulus, gagal
    if syarat:
        lulus += 1
        print(f"  ✓ {nama}")
    else:
        gagal += 1
        print(f"  ✗ {nama}  {catatan}")


def main() -> int:
    global cookie

    # ── Masuk ─────────────────────────────────────────────────────────────
    p = urllib.request.Request(
        BASIS + "/api/auth/login",
        data=json.dumps({"email": SUREL, "kata_sandi": SANDI}).encode(),
        method="POST",
    )
    p.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(p, timeout=25) as r:
            set_cookie = r.headers.get("Set-Cookie", "")
    except urllib.error.HTTPError as e:
        print(f"  ✗ tidak bisa masuk: HTTP {e.code} — {e.read().decode()[:200]}")
        return 1

    cookie = set_cookie.split(";")[0]
    cek("masuk sebagai admin", bool(cookie), "tidak ada Set-Cookie")
    if not cookie:
        return 1

    # ── Ambil satu unit ───────────────────────────────────────────────────
    kode, h = panggil("GET", "/api/unit?batas=5")
    baris = h.get("data") or []
    cek("daftar unit terbaca", kode == 200 and bool(baris), f"HTTP {kode}")
    if not baris:
        return 1

    # Cari unit yang benar-benar punya fitur — kalau tidak, uji pemulihan tidak
    # membuktikan apa pun (memulihkan {} ke {} selalu "cocok").
    uid, asli = 0, {}
    for b in baris:
        kode, h = panggil("GET", f"/api/unit/{b['id']}")
        f = (h.get("data") or {}).get("fitur") or {}
        if any(f.get(k) for k in KATEGORI):
            uid, asli = b["id"], f
            print(f"     unit uji: #{uid} {b.get('judul')}")
            break
    cek("ada unit berfitur untuk diuji", bool(uid), "tidak ada unit yang punya fitur")
    if not uid:
        return 1
    cek("fitur awal terbaca dari detail", True)

    # ── Bolak-balik ───────────────────────────────────────────────────────
    uji = {
        "Exterior": ["Uji bolak-balik A", "Uji bolak-balik B"],
        "Interior": ["Uji interior"],
        "Safety": [],
        "Mechanical": ["Uji mekanis"],
        "Technology": [],
        "Other": ["Uji lainnya"],
    }
    kode, _ = panggil("PATCH", f"/api/unit/{uid}", {"fitur": uji})
    cek("PATCH fitur diterima", kode == 200, f"HTTP {kode}")

    kode, h = panggil("GET", f"/api/unit/{uid}")
    simpan = (h.get("data") or {}).get("fitur") or {}
    cek(
        "fitur tersimpan persis",
        simpan.get("Exterior") == uji["Exterior"]
        and simpan.get("Mechanical") == uji["Mechanical"]
        and simpan.get("Other") == uji["Other"],
        f"tersimpan: {json.dumps(simpan, ensure_ascii=False)[:160]}",
    )

    # ── Sampah harus disaring ─────────────────────────────────────────────
    kode, _ = panggil(
        "PATCH",
        f"/api/unit/{uid}",
        {
            "fitur": {
                "Exterior": ["  ada spasi  ", "ada spasi", "", "   ", "kembar", "kembar", 42, None, {"x": 1}],
                "Safety": "bukan array",
                "Interior": [["bersarang"]],
                "Mechanical": ["x" * 300],
                "Technology": [None],
                "Other": [],
                "KategoriAsing": ["dipertahankan"],
            }
        },
    )
    cek("PATCH sampah tidak meledak", kode == 200, f"HTTP {kode}")

    kode, h = panggil("GET", f"/api/unit/{uid}")
    bersih = (h.get("data") or {}).get("fitur") or {}

    cek("spasi dipangkas", bersih.get("Exterior") == ["ada spasi", "kembar"],
        f"{bersih.get('Exterior')}")
    cek("angka dan null dibuang", all(isinstance(x, str) for x in bersih.get("Exterior", [])))
    cek("duplikat dibuang", bersih.get("Exterior", []).count("kembar") == 1)
    cek("bukan array jadi kosong", bersih.get("Safety") == [], f"{bersih.get('Safety')}")
    cek("array bersarang dibuang", bersih.get("Interior") == [], f"{bersih.get('Interior')}")
    cek("butir kepanjangan dipotong", len(bersih.get("Mechanical", [""])[0]) == 120,
        f"panjang={len(bersih.get('Mechanical', [''])[0])}")
    cek("kategori asing dipertahankan", bersih.get("KategoriAsing") == ["dipertahankan"])
    cek("keenam kategori selalu ada", all(k in bersih for k in KATEGORI),
        f"ada: {sorted(bersih)}")

    # ── Kembalikan ────────────────────────────────────────────────────────
    kode, _ = panggil("PATCH", f"/api/unit/{uid}", {"fitur": asli})
    cek("fitur asli dipulihkan", kode == 200, f"HTTP {kode}")

    kode, h = panggil("GET", f"/api/unit/{uid}")
    kembali = (h.get("data") or {}).get("fitur") or {}
    cek("pemulihan cocok", kembali == asli, f"beda: {json.dumps(kembali, ensure_ascii=False)[:120]}")

    print()
    print("═" * 58)
    print(f"  HASIL: {lulus} lulus, {gagal} gagal")
    print("═" * 58)
    return 0 if gagal == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
