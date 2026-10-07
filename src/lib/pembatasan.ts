// Pembatasan percobaan masuk.
//
// Sebelum ini tidak ada pembatas apa pun: `/api/auth/login` menerima percobaan
// sebanyak apa pun, secepat apa pun. Selama sandinya kuat itu tidak jadi
// masalah, tapi selama ini sandi awalnya tertulis di README repositori publik —
// jadi yang dibutuhkan penyerang bukan menebak, hanya menyalin. Pembatas ini
// menutup celah kedua: begitu sandinya benar, jumlah percobaan tidak lagi tak
// terbatas.
//
// Batasnya per (surel + alamat IP), bukan per surel saja — kalau per surel saja,
// satu penyerang bisa mengunci akun admin sungguhan hanya dengan sengaja gagal
// berkali-kali. Dengan dipasangkan IP, yang terkunci hanya penyerangnya.
//
// Jujur soal batasannya: catatan ini hidup di memori proses. Artinya (a) hilang
// saat server dimulai ulang, dan (b) tidak berlaku lintas proses. Untuk showroom
// dengan satu proses Next.js ini memadai; kalau nanti dijalankan di beberapa
// proses, pindahkan `catatan` ke tabel basis data atau Redis.

const MAKS_GAGAL = 5;
const JENDELA_MS = 15 * 60 * 1000;
const MAKS_ENTRI = 5000;

type Catatan = {
  /** Percobaan gagal di jendela yang sedang berjalan. */
  gagal: number;
  /** Kapan jendela penghitungan berakhir — setelah itu `gagal` mulai dari nol lagi. */
  jendela: number;
  /** Kapan blokir berakhir. `0` berarti tidak sedang diblokir. */
  blokirSampai: number;
};

const catatan = new Map<string, Catatan>();

/** Buang entri yang sudah kedaluwarsa; sisakan separuh kalau jumlahnya kelewat banyak. */
function rapikan(sekarang: number) {
  for (const [k, v] of catatan) {
    if (v.blokirSampai <= sekarang && v.jendela <= sekarang) catatan.delete(k);
  }
  if (catatan.size <= MAKS_ENTRI) return;

  // Kelewat banyak: buang yang paling tua. Tidak mengosongkan semuanya —
  // mengosongkan berarti penyerang bisa menghapus blokirnya sendiri hanya
  // dengan membanjiri endpoint ini.
  const urut = [...catatan.entries()].sort(
    (a, b) => Math.max(a[1].blokirSampai, a[1].jendela) - Math.max(b[1].blokirSampai, b[1].jendela),
  );
  for (const [k] of urut.slice(0, Math.floor(MAKS_ENTRI / 2))) catatan.delete(k);
}

/** Alamat pemanggil, kalau ada. Di balik proksi, header inilah yang terisi. */
export function alamatPemanggil(req: Request): string {
  const maju = req.headers.get("x-forwarded-for");
  if (maju) return maju.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "tanpa-alamat";
}

export function kunciLogin(req: Request, email: string): string {
  return `${email.toLowerCase()}|${alamatPemanggil(req)}`;
}

/** Sisa waktu blokir dalam detik. `0` berarti boleh mencoba. */
export function sisaBlokir(kunci: string): number {
  const sekarang = Date.now();
  rapikan(sekarang);
  const c = catatan.get(kunci);
  if (!c || c.blokirSampai <= sekarang) return 0;
  return Math.ceil((c.blokirSampai - sekarang) / 1000);
}

/**
 * Catat satu percobaan gagal.
 *
 * Percobaan kelima memulai blokir selama satu jendela penuh. Yang dihitung
 * hanya percobaan DI DALAM jendela yang sedang berjalan, jadi penyerang yang
 * mencoba sekali tiap 20 menit tidak pernah terkunci — dan itu memang benar:
 * pada laju itu dia tidak sedang menebak, dan menebak tidak akan pernah
 * berhasil pada sandi acak.
 */
export function catatGagal(kunci: string): void {
  const sekarang = Date.now();
  const lama = catatan.get(kunci);
  const masihSatuJendela = lama && lama.jendela > sekarang;
  const gagal = (masihSatuJendela ? lama.gagal : 0) + 1;

  catatan.set(kunci, {
    gagal,
    jendela: masihSatuJendela ? lama.jendela : sekarang + JENDELA_MS,
    blokirSampai: gagal >= MAKS_GAGAL ? sekarang + JENDELA_MS : 0,
  });
}

/** Berhasil masuk: bersihkan catatannya. */
export function bersihkanKunci(kunci: string): void {
  catatan.delete(kunci);
}

export const BATAS_PERCOBAAN = { MAKS_GAGAL, JENDELA_MS };
