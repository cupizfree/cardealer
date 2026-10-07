import { notFound } from "next/navigation";
import FormUnit from "@/components/panel/FormUnit";
import { alamatGambar } from "@/lib/galeri";
import { ambilUnit } from "@/lib/repo/unit";
import { bodiDariTeks } from "@/lib/bodi";

export const dynamic = "force-dynamic";

export default async function HalamanUbahUnit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) notFound();

  const u = ambilUnit(n);
  if (!u) notFound();

  return (
    <FormUnit
      id={u.id}
      awal={{
        judul: u.judul,
        merek: u.merek,
        model: u.model ?? "",
        // Tampilkan nilai yang benar-benar dipakai situs publik: kalau kolom
        // `tipe` masih kosong, yang berlaku adalah hasil turunan dari nama
        // model. Menyimpannya sekaligus mengisi kolomnya.
        tipe: u.tipe ?? bodiDariTeks(u.slug, u.judul, u.model) ?? "",
        tahun: u.tahun ? String(u.tahun) : "",
        harga: String(u.harga),
        harga_cicilan: u.harga_cicilan ?? "",
        kilometer: u.kilometer ?? "",
        transmisi: u.transmisi ?? "Otomatis",
        bahan_bakar: u.bahan_bakar ?? "Bensin",
        warna: u.warna ?? "",
        lokasi: u.lokasi ?? "",
        deskripsi: u.deskripsi ?? "",
        status: u.status,
        unggulan: u.unggulan,
        dealer_id: u.dealer_id ? String(u.dealer_id) : "",
        galeri: alamatGambar(u.galeri),
        fitur: u.fitur,
      }}
    />
  );
}
