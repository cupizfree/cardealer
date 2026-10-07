#!/usr/bin/env python3
"""Bukti pembersihan data: satu showroom, satu staff, tanpa prospek/log contoh.

Menguji INVARIAN, bukan angka tetap, supaya jalan di basis data mana pun:
  1. Showroom  — /api/dealer mengembalikan tepat satu, dan halaman Daftar
                 Showroom menampilkan showroom itu serta tidak lagi menampilkan
                 tujuh showroom karangan dari templat asal
  2. Tautan    — setiap /dealer-details/<slug> yang tertaut benar-benar hidup
  3. Staff     — akun staff bernama "Hendrik Marfundo", bukan "Staff MARF"
  4. Prospek   — kosong
  5. Log       — kosong (dibaca dari berkas basis data; tidak ada API-nya)

Catatan: panel memuat daftar pengguna dan prospek lewat API di sisi klien, jadi
HTML yang dirender server TIDAK memuat nama-nama itu ("Memuat pengguna ...").
Membaca HTML-nya akan selalu lolos secara palsu — periksa API-nya.

Pakai:  python3 scripts/cek-bersih-data.py [basis-url]
        (bawaan http://127.0.0.1:3100)
        MARF_DB_PATH=./.data/marf-uji.db python3 scripts/cek-bersih-data.py http://127.0.0.1:3101
"""

from __future__ import annotations

import html
import json
import os
import re
import sqlite3
import sys
import urllib.error
import urllib.request

B = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3100"
JALUR_DB = os.environ.get("MARF_DB_PATH", "./.data/marf.db")

# Showroom karangan dari templat asal — tidak boleh muncul lagi.
KARANGAN = [
    "Berkah Motor",
    "Auto Prima",
    "Sinar Mobil",
    "Metro Motor",
    "Prima Auto",
    "Urban Motor",
    "Titan Motor",
]
NAMA_STAFF = "Hendrik Marfundo"

lulus = 0
gagal = 0


def cek(label: str, benar: bool, detail: str = "") -> None:
    global lulus, gagal
    if benar:
        lulus += 1
        print(f"  ok     {label}")
    else:
        gagal += 1
        print(f"  GAGAL  {label}{('  -> ' + detail) if detail else ''}")


def ambil(url: str, cookie: str | None = None) -> tuple[int, str]:
    kepala = {"Cookie": cookie} if cookie else {}
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=kepala), timeout=30) as r:
            return r.status, r.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:  # noqa: BLE001
        return 0, str(e)


def teks_tampil(markup: str) -> str:
    """Buang script/style/tag dan penanda komentar React, sisakan teks terlihat."""
    markup = re.sub(r"<script.*?</script>", "", markup, flags=re.S)
    markup = re.sub(r"<style.*?</style>", "", markup, flags=re.S)
    markup = markup.replace("<!-- -->", "")
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", markup)))


