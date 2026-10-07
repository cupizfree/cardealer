#!/usr/bin/env python3
"""Pastikan CTA "Tambah Iklan" benar-benar hilang dari situs.

Dua jebakan yang harus dihindari (keduanya pernah menipu tes sebelumnya):

  1. Next.js menempelkan payload RSC ke setiap <script>, jadi mencari teks di
     HTML mentah bisa cocok dengan data, bukan tampilan. Buang <script>/<style>
     dulu, baru cari.
  2. `/add-listings-2` sendiri masih ada sebagai rute (panel internal butuh
     formulirnya). Yang diuji adalah CTA-nya hilang dari header, bukan rutenya
     dihapus.

Pemakaian:  python3 scripts/cek-tambah-iklan.py [URL_DASAR]
"""
import json
import re
import sys
import urllib.error
import urllib.request

DASAR = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3100"

HALAMAN_PUBLIK = [
    "/", "/home-02", "/home-03", "/home-04", "/home-05", "/home-06",
    "/home-07", "/home-08", "/home-09", "/home-10",
    "/about-us", "/contact-us", "/services-center", "/sell-your-car",
    "/sale-agents", "/shop", "/shopping-cart", "/calculator", "/financing",
    "/dealers-listing", "/clients-reviews", "/faqs", "/terms", "/compare",
    "/blog-grid-style-1", "/blog-grid-style-2", "/blog-grid-style-3",
    "/blog-list", "/blog-standard",
    "/listing-grid2-columns", "/listing-grid3-columns", "/listing-grid4-columns",
    "/listing-liststyle-halfmap", "/listing-gridstyle-halfmap",
    "/listing-sidebar-left", "/listing-sidebar-right",
]

# Halaman yang butuh sesi. Header dasbor punya salinan CTA-nya sendiri, jadi
# kalau hanya halaman publik yang diuji, sisa di dasbor akan lolos.
HALAMAN_SESI = ["/dashboard", "/my-listings", "/my-profile", "/message", "/add-listings-2"]

SUREL = "admin@marf.id"
SANDI = "MarfAdmin#2026"


def teks_tampil(html: str) -> str:
    """Buang <script> dan <style> — payload RSC bukan bagian dari tampilan."""
    html = re.sub(r"<script\b.*?</script>", " ", html, flags=re.S | re.I)
    html = re.sub(r"<style\b.*?</style>", " ", html, flags=re.S | re.I)
    html = re.sub(r"<!--.*?-->", " ", html, flags=re.S)
    return re.sub(r"<[^>]+>", " ", html)


def ambil(opener, url: str) -> tuple[int, str]:
    try:
        with opener.open(url, timeout=30) as r:
            return r.status, r.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:  # noqa: BLE001
        return 0, f"__ERROR__ {e}"


def periksa(opener, jalur: str, label: str, cek_teks: bool = True) -> int:
    kode, html = ambil(opener, DASAR + jalur)
    if kode != 200:
        print(f"  ?     {label:28} {kode}")
        return 1
    # CTA yang dibuang selalu berupa tautan ke /add-listings-2. Halaman
    # /add-listings-2 sendiri tetap memuat teks "Tambah Iklan" sebagai judul
    # formulirnya — itu isi halaman, bukan CTA, jadi teksnya tidak dicek di sana.
    ada_link = 'href="/add-listings-2"' in html
    ada_cta = cek_teks and "Tambah Iklan" in teks_tampil(html)
    if ada_cta or ada_link:
        print(f"  GAGAL {label:28} cta={ada_cta} tautan={ada_link}")
        return 1
    print(f"  ok    {label:28} cta={ada_cta} tautan={ada_link}")
    return 0


def main() -> int:
    gagal = 0
    print(f"  dasar: {DASAR}\n")

    print("  ── tanpa sesi ──")
    polos = urllib.request.build_opener()
    for jalur in HALAMAN_PUBLIK:
        gagal += periksa(polos, jalur, jalur)

    print("\n  ── dengan sesi (header + sidebar dasbor) ──")
    jar = urllib.request.HTTPCookieProcessor()
    sesi = urllib.request.build_opener(jar)
    try:
        req = urllib.request.Request(
            DASAR + "/api/auth/login",
            data=json.dumps({"email": SUREL, "kata_sandi": SANDI}).encode(),
            headers={"Content-Type": "application/json"},
        )
        with sesi.open(req, timeout=30) as r:
            masuk = r.status == 200
    except Exception as e:  # noqa: BLE001
        masuk = False
        print(f"  !! login gagal: {e}")
    if not masuk:
        print("  !! TIDAK BISA MASUK — bagian ini dilewati, bukan lulus")
        return 1
    print("  ok    login")
    for jalur in HALAMAN_SESI:
        gagal += periksa(sesi, jalur, jalur, cek_teks=(jalur != "/add-listings-2"))

    print(f"\n  {'SEMUA BERSIH' if gagal == 0 else f'{gagal} masalah'}")
    return 1 if gagal else 0


if __name__ == "__main__":
    sys.exit(main())
