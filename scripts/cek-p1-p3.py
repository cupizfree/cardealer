#!/usr/bin/env python3
"""Bukti P1 (beranda) dan P3 (enam halaman listing) benar-benar bekerja.

Tes ini sengaja TIDAK terpaku pada data produksi. Yang diuji adalah invariannya,
bukan angkanya, supaya bisa dijalankan terhadap basis data uji (15 unit) maupun
produksi (18 unit) tanpa disunting:

  * setiap angka yang ditampilkan harus sama dengan hasil penyaring yang berlaku;
  * setiap halaman listing harus memberi hasil yang SAMA dengan halaman katalog
    acuan untuk kueri yang sama.

P1 — beranda dulu hiasan seluruhnya:
  * hero: tombol berbunyi "Tampilkan 1.029 Unit" padahal stok 18 unit; daftar
    merek ditulis tangan, memuat BMW/Mercedes/Audi/Volvo yang tidak ada satu pun
    unitnya; sembilan ikon jenis mobil semuanya menuju satu alamat yang sama;
  * "Unit Unggulan / Semua Unit": dua tab yang isinya sama-sama mobil bekas yang
    sama, diambil dari daftar ID tetap;
  * "Jelajahi Merek Kami": enam merek karangan dengan jumlah unit karangan.

P3 — enam halaman listing (gridstyle-halfmap, liststyle-halfmap,
liststyle-sidebar, sidebar-left, sidebar-right, topmap) dulu mengabaikan
`searchParams` sepenuhnya.

Pemeriksaan hero DIBATASI pada elemen <form> hero itu sendiri. Memindai seluruh
beranda akan menangkap seksi lain dan memberi kegagalan palsu — itu sudah
terjadi sekali. Sebaliknya, pemeriksaan merek/tab memindai SELURUH beranda,
karena di situlah kebohongannya dulu berada.

Payload RSC Next.js membuang seluruh katalog ke dalam <script> di setiap
halaman, jadi <script>/<style> dibuang dulu — kalau tidak, semua unit akan
terlihat "cocok" di semua halaman.

Pemakaian:  python3 scripts/cek-p1-p3.py [URL_DASAR]
"""
import re
import sys
import urllib.error
import urllib.request

DASAR = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3100").rstrip("/")
KATALOG = "/listing-grid3-columns"

# Halaman P3 yang dulu tidak menyaring, beserta kueri yang diuji.
P3 = [
    ("/listing-gridstyle-halfmap", ["tipe=suv", "tipe=city-car", "merek=toyota"]),
    ("/listing-liststyle-halfmap", ["tipe=suv", "merek=toyota", "harga=100-150"]),
    ("/listing-liststyle-sidebar", ["tipe=mpv", "tipe=hatchback", "merek=honda"]),
    ("/listing-sidebar-left", ["tipe=suv", "merek=toyota", "harga=200-300"]),
    ("/listing-sidebar-right", ["tipe=hatchback", "tipe=city-car", "merek=suzuki"]),
    ("/listing-topmap", ["tipe=suv", "tipe=mpv", "merek=daihatsu"]),
]

# Merek tanpa satu pun unit — tidak boleh ditawarkan sebagai merek yang bisa dijelajahi.
MEREK_KARANGAN = ["BMW", "Mercedes", "Audi", "Volvo"]
# Label tab yang dulu hiasan.
TAB_KARANGAN = ["Mobil Baru", "Mobil Bekas"]


def teks_tampil(html: str) -> str:
    html = re.sub(r"<script\b.*?</script>", " ", html, flags=re.S | re.I)
    html = re.sub(r"<style\b.*?</style>", " ", html, flags=re.S | re.I)
    # Penanda komentar React DIBUANG TANPA diganti spasi. Menggantinya dengan
    # spasi memecah teks yang sebenarnya menyatu: "Tampilkan <!-- -->18<!-- -->
    # Unit" jadi "Tampilkan  18  Unit", sehingga pencocokan teks yang benar gagal.
    html = re.sub(r"<!--.*?-->", "", html, flags=re.S)
    return html


def ambil(url: str):
    try:
        with urllib.request.urlopen(url, timeout=60) as r:
            return r.status, r.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:  # noqa: BLE001
        return 0, f"__ERROR__ {e}"


def unit_di(html: str) -> set:
    return set(re.findall(r'href="/listing-details/([a-z0-9-]+)"', teks_tampil(html)))


