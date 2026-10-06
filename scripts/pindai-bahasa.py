#!/usr/bin/env python3
r"""Pindai HALAMAN JADI: dolar yang terlihat & sisa kata Inggris.

Kenapa berkas ini ada (dua jebakan yang sudah memakan korban):

1. Daftar halaman pernah MENYIMPANG dari kenyataan. Versi lama memeriksa 12
   halaman dan melaporkan "tidak ada dolar" dengan tenang, sementara 15 halaman
   lain tidak pernah diambil sama sekali. Rute yang salah tulis (`/checkout`
   padahal aslinya `/check-out`) membuat halaman itu 404 dan DILEWATI tanpa
   menggagalkan jalan.

   Karena itu daftar di sini TIDAK ditulis tangan: rutenya dibaca dari
   `src/app`, dan slug-nya dibaca dari basis data + `src/data`. Menambah halaman
   baru otomatis ikut terperiksa.

2. `grep -o '\$[0-9]'` pada HTML mentah melaporkan dolar yang TIDAK TERLIHAT:
   payload RSC menanam `$1`, `$23`, `$L22` sebagai rujukan chunk. Karena itu
   setiap blok `<script>`/`<style>` dibuang satu per satu (non-rakus) sebelum
   teks diperiksa.

Setiap halaman yang tidak menjawab 200 adalah KEGAGALAN KERAS.

Pakai:  python3 scripts/pindai-bahasa.py [basis-url]
        (bawaan http://127.0.0.1:3100)
"""

from __future__ import annotations

import re
import sqlite3
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import urlopen

AKAR = Path(__file__).resolve().parent.parent
BASIS = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://127.0.0.1:3100"
DB = AKAR / ".data" / "marf.db"


# ── daftar halaman: dibaca dari rute + data, bukan ditulis tangan ──────────

def rute_publik() -> list[str]:
    """Semua rute dari src/app, kecuali yang butuh masuk (panel/dashboard)."""
    keluar: list[str] = []
    for f in sorted((AKAR / "src" / "app").rglob("page.tsx")):
        rel = f.relative_to(AKAR / "src" / "app").parent.as_posix()
        if rel in ("", "."):
            keluar.append("/")
            continue
        if rel.startswith(("(panel)", "(dashboard)")):
            continue
        # grup rute "(x)" tidak muncul di URL
        bersih = re.sub(r"\([^)]*\)/", "", rel).strip("/")
        if "[" in bersih:  # rute dinamis — diisi slug di bawah
            continue
        keluar.append("/" + bersih)
    return keluar


def slug_dari_db(tabel: str) -> list[str]:
    if not DB.exists():
        return []
    try:
        k = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
        return [r[0] for r in k.execute(f"SELECT slug FROM {tabel}")]
    except Exception:
        return []


def slug_dari_data(berkas: str) -> list[str]:
    p = AKAR / "src" / "data" / berkas
    if not p.exists():
        return []
    return re.findall(r'slug:\s*"([^"]+)"', p.read_text())


def daftar_halaman() -> list[str]:
    hal = set(rute_publik())

    unit = slug_dari_db("unit") or slug_dari_data("listings.ts")
    dealer = slug_dari_db("dealer") or slug_dari_data("dealers.ts")
    produk = slug_dari_data("products.ts")
    agen = slug_dari_data("saleAgents.ts")
    blog = slug_dari_data("blogPosts.ts")

    for s in unit:
        hal.add(f"/listing-details/{s}")
        hal.add(f"/listing-details-2/{s}")
        hal.add(f"/listing-details-6/{s}")
    for s in dealer:
        hal.add(f"/dealer-details/{s}")
    for s in produk:
        hal.add(f"/product-details/{s}")
    for s in agen:
        hal.add(f"/sale-agents-details/{s}")
    for s in blog:
        hal.add(f"/blog-details-1/{s}")

    return sorted(hal)


# ── pembersihan HTML ───────────────────────────────────────────────────────

def teks_terlihat(html: str) -> str:
    """Buang script/style satu per satu (NON-RAKUS), lalu semua tag.

    `re.sub(r"<script.*</script>", "", h)` dengan `.*` rakus menghapus segalanya
    dari <script> pertama sampai </script> TERAKHIR — termasuk isi halaman yang
    justru mau diperiksa. Itu sebabnya versi ini memakai `.*?`.
    """
    html = re.sub(r"(?is)<script\b.*?</script>", " ", html)
    html = re.sub(r"(?is)<style\b.*?</style>", " ", html)
    html = re.sub(r"(?is)<noscript\b.*?</noscript>", " ", html)
    html = re.sub(r"(?is)<!--.*?-->", " ", html)
    html = re.sub(r"(?s)<[^>]+>", " ", html)
    html = re.sub(r"&[a-zA-Z]+;", " ", html)
    html = re.sub(r"&#\d+;", " ", html)
    return html


# ── kata Inggris yang tidak seharusnya muncul ──────────────────────────────

