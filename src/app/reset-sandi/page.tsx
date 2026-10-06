import Link from "next/link";
import { redirect } from "next/navigation";
import { penggunaSekarang } from "@/lib/auth";
import KerangkaSandi from "@/components/panel/KerangkaSandi";
import { periksaTokenReset } from "@/lib/repo/reset";
import FormResetSandi from "./FormResetSandi";
import "@/styles/panel.css";

export const dynamic = "force-dynamic";

export const metadata = { title: "Atur Ulang Kata Sandi" };

export default async function HalamanResetSandi({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const p = await penggunaSekarang();
  if (p) redirect(p.peran === "admin" ? "/admin" : "/staff");

  const { token } = await searchParams;
  const cek = periksaTokenReset(token ?? "");

  if (!cek.ok) {
    return (
      <KerangkaSandi
        judul="Atur Ulang Kata Sandi"
        catatan={
          <Link href="/masuk" className="font-semibold text-marf hover:underline">
            Kembali ke halaman masuk
          </Link>
        }
      >
        <div className="rounded-lg border border-marf-garis bg-marf-muda px-3.5 py-3 text-[13px] leading-relaxed text-marf-tua">
          <strong className="block">{cek.alasan}</strong>
          <span className="mt-1 block text-[12.5px]">
            Tautan atur ulang hanya berlaku 30 menit dan bisa dipakai sekali. Minta tautan baru kalau
            yang ini sudah tidak berlaku.
          </span>
        </div>
        <Link
          href="/lupa-sandi"
          className="mt-4 block w-full rounded-lg border border-marf bg-marf px-4 py-2.5 text-center text-[13.5px] font-semibold text-white hover:bg-marf-tua"
        >
          Minta tautan baru
        </Link>
      </KerangkaSandi>
    );
  }

  return (
    <KerangkaSandi judul="Atur Ulang Kata Sandi">
      <FormResetSandi token={token ?? ""} />
    </KerangkaSandi>
  );
}
