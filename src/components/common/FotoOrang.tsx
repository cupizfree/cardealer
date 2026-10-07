// Foto orang — atau inisial kalau fotonya belum ada.
// Kenapa ada: templat asal menaruh foto stok wajah orang di setiap kartu tim.
// MARF cuma punya satu orang sungguhan di tim (Hendrik Marfundo), dan tidak ada
// fotonya. Memakai `sale-agent-1.jpg` berarti menampilkan wajah orang lain
// sebagai dia — persis kelas kebohongan yang sedang dibersihkan dari situs ini.
//
// Jadi: kalau `foto` kosong, yang tampil inisial namanya. Jujur, dan begitu foto
// aslinya ada, cukup isi `foto` di `src/data/saleAgents.ts` — tidak ada kode lain
// yang perlu diubah.
import Image from "next/image";

export function inisial(nama: string): string {
  return nama
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((kata) => kata[0] ?? "")
    .join("")
    .toUpperCase();
}

export default function FotoOrang({
  nama,
  foto,
  width,
  height,
  className,
}: {
  nama: string;
  foto?: string;
  width: number;
  height: number;
  className?: string;
}) {
  if (foto) {
    return <Image src={foto} alt={nama} width={width} height={height} className={className} />;
  }

  // Gaya ditulis sebaris, bukan lewat kelas SCSS baru: berkas SCSS situs ini
  // ~19.948 baris dan sengaja tidak disentuh (lihat CLAUDE.md). Gaya sebaris
  // juga menang atas reset universal `* { color: #1c1c1c }`.
  return (
    <div
      className={className}
      aria-label={nama}
      role="img"
      style={{
        aspectRatio: "1 / 1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#EFEFEF",
        color: "#9FA1A4",
        fontWeight: 700,
        fontSize: "clamp(40px, 9vw, 88px)",
        letterSpacing: "0.02em",
        userSelect: "none",
      }}
    >
      {inisial(nama)}
    </div>
  );
}
