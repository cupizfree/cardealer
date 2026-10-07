"use client";

import { useState } from "react";
import { KONTAK } from "@/data/kontak";
import Image from "next/image";
import { XIcon, InstagramIcon } from "@/components/common/SocialIcons";
import { socialIconPaths } from "@/data/socialIconPaths";
import { minta } from "@/lib/klien";

// Migrated from ../aurexo/contact-us.html lines 469-609. No breadcrumb section on this page (confirmed
// via source grep) — genuinely different from every other `(other-pages)` route migrated so far, not
// an oversight.
//
// The 6 "Follow Us On social media" icons turned out to be assembled from TWO already-existing icon
// sources rather than one: Facebook/TikTok/Amazon/Pinterest are byte-identical to `Footer.tsx`'s own
// social row (moved to shared `socialIconPaths`), while the X and Instagram icons are actually the
// stroke-outline `XIcon`/`InstagramIcon` from `common/SocialIcons.tsx` (about-us/sale-agents' Executive
// Team set) — NOT the footer's fill-logo X/Instagram. Confirmed via direct path-data comparison, not
// assumed from visual similarity. All 6 links are source's own literal dead `href="#"`, preserved as-is.
//
// Form (Nama Depan/Belakang, Email, Telepon, Pesan) kini TERHUBUNG ke backend:
// POST /api/prospek menyimpannya sebagai prospek berstatus "baru", yang lalu muncul
// di panel admin & staff. Sebelumnya form ini murni tampilan (UI_ONLY).
export default function ContactInfoFormSection() {
  const [kirim, setKirim] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [berhasil, setBerhasil] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGalat(null);
    setKirim(true);

    // Simpan elemen form sebelum await — currentTarget jadi null setelah dispatch React.
    const form = event.currentTarget;
    const f = new FormData(form);
    const nama = `${f.get("Firstname") ?? ""} ${f.get("Lastname") ?? ""}`.trim();

    const h = await minta("/api/prospek", {
      method: "POST",
      body: JSON.stringify({
        nama: nama || "Tanpa nama",
        email: String(f.get("SendInquiryemail") ?? ""),
        telepon: String(f.get("SendInquiryphone") ?? ""),
        pesan: String(f.get("message") ?? ""),
        sumber: "kontak",
      }),
    });

    setKirim(false);
    if (!h.ok) {
      setGalat(h.pesan);
      return;
    }
    setBerhasil(true);
    form.reset();
  }

  return (
    <section className="bg-white pb-84">
      <div className="tf-spacing" />
      <div className="container contact-page">
        <div className="grid grid-cols-2 lg-grid-cols-1 gap-30">
          <div className="contact-page-info">
            <p className="h3 mb-12 capitalize">Hubungi Kami</p>
            <p className="text-body-style-2 mb-24">
              Kami siap membantu dengan pertanyaan, keluhan, atau permintaan apa pun—hubungi kami hari ini!
            </p>

            <ul className="grid grid-cols-1 gap-24 mb-24">
              <li className="contact gap-16">
                <div className="icon">
                  <Image src="/assets/icons/MapPin.svg" alt="phone" width={28} height={28} />
                </div>
                <div className="flex flex-col">
                  <p className="h5 mb-8">Alamat Usaha</p>
                  <p className="text-secondary">{KONTAK.alamat}</p>
                </div>
              </li>
              <li className="contact gap-16">
                <div className="icon">
                  <Image src="/assets/icons/PhoneCall.svg" alt="phone" width={24} height={24} />
                </div>
                <div className="flex flex-col">
                  <p className="h5 mb-8">Hubungi Kami</p>
                  <a href={KONTAK.teleponHref} className="text-secondary">
                      {KONTAK.telepon}
                    </a>
                </div>
              </li>
              <li className="contact gap-16">
                <div className="icon">
                  <Image src="/assets/icons/Alarm-white.svg" alt="phone" width={32} height={32} />
                </div>
                <div className="flex flex-col">
                  <p className="h5 mb-8">Jam Kerja</p>
                  <p className="text-secondary">Sen-Jum: 08.00 - 18.00</p>
                  <p className="text-secondary">Minggu: Tutup</p>
                </div>
              </li>
            </ul>

            <p className="h5 mb-20 capitalize">Ikuti Kami di media sosial:</p>

            <ul className="contact-page-info-social flex gap-8">
              <li>
                <a href="#" className="hover-fill-white">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {socialIconPaths.facebook.map((d, i) => (
                      <path key={i} d={d} fill="#1C1C1C" />
                    ))}
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" className="hover-stroke-white">
                  <XIcon stroke="#1C1C1C" />
                </a>
              </li>
              <li>
                <a href="#" className="hover-stroke-white">
                  <InstagramIcon stroke="#1C1C1C" />
                </a>
              </li>
              <li>
                <a href="#" className="hover-fill-white">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {socialIconPaths.tiktok.map((d, i) => (
                      <path key={i} d={d} fill="#1C1C1C" />
                    ))}
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" className="hover-fill-white">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {socialIconPaths.amazon.map((d, i) => (
                      <path key={i} d={d} fill="#1C1C1C" />
                    ))}
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" className="hover-fill-white">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {socialIconPaths.pinterest.map((d, i) => (
                      <path key={i} d={d} fill="#1C1C1C" />
                    ))}
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-white radius-20 contact-page-form">
            <p className="h3 mb-12 capitalize">hubungi kami</p>
            <p className="text-body-style-2 mb-32">Kami senang mendengar dari Anda! Jika Anda punya pertanyaan</p>

            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-2 md-grid-cols-1 gap-x-20 gap-y-24 mb-22">
                <div className="md-col-span-2 padding-0">
                  <p className="mb-8">Nama Depan</p>
                  <input className="active input-large" id="Firstname" name="Firstname" type="text" placeholder="Masukkan nama depan Anda" required />
                </div>
                <div className="md-col-span-2 padding-0">
                  <p className="mb-8">Nama Belakang</p>
                  <input className="input-large" placeholder="Masukkan nama belakang Anda" id="Lastname" name="Lastname" type="text" required />
                </div>
                <div className="md-col-span-2 padding-0">
                  <p className="mb-8">Email</p>
                  <input className="input-large" name="SendInquiryemail" id="SendInquiryemail" type="email" placeholder="Masukkan alamat email Anda" required />
                </div>
                <div className="md-col-span-2 padding-0">
                  <p className="mb-8">Nomor Telepon</p>
                  <input placeholder="Masukkan nomor telepon Anda" className="input-large" name="SendInquiryphone" id="SendInquiryphone" type="tel" required />
                </div>
                <div className="col-span-2 padding-0">
                  <p className="mb-8">Pesan</p>
                  <textarea placeholder="Pesan Anda*" rows={3} tabIndex={5} name="message" className="message" id="message" required />
                </div>
              </div>

              {galat && (
                <p className="mb-16" style={{ color: "#C8171F" }}>
                  {galat}
                </p>
              )}
              {berhasil && (
                <p className="mb-16" style={{ color: "#0f9d58" }}>
                  Terima kasih! Pesan Anda sudah masuk — tim MARF akan menghubungi Anda.
                </p>
              )}

              <button type="submit" className="btn btn-primary btn-large font-weight-600 w-full" disabled={kirim}>
                {kirim ? "Mengirim…" : "Kirim Pesan"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