def masuk(email: str, sandi: str) -> str | None:
    """Cookie sesi ber-flag Secure; kita ambil nilainya sendiri dan kirim ulang."""
    data = json.dumps({"email": email, "kata_sandi": sandi}).encode()
    req = urllib.request.Request(
        f"{B}/api/auth/login", data=data, headers={"Content-Type": "application/json"}, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.headers.get("Set-Cookie", "").split(";")[0] or None
    except urllib.error.HTTPError:
        return None


# ── 1. Showroom ──────────────────────────────────────────────────────────────
print("══ 1. showroom di API ══")
kode, isi = ambil(f"{B}/api/dealer")
if kode != 200:
    cek("GET /api/dealer", False, f"HTTP {kode}")
    sys.exit(1)

daftar = json.loads(isi)["data"]
nama_api = [d["nama"] for d in daftar]
slug_api = [d["slug"] for d in daftar]
print(f"  {len(daftar)} showroom: {', '.join(nama_api)}")
cek("tepat satu showroom", len(daftar) == 1, f"ada {len(daftar)}")
cek("showroom itu MARF Showroom Pusat", "MARF" in " ".join(nama_api).upper(), str(nama_api))

print("\n══ 2. halaman Daftar Showroom ══")
kode, markup = ambil(f"{B}/dealers-listing")
cek("/dealers-listing 200", kode == 200, f"HTTP {kode}")
teks = teks_tampil(markup)
for nama in nama_api:
    cek(f"'{nama}' tampil", nama in teks)
for nama in KARANGAN:
    cek(f"'{nama}' sudah tidak ada", nama not in teks, "masih tampil")

print("\n══ 3. tautan detail showroom ══")
tautan = sorted(set(re.findall(r"/dealer-details/[a-z0-9-]+", markup)))
print(f"  tautan: {tautan}")
for t in tautan:
    kode, _ = ambil(f"{B}{t}")
    cek(f"{t} hidup", kode == 200, f"HTTP {kode}")
for s in slug_api:
    cek(f"slug '{s}' punya tautan", f"/dealer-details/{s}" in tautan)

# ── 4. Panel: staff, prospek, statistik ──────────────────────────────────────
print("\n══ 4. panel (lewat API) ══")
sys.path.insert(0, str(__import__("pathlib").Path(__file__).resolve().parent))
from _akun import sandi_uji, surel_uji  # noqa: E402

cookie = masuk(surel_uji("admin"), sandi_uji("admin"))
cek("masuk sebagai admin", cookie is not None)

if cookie:
    kode, isi = ambil(f"{B}/api/pengguna", cookie)
    cek("GET /api/pengguna 200", kode == 200, f"HTTP {kode}")
    if kode == 200:
        pengguna = json.loads(isi)["data"]
        nama = [p["nama"] for p in pengguna]
        print(f"  pengguna: {nama}")
        staf = [p for p in pengguna if p["peran"] == "staff"]
        cek("tepat satu akun staff", len(staf) == 1, f"ada {len(staf)}")
        cek(f"staff bernama '{NAMA_STAFF}'", any(p["nama"] == NAMA_STAFF for p in staf), str(nama))
        cek("'Staff MARF' sudah tidak ada", not any(p["nama"] == "Staff MARF" for p in pengguna), str(nama))
        cek("admin tetap ada", any(p["peran"] == "admin" for p in pengguna))

    kode, isi = ambil(f"{B}/api/prospek", cookie)
    cek("GET /api/prospek 200", kode == 200, f"HTTP {kode}")
    if kode == 200:
        prospek = json.loads(isi)["data"]
        cek("prospek kosong", len(prospek) == 0, f"ada {len(prospek)}")

    kode, isi = ambil(f"{B}/api/statistik", cookie)
    cek("GET /api/statistik 200", kode == 200, f"HTTP {kode}")
    if kode == 200:
        angka = json.loads(isi)["data"]
        cek("statistik: 1 showroom", angka["angka"]["totalDealer"] == 1, str(angka["angka"]["totalDealer"]))
        cek("statistik: prospek 0 semua", all(v == 0 for v in angka["prospek"].values()), str(angka["prospek"]))
        print(f"  unit: {angka['angka']['totalUnit']}  (tidak dibersihkan)")

# ── 5. Log aktivitas ─────────────────────────────────────────────────────────
#
# "Log kosong" BUKAN ukuran yang benar: setiap login mencatat dirinya, jadi log
# terisi lagi begitu ada yang memakai panel. Yang harus terbukti adalah jejak
# pengembangan (194 baris dari masa pembangunan situs) sudah hilang — yaitu tidak
# ada baris yang lebih tua dari penanda yang ditinggalkan `bersihkan-data.ts`.
print("\n══ 5. log aktivitas (berkas basis data) ══")
if not os.path.exists(JALUR_DB):
    cek(f"basis data {JALUR_DB} ada", False, "tidak ditemukan")
else:
    penanda = f"{JALUR_DB}.bersih.txt"
    try:
        konek = sqlite3.connect(f"file:{JALUR_DB}?mode=ro", uri=True)
        baris = konek.execute("SELECT aksi, dibuat_pada FROM log_aktivitas ORDER BY dibuat_pada").fetchall()
        konek.close()
    except Exception as e:  # noqa: BLE001
        cek("baca log_aktivitas", False, str(e))
        baris = []

    if baris:
        print(f"  {len(baris)} baris, aksi: {sorted({b[0] for b in baris})}")

    if not os.path.exists(penanda):
        cek(
            "penanda pembersihan ada",
            False,
            f"{penanda} tidak ada — jalankan scripts/bersihkan-data.ts",
        )
    else:
        with open(penanda, encoding="utf-8") as f:
            cap = f.read().strip()
        print(f"  penanda: {cap}")
        tua = [b for b in baris if str(b[1]) < cap]
        cek("tidak ada baris log dari masa pengembangan", not tua, f"{len(tua)} baris lebih tua")
        cek("tidak ada entri 'seed'", not any(b[0] == "seed" for b in baris))
        cek("tidak ada entri 'ganti-sandi'", not any(b[0] == "ganti-sandi" for b in baris))

print("\n" + "═" * 62)
print(f"  HASIL: {lulus} lulus, {gagal} gagal")
print("═" * 62)
sys.exit(1 if gagal else 0)
