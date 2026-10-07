// Jenis bodi unit — SUV, MPV, Hatchback, City Car, dan seterusnya.
//
// Kolom `tipe` di tabel `unit` adalah sumber kebenaran; panel bisa mengisinya.
// Tapi delapan belas unit yang ada sekarang belum punya nilainya, dan menambah
// kolom kosong ke basis data produksi tidak mengisi apa pun. Jadi ada dua
// lapisan: nilai yang ditulis panel menang, dan kalau kosong, jenis bodi
// diturunkan dari nama model.
//
// Turunannya BUKAN tebakan: Avanza memang MPV, Agya memang city car. Yang
// dihindari justru sebaliknya — menampilkan kolom "Jenis Mobil" yang tidak bisa
// menyaring apa pun, seperti sebelumnya.
//
// Slug dipakai di URL (`?tipe=suv`) dan dibandingkan di kode; label dipakai di
// layar. Sama seperti kunci fitur: yang dibandingkan tetap Inggris.

export const JENIS_BODI = [
  "suv",
  "mpv",
  "hatchback",
  "city-car",
  "sedan",
  "pikap",
  "double-cabin",
  "minibus",
] as const;

export type JenisBodi = (typeof JENIS_BODI)[number];

const LABEL: Record<string, string> = {
  suv: "SUV",
  mpv: "MPV",
  hatchback: "Hatchback",
  "city-car": "City Car",
  sedan: "Sedan",
  pikap: "Pikap",
  "double-cabin": "Double Cabin",
  minibus: "Minibus",
};

/** Label Indonesia untuk sebuah slug. Slug tak dikenal dikembalikan apa adanya. */
export function labelBodi(slug: string | null | undefined): string {
  if (!slug) return "";
  return LABEL[slug.toLowerCase()] ?? slug;
}

/**
 * Kata kunci nama model -> jenis bodi.
 *
 * Dicocokkan dari yang PALING PANJANG lebih dulu, supaya "city hatchback" tidak
 * keburu tertangkap "city" dan "brio satya" tidak jatuh ke aturan yang lebih
 * umum. Kunci huruf kecil semua.
 */
const KATA_KUNCI: Record<string, JenisBodi> = {
  // MPV
  avanza: "mpv",
  xenia: "mpv",
  mobilio: "mpv",
  xpander: "mpv",
  livina: "mpv",
  ertiga: "mpv",
  calya: "mpv",
  veloz: "mpv",
  innova: "mpv",
  sigra: "mpv",
  ayla: "mpv",
  alza: "mpv",
  // SUV
  terios: "suv",
  "hr-v": "suv",
  hrv: "suv",
  creta: "suv",
  "pajero sport": "suv",
  pajero: "suv",
  fortuner: "suv",
  rush: "suv",
  "br-v": "suv",
  brv: "suv",
  "rav4": "suv",
  "santa fe": "suv",
  // Hatchback — "city hatchback" dan "mazda 2" lebih spesifik dari aturan lain
  "city hatchback": "hatchback",
  "mazda 2": "hatchback",
  ignis: "hatchback",
  yaris: "hatchback",
  jazz: "hatchback",
  baleno: "hatchback",
  "swift": "hatchback",
  // City car
  "brio satya": "city-car",
  agya: "city-car",
  "brio": "city-car",
  // Lain-lain
  "double cabin": "double-cabin",
  "hilux": "double-cabin",
  "triton": "double-cabin",
  "navara": "double-cabin",
  "pikap": "pikap",
  "pickup": "pikap",
  "gran max": "minibus",
  "luxio": "minibus",
  "apv": "minibus",
  "sedan": "sedan",
  "camry": "sedan",
  "accord": "sedan",
  "civic": "sedan",
  "vios": "sedan",
};

/**
 * Turunkan jenis bodi dari teks apa pun yang menyebut modelnya — slug, judul,
 * atau kolom `model`. `null` kalau tidak ada yang cocok; pemanggil yang
 * memutuskan apa yang ditampilkan, bukan fungsi ini yang menebak.
 */
export function bodiDariTeks(...teks: (string | null | undefined)[]): JenisBodi | null {
  const gabung = teks.filter(Boolean).join(" ").toLowerCase();
  if (!gabung) return null;

  const cocok = Object.keys(KATA_KUNCI)
    .filter((kunci) => gabung.includes(kunci))
    .sort((a, b) => b.length - a.length);

  return cocok.length ? KATA_KUNCI[cocok[0]] : null;
}
