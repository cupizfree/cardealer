// Kerangka halaman masuk / lupa sandi / atur ulang sandi.
// Dipakai bersama supaya tampilannya persis sama dan tidak perlu disalin tiga kali.

import type { ReactNode } from "react";

export default function KerangkaSandi({
  judul,
  children,
  catatan,
}: {
  judul: string;
  children: ReactNode;
  catatan?: ReactNode;
}) {
  return (
    <div className="marf-panel flex min-h-screen items-center justify-center bg-kertas bg-[radial-gradient(1000px_480px_at_12%_-10%,rgba(200,23,31,0.13),transparent_62%),radial-gradient(760px_420px_at_105%_108%,rgba(20,22,26,0.11),transparent_60%)] p-6 font-sans text-tinta antialiased">
      <div className="w-full max-w-[400px] rounded-2xl border border-garis bg-white px-7 pb-6 pt-8 shadow-[0_20px_44px_-22px_rgba(16,24,40,0.28),0_2px_6px_rgba(16,24,40,0.04)]">
        <div className="mb-6 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/logo.png" alt="MARF" className="h-[42px] w-auto" />
          <div className="min-w-0">
            <strong className="block text-[16px] font-extrabold tracking-tight">MARF Showroom</strong>
            <span className="block text-[11.5px] font-semibold uppercase tracking-[0.05em] text-redup">
              {judul}
            </span>
          </div>
        </div>

        {children}

        {catatan && (
          <p className="mt-5 border-t border-garis pt-4 text-center text-[11.5px] leading-relaxed text-redup">
            {catatan}
          </p>
        )}
      </div>
    </div>
  );
}
