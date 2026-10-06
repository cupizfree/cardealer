import Link from "next/link";
import { redirect } from "next/navigation";
import { penggunaSekarang } from "@/lib/auth";
import KerangkaSandi from "@/components/panel/KerangkaSandi";
import FormLupaSandi from "./FormLupaSandi";
import "@/styles/panel.css";

export const dynamic = "force-dynamic";

export const metadata = { title: "Lupa Kata Sandi" };

export default async function HalamanLupaSandi() {
  const p = await penggunaSekarang();
  if (p) redirect(p.peran === "admin" ? "/admin" : "/staff");

  return (
    <KerangkaSandi
      judul="Atur Ulang Kata Sandi"
      catatan={
        <>
          Ingat kata sandinya?{" "}
          <Link href="/masuk" className="font-semibold text-marf hover:underline">
            Masuk di sini
          </Link>
        </>
      }
    >
      <FormLupaSandi />
    </KerangkaSandi>
  );
}
