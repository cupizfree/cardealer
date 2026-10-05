// Galeri unit disimpan di kolom `galeri` (JSON). Ada DUA bentuk di database:
//
//   lama (seed)  : [ { src: "/assets/images/…jpg", alt: "listing-details" }, … ]
//   baru (panel) : [ "/assets/images/card/card-1.jpg", … ]
//
// Semua pembaca galeri HARUS lewat sini. Tanpa ini, unit berformat lama tampil
// seolah tidak punya gambar — dan lebih buruk, menyimpannya dari panel akan
// menuliskan daftar kosong dan menghapus galeri yang sudah ada.

/** Ambil daftar alamat gambar dari nilai `galeri` apa pun bentuknya. */
export function alamatGambar(galeri: unknown): string[] {
  if (!Array.isArray(galeri)) return [];

  return galeri
    .map((g) => {
      if (typeof g === "string") return g;
      if (g && typeof g === "object" && "src" in g) {
        const s = (g as { src?: unknown }).src;
        return typeof s === "string" ? s : null;
      }
      return null;
    })
    .filter((g): g is string => typeof g === "string" && g.trim().length > 0);
}