def jumlah_unit(html: str) -> int:
    """Total unit pada halaman listing, dari 'Menampilkan x – y dari N Unit'."""
    m = re.search(r"dari\s+(\d+)\s+Unit", teks_tampil(html))
    return int(m.group(1)) if m else -1


def potong_form(html: str, penanda: str) -> str:
    """Isi satu <form> sampai penutupnya yang seimbang."""
    i = html.find(penanda)
    if i < 0:
        return ""
    kedalaman = 0
    for m in re.finditer(r"</?form\b[^>]*>", html[i:]):
        kedalaman += -1 if m.group(0).startswith("</") else 1
        if kedalaman == 0:
            return html[i : i + m.end()]
    return ""


def main() -> int:
    print(f"  dasar: {DASAR}")
    gagal = 0

    # ── acuan: jumlah stok sungguhan ─────────────────────────────────────────
    kode, html_katalog = ambil(f"{DASAR}{KATALOG}")
    if kode != 200:
        print(f"  GAGAL  katalog tidak bisa dibuka: {kode}")
        return 1
    stok = jumlah_unit(html_katalog)
    print(f"  stok sungguhan: {stok} unit\n")

    # ── P1 · hero ────────────────────────────────────────────────────────────
    print("  ══ P1 · hero beranda ══")
    kode, html = ambil(f"{DASAR}/")
    if kode != 200:
        print(f"  GAGAL  beranda tidak bisa dibuka: {kode}")
        return 1
    penuh = teks_tampil(html)

    # Potong dari teks yang SUDAH dibersihkan, bukan dari HTML mentah: React
    # menyisipkan penanda `<!-- -->` di antara teks dan nilai, jadi
    # "Tampilkan {n} Unit" tersimpan sebagai "Tampilkan <!-- -->18<!-- --> Unit".
    hero = potong_form(penuh, '<form class="relative" action="' + KATALOG + '"')
    if not hero:
        print("  GAGAL  form hero tidak ditemukan di beranda")
        gagal += 1
        hero = penuh
    else:
        print(f"  ok     form hero ditemukan ({len(hero)} char, beranda {len(penuh)} char)")

    if f"Tampilkan {stok} Unit" in hero:
        print(f"  ok     tombol hero berbunyi 'Tampilkan {stok} Unit' (sama dengan stok)")
    else:
        salah = re.findall(r"Tampilkan ([0-9.]+) Unit", hero)
        print(f"  GAGAL  tombol hero tidak menyebut {stok} unit; terbaca: {salah or 'tidak ada'}")
        gagal += 1

    if "1.029" in penuh or "1029" in penuh:
        print("  GAGAL  angka karangan '1.029' masih ada di beranda")
        gagal += 1
    else:
        print("  ok     angka karangan '1.029' sudah hilang")

    muncul = [m_ for m_ in MEREK_KARANGAN if re.search(rf">\s*{m_}\s*<", hero)]
    if muncul:
        print(f"  GAGAL  hero masih menawarkan merek tanpa unit: {muncul}")
        gagal += 1
    else:
        print("  ok     dropdown hero bersih dari merek tanpa unit")

    aksi = re.findall(r'<form[^>]*action="([^"]*)"', hero)
    if KATALOG in aksi:
        print(f"  ok     form hero menuju {KATALOG} (bukan '#' atau kosong)")
    else:
        print(f"  GAGAL  form hero tidak menuju katalog; action={aksi}")
        gagal += 1

    jenis = sorted(set(re.findall(r'href="' + re.escape(KATALOG) + r"\?tipe=([a-z-]+)\"", hero)))
    if len(jenis) >= 4:
        print(f"  ok     {len(jenis)} tautan jenis berbeda di hero: {', '.join(jenis)}")
    else:
        print(f"  GAGAL  tautan jenis hero tidak berbeda: {jenis}")
        gagal += 1

    for j in jenis:
        k, h = ambil(f"{DASAR}{KATALOG}?tipe={j}")
        n = jumlah_unit(h)
        if n > 0:
            print(f"  ok     tautan hero ?tipe={j} -> {n} unit")
        else:
            print(f"  GAGAL  tautan hero ?tipe={j} -> {n} unit")
            gagal += 1

    # Merek yang ditawarkan hero harus benar-benar ada isinya.
    #
    # Dibaca dari `<input name="merek" value="…">`, bukan dari `<span>` mana pun:
    # dropdown Model memakai `<span>` yang bentuknya sama persis, jadi memindai
    # span akan ikut menguji nama model sebagai merek dan melaporkan kegagalan
    # palsu ("Avanza ditawarkan tapi kosong").
    for nama in sorted(set(re.findall(r'name="merek"[^>]*value="([^"]+)"', hero))):
        k, h = ambil(f"{DASAR}{KATALOG}?merek={nama}")
        n = jumlah_unit(h)
        if n > 0:
            print(f"  ok     merek hero {nama:11} -> {n} unit")
        else:
            print(f"  GAGAL  merek hero {nama:11} -> {n} unit (ditawarkan tapi kosong)")
            gagal += 1

    # ── P1 · seksi merek & tab, di seluruh beranda ───────────────────────────
    print("\n  ══ P1 · seksi merek & tab di beranda ══")
    sisa = [m_ for m_ in MEREK_KARANGAN if re.search(rf">\s*{m_}\s*<", penuh)]
    if sisa:
        print(f"  GAGAL  merek tanpa unit masih tampil di beranda: {sisa}")
        gagal += 1
    else:
        print(f"  ok     tidak ada merek tanpa unit di beranda ({', '.join(MEREK_KARANGAN)})")

    # Kartu merek: nama + jumlah; jumlahnya diuji ke penyaring merek yang berlaku.
    kartu = re.findall(
        r'<p class="h5">([^<]+)</p><p class="text-muted text-sm">(\d+) Unit</p>', penuh
    )
    if not kartu:
        print("  GAGAL  tidak ada satu pun kartu merek di beranda")
        gagal += 1
    for nama, jumlah in kartu:
        k, h = ambil(f"{DASAR}{KATALOG}?merek={nama}")
        nyata = jumlah_unit(h)
        if nyata == int(jumlah):
            print(f"  ok     kartu {nama:11} -> {jumlah} Unit (sama dengan penyaringnya)")
        else:
            print(f"  GAGAL  kartu {nama:11} -> tertulis {jumlah} Unit, penyaringnya memberi {nyata}")
            gagal += 1

    tab = [t for t in TAB_KARANGAN if f">{t}<" in penuh]
    if tab:
        print(f"  GAGAL  tab hiasan masih ada di beranda: {tab}")
        gagal += 1
    else:
        print("  ok     tab 'Mobil Baru/Mobil Bekas' sudah tidak ada di beranda")

    for t in ("Unit Unggulan", "Semua Unit"):
        if f">{t}<" in penuh:
            print(f"  ok     tab '{t}' ada")
        else:
            print(f"  GAGAL  tab '{t}' tidak ditemukan")
            gagal += 1

    # ── P3 ───────────────────────────────────────────────────────────────────
    print("\n  ══ P3 · enam halaman listing menyaring seperti halaman acuan ══")
    terlihat: dict = {}
    for jalur, kueri_daftar in P3:
        for kueri in kueri_daftar:
            _, h_acuan = ambil(f"{DASAR}{KATALOG}?{kueri}")
            acuan = unit_di(h_acuan)
            kode, html = ambil(f"{DASAR}{jalur}?{kueri}")
            if kode != 200:
                print(f"  GAGAL  {jalur}?{kueri} -> {kode}")
                gagal += 1
                continue
            dapat = unit_di(html)
            terlihat.setdefault(jalur, set()).add(frozenset(dapat))
            if dapat == acuan:
                print(f"  ok     {jalur:28} ?{kueri:16} {len(dapat)} unit (sama dengan acuan)")
            else:
                print(f"  GAGAL  {jalur:28} ?{kueri:16} dapat {len(dapat)}, acuan {len(acuan)}")
                print(f"           hilang   : {sorted(acuan - dapat)}")
                print(f"           kelebihan: {sorted(dapat - acuan)}")
                gagal += 1

    print("\n  ── bukti tiap halaman benar-benar menyaring, bukan menampilkan semua ──")
    for jalur, himpunan in terlihat.items():
        if len(himpunan) > 1:
            print(f"  ok     {jalur:28} {len(himpunan)} penyaring -> {len(himpunan)} hasil berbeda")
        else:
            print(f"  GAGAL  {jalur:28} semua penyaring memberi hasil yang SAMA")
            gagal += 1

    print(f"\n  {'SEMUA LULUS' if gagal == 0 else f'{gagal} MASALAH'}")
    return 1 if gagal else 0


if __name__ == "__main__":
    sys.exit(main())