INGGRIS = set("""
view views show hide close open clear reset apply save cancel delete edit
update create add remove submit send search filter sort next previous prev
back continue confirm yes loading error success warning required optional
share print download upload copy paste select choose browse explore discover
home about contact blog news faq help support account profile settings
dashboard message messages notification notifications order orders cart
checkout payment billing shipping delivery address name email phone password
username login logout register subscribe newsletter review reviews rating
ratings comment comments reply replies tag tags category categories brand
brands model models year years price prices mileage condition location color
colour transmission fuel engine doors seats interior exterior features
feature specification specifications overview description gallery video images
image photo photos map dealer dealers seller sellers agent agents team
service services finance financing calculator insurance warranty article
articles page pages result results listing listings item items product
products shop store offer offers deal deals discount coupon free
subtotal tax fee fees summary quantity available sold new used hot best top
latest popular trending featured recommended special limited exclusive
luxury sport hatchback convertible pickup electric hybrid petrol diesel
automatic manual drive test book schedule inquire inquiry enquiry call get
touch your my our we you they the and or but for from with without into over
under more less all any some other another same different first last old big
small large long short high low good better bad worst nice great awesome
amazing perfect beautiful stunning powerful comfortable safe reliable
affordable cheap expensive fast quick slow easy simple hard difficult complex
modern classic stylish elegant sporty spacious efficient economical friendly
professional trusted certified guaranteed quality excellent mint clean
maintained accident full history records cash credit loan lease monthly down
interest rate term months month days day hours hour minutes minute today
tomorrow yesterday now soon later always never sometimes often usually rarely
here there where when why how what which who whom whose this that these those
only just still yet even also too very much many few lot lots plenty enough
read learn find looking sell buy trade welcome please thanks thank sorry
hello hi goodbye see tell ask answer
""".split())

# Nama merek, istilah serapan yang sudah lazim, potongan entitas HTML.
DIKECUALIKAN = {
    "marf", "showroom", "purwokerto", "jawa", "tengah", "indonesia",
    "toyota", "honda", "daihatsu", "suzuki", "mitsubishi", "nissan", "mazda",
    "hyundai", "wuling", "chery", "bmw", "mercedes", "benz", "lexus", "volvo",
    "tesla", "ford", "jeep", "porsche", "subaru", "highlander", "forester",
    "avanza", "creta", "fortuner", "vrz", "mustang", "mach", "grand",
    "cherokee", "overland", "carrera", "premium", "sedan", "suv", "mpv",
    "hatchback", "coupe", "wagon", "pickup", "van", "total", "detail",
    "gratis", "admin", "vip", "ok", "hp", "wa", "cc", "km", "id",
    "amp", "nbsp", "quot", "apos", "middot", "raquo", "laquo", "hellip",
    "terios", "xenia", "brio", "satya", "sigra", "ayla", "agya", "calya",
    "ertiga", "xl7", "jazz", "hrv", "brv", "mobilio", "xpander", "pajero",
    "outlander", "rush", "raize", "rocky", "stargazer", "almaz", "sonet",
    "seltos", "carnival", "ioniq", "air", "ev", "plug", "in", "hybrid",
}

DOLAR = re.compile(r"\$\s?\d[\d.,]*")
# Tanda dolar bisa juga muncul SESUDAH angkanya (`128.000 $`), yang luput oleh pola
# di atas. Pola kedua ini menangkap `$` yang menempel pada angka di sebelah kiri.
DOLAR_BELAKANG = re.compile(r"\d[\d.,]*\s?\$")


def main() -> int:
    halaman = daftar_halaman()
    print(f"  memeriksa {len(halaman)} halaman di {BASIS}")
    print()

    gagal: list[tuple[str, str]] = []
    ada_dolar: list[tuple[str, list[str]]] = []
    ada_inggris: list[tuple[str, dict[str, str]]] = []
    ok = 0

    for p in halaman:
        try:
            with urlopen(BASIS + p, timeout=20) as r:
                status = r.status
                html = r.read().decode("utf-8", "ignore")
        except HTTPError as e:
            gagal.append((p, f"HTTP {e.code}"))
            continue
        except URLError as e:
            gagal.append((p, f"tidak terjangkau: {e.reason}"))
            continue
        except Exception as e:  # noqa: BLE001
            gagal.append((p, f"gagal: {e}"))
            continue

        if status != 200:
            gagal.append((p, f"HTTP {status}"))
            continue
        ok += 1

        teks = teks_terlihat(html)

        d = sorted(set(DOLAR.findall(teks)) | set(DOLAR_BELAKANG.findall(teks)))
        if d:
            ada_dolar.append((p, d))

        temuan: dict[str, str] = {}
        for m in re.finditer(r"\b([A-Za-z][A-Za-z'-]{1,})\b", teks):
            k = m.group(1).lower()
            if k in INGGRIS and k not in DIKECUALIKAN:
                a, b = max(0, m.start() - 45), min(len(teks), m.end() + 45)
                temuan.setdefault(k, re.sub(r"\s+", " ", teks[a:b]).strip())
        if temuan:
            ada_inggris.append((p, temuan))

    print("═" * 72)
    print(f"  DOLAR TERLIHAT: {len(ada_dolar)} halaman")
    print("═" * 72)
    for p, d in ada_dolar:
        print(f"  {p:<46} {' '.join(d)}")
    if not ada_dolar:
        print("  (bersih)")

    print()
    print("═" * 72)
    print(f"  KATA INGGRIS TERLIHAT: {len(ada_inggris)} halaman")
    print("═" * 72)
    for p, t in ada_inggris:
        print(f"\n  ── {p}  ({len(t)} kata)")
        for k in sorted(t):
            print(f"     {k:<14} … {t[k][:88]}")
    if not ada_inggris:
        print("  (bersih)")

    print()
    print("═" * 72)
    print(f"  RINGKAS: {ok} halaman 200 · {len(gagal)} gagal · "
          f"{len(ada_dolar)} ada dolar · {len(ada_inggris)} ada kata Inggris")
    print("═" * 72)
    if gagal:
        print()
        print("  KEGAGALAN KERAS — halaman ini tidak boleh dilewati:")
        for p, alasan in gagal:
            print(f"    {p:<46} {alasan}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
