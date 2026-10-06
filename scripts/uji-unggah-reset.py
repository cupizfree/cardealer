"""Uji unggah gambar dan alur atur ulang sandi, ujung ke ujung.

Catatan soal cookie: cookie sesi ber-flag `Secure`, jadi curl/urllib tidak akan
mengirimnya lewat HTTP polos secara otomatis. Di sini token sesi dibaca dari
header Set-Cookie lalu dikirim ulang sebagai header Cookie eksplisit — itu
membuktikan perilaku server, tanpa perlu tunnel HTTPS.
"""

import json
import os
import pathlib
import re
import sqlite3
import sys
import urllib.error
import urllib.request

AKAR = pathlib.Path(__file__).resolve().parent.parent
B = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3101"
DB = str(AKAR / ".data/marf.db")
SEED = str(AKAR / "src" / "lib" / "seed.ts")

lulus = gagal = 0


def cek(label, harap, dapat):
    global lulus, gagal
    if harap == dapat:
        print(f"  \033[32m✓\033[0m {label:<52} {dapat}")
        lulus += 1
    else:
        print(f"  \033[31m✗\033[0m {label:<52} harap {harap}, dapat {dapat}")
        gagal += 1


def minta(jalur, metode="GET", badan=None, cookie=None, mentah=False, headers=None):
    url = B + jalur
    h = dict(headers or {})
    if cookie:
        h["Cookie"] = cookie
    data = None
    if badan is not None:
        if isinstance(badan, bytes):
            data = badan
        else:
            data = json.dumps(badan).encode()
            h.setdefault("Content-Type", "application/json")
    req = urllib.request.Request(url, data=data, headers=h, method=metode)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            isi = r.read()
            return r.status, (isi if mentah else _json(isi)), _header(r)
    except urllib.error.HTTPError as e:
        isi = e.read()
        return e.code, (isi if mentah else _json(isi)), _header(e)


def _header(r):
    """Semua header dengan kunci huruf kecil; Set-Cookie digabung."""
    h = {k.lower(): v for k, v in r.headers.items()}
    if hasattr(r.headers, "get_all"):
        semua = r.headers.get_all("Set-Cookie") or []
        if semua:
            h["set-cookie"] = ", ".join(semua)
    return h


def _json(b):
    try:
        return json.loads(b.decode("utf-8", "replace"))
    except Exception:
        return {}


def akun_awal():
    s = open(SEED, encoding="utf-8").read()
    blok = re.search(r"AKUN_AWAL\s*=\s*\[(.*?)\]", s, re.S).group(1)
    return dict(re.findall(r'email:\s*"([^"]+)".*?sandi:\s*"([^"]+)"', blok, re.S))


def sesi(email, sandi):
    st, j, h = minta("/api/auth/login", "POST", {"email": email, "kata_sandi": sandi})
    if st != 200:
        return None, st
    raw = h.get("set-cookie", "")
    m = re.search(r"marf_sesi=([^;]+)", raw)
    return (f"marf_sesi={m.group(1)}" if m else None), st


AKUN = akun_awal()
EMAIL_STAFF = next(e for e in AKUN if "staff" in e)
SANDI_STAFF = AKUN[EMAIL_STAFF]
EMAIL_ADMIN = next(e for e in AKUN if "admin" in e)
SANDI_ADMIN = AKUN[EMAIL_ADMIN]

print("\n\033[1m── A. UNGGAH GAMBAR ──\033[0m")
cookie, st = sesi(EMAIL_ADMIN, SANDI_ADMIN)
cek("login admin", 200, st)
cek("cookie sesi diterima", True, bool(cookie))

# tanpa login
st, _, _ = minta("/api/unggah", "POST", b"--x\r\n", headers={"Content-Type": "multipart/form-data; boundary=x"})
cek("POST /api/unggah tanpa login (401)", 401, st)

# bangun multipart dengan berkas JPEG asli dari repositori
GAMBAR = str(AKAR / "public/assets/images/card/card-1.jpg")
isi = open(GAMBAR, "rb").read()
batas = "----marfuji4080"
tubuh = (
    f"--{batas}\r\n"
    'Content-Disposition: form-data; name="berkas"; filename="uji.jpg"\r\n'
    "Content-Type: image/jpeg\r\n\r\n"
).encode() + isi + f"\r\n--{batas}--\r\n".encode()

st, j, _ = minta(
    "/api/unggah", "POST", tubuh,
    cookie=cookie,
    headers={"Content-Type": f"multipart/form-data; boundary={batas}"},
)
cek("POST /api/unggah (admin)", 201, st)
alamat = (j.get("data") or {}).get("alamat") if isinstance(j, dict) else None
cek("balasan berisi alamat", True, bool(alamat))
print(f"      alamat: {alamat}")

# sajikan kembali
st, data, h = minta(alamat, mentah=True)
cek("GET alamat gambar", 200, st)
cek("Content-Type gambar", "image/jpeg", h.get("content-type"))
cek("isi sama persis", True, data == isi)

# berkas benar-benar ada di disk
nama = alamat.rsplit("/", 1)[-1] if alamat else ""
jalur = str(AKAR / ".data" / "unggah" / nama)
cek("berkas ada di .data/unggah", True, os.path.exists(jalur))

