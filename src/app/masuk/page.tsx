import { redirect } from "next/navigation";
import { penggunaSekarang } from "@/lib/auth";
import FormMasuk from "./FormMasuk";

export const dynamic = "force-dynamic";

export const metadata = { title: "Masuk Panel" };

export default async function HalamanMasuk() {
  const p = await penggunaSekarang();
  if (p) redirect(p.peran === "admin" ? "/admin" : "/staff");

  return (
    <div className="panel-masuk">
      <div className="panel-masuk__kartu">
        <div className="panel-masuk__merek">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/logo.png" alt="MARF" width={54} height={44} />
          <div>
            <strong>MARF Showroom</strong>
            <span>Panel Admin &amp; Staff</span>
          </div>
        </div>

        <FormMasuk />

        <p className="panel-masuk__kaki">
          Hanya untuk pegawai MARF. Hubungi admin kalau lupa kata sandi.
        </p>
      </div>
    </div>
  );
}