# penolakan
# `../..` di jalur dinormalkan peramban/proxy SEBELUM sampai ke rute, jadi yang
# benar-benar menguji rutenya adalah traversal yang dikodekan.
st, data, _ = minta("/api/gambar/%2e%2e%2f%2e%2e%2fpackage.json", mentah=True)
cek("path traversal ter-encode ditolak", True, st in (400, 404) and b'"name"' not in data)
st, data, _ = minta("/api/gambar/..%2f..%2fpackage.json", mentah=True)
cek("traversal bentuk kedua ditolak", True, st in (400, 404) and b'"name"' not in data)
st, _, _ = minta("/api/gambar/tidak-ada.jpg", mentah=True)
cek("berkas tak ada (404)", 404, st)

tubuh_salah = (
    f"--{batas}\r\n"
    'Content-Disposition: form-data; name="berkas"; filename="jahat.txt"\r\n'
    "Content-Type: text/plain\r\n\r\nhalo\r\n"
    f"--{batas}--\r\n"
).encode()
st, _, _ = minta("/api/unggah", "POST", tubuh_salah, cookie=cookie,
                 headers={"Content-Type": f"multipart/form-data; boundary={batas}"})
cek("berkas non-gambar ditolak (415)", 415, st)

print("\n\033[1m── B. ATUR ULANG SANDI ──\033[0m")
st, j, _ = minta("/api/auth/lupa-sandi", "POST", {"email": EMAIL_STAFF})
cek("POST /api/auth/lupa-sandi", 200, st)
cek("tidak membocorkan status kirim", True, "dikirim" in (j.get("data") or {}))

st, j, _ = minta("/api/auth/lupa-sandi", "POST", {"email": "tidak-ada@marf.id"})
cek("surel tak terdaftar: jawaban sama (200)", 200, st)
cek("  dan tidak mengaku terkirim", False, (j.get("data") or {}).get("dikirim"))

# ambil token dari log (penyedia surel belum dikonfigurasi)
k = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
baris = k.execute(
    "SELECT ringkasan FROM log_aktivitas WHERE aksi='reset-manual' ORDER BY id DESC LIMIT 1"
).fetchone()
cek("tautan tercatat di log aktivitas", True, bool(baris))
m = re.search(r"token=([a-f0-9]{64})", baris[0]) if baris else None
token = m.group(1) if m else None
cek("token 64 heksadesimal", True, bool(token))

# token disimpan sebagai sidik, bukan apa adanya
sidik_ada = k.execute("SELECT COUNT(*) FROM reset_sandi WHERE token_hash = ?", (token or "",)).fetchone()[0]
cek("token mentah TIDAK ada di basis data", 0, sidik_ada)

SANDI_BARU = "SandiUji#4080"
st, j, _ = minta("/api/auth/reset-sandi", "POST", {"token": token, "kata_sandi": SANDI_BARU})
cek("POST /api/auth/reset-sandi", 200, st)

_, st = sesi(EMAIL_STAFF, SANDI_STAFF)
cek("sandi LAMA sudah tidak berlaku (401)", 401, st)
c2, st = sesi(EMAIL_STAFF, SANDI_BARU)
cek("sandi BARU berlaku", 200, st)

st, _, _ = minta("/api/auth/reset-sandi", "POST", {"token": token, "kata_sandi": "Lagi#4080"})
cek("token sekali pakai (400)", 400, st)

st, _, _ = minta("/api/auth/reset-sandi", "POST", {"token": "a" * 64, "kata_sandi": "Lagi#4080"})
cek("token karangan ditolak (400)", 400, st)

st, _, _ = minta("/api/auth/reset-sandi", "POST", {"token": token, "kata_sandi": "pendek"})
cek("sandi terlalu pendek (422/400)", 422, st)

print("\n\033[1m── C. KEMBALIKAN KEADAAN ──\033[0m")
# kembalikan sandi staff lewat alur yang sama (membuktikan alurnya bisa diulang)
minta("/api/auth/lupa-sandi", "POST", {"email": EMAIL_STAFF})
baris = k.execute(
    "SELECT ringkasan FROM log_aktivitas WHERE aksi='reset-manual' ORDER BY id DESC LIMIT 1"
).fetchone()
token2 = re.search(r"token=([a-f0-9]{64})", baris[0]).group(1)
st, _, _ = minta("/api/auth/reset-sandi", "POST", {"token": token2, "kata_sandi": SANDI_STAFF})
cek("sandi staff dikembalikan", 200, st)
_, st = sesi(EMAIL_STAFF, SANDI_STAFF)
cek("sandi asli berlaku lagi", 200, st)

# bersihkan berkas uji dan token
if nama and os.path.exists(jalur):
    os.remove(jalur)
    print(f"      berkas uji dihapus: {nama}")
kk = sqlite3.connect(DB)
kk.execute("DELETE FROM reset_sandi")
kk.execute("DELETE FROM log_aktivitas WHERE aksi IN ('reset-manual','minta-reset','reset-sandi','unggah')")
kk.commit()
print("      token reset & log uji dibersihkan")

print(f"\n\033[1m════ HASIL: {lulus} lulus, {gagal} gagal ════\033[0m\n")
sys.exit(0 if gagal == 0 else 1)
