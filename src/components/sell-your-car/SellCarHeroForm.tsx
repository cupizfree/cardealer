"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Migrated from ../aurexo/sell-your-car.html lines 484-573. The "Nomor Polisi"/"VIN" tab switch is
// real (matches the same `menu-tab`/`content-inner active` pattern already reused for
// `ListingDetailsSidebar`'s Cash/Finance tabs) — clicking a tab swaps which form shows, both forms are
// otherwise identical (VIN Number + Zip Code fields, different ids per source: `VINNumber1`/`ZipCode1`
// on the License Plate pane vs. `VINNumber2`/`ZipCode` on the VIN pane, preserved verbatim). "Get
// Started" is `type="button"` with no handler anywhere in source — UI_ONLY, same treatment as the
// financing calculators (LISTING_DATA_MAP.md #6).
export default function SellCarHeroForm() {
  const [tab, setTab] = useState<"license" | "vin">("vin");

  return (
    <div className="row">
      <div className="col-lg-6 lg-mb-40">
        <h2 className="font-weight-600 mb-20 capitalize mt-12">Mau jual mobil Anda?</h2>

        <p className="text-secondary h7 line-height-28 mb-40">
          Jawab beberapa pertanyaan tentang kendaraan Anda, lalu terhubung dengan ribuan showroom tersertifikasi yang siap membayar mobil bekas Anda langsung.
        </p>

        <ul className="flex flex-col gap-16 mb-38">
          <li className="flex gap-4">
            <Image className="w-24 h-24" src="/assets/icons/check.svg" alt="check" width={24} height={24} />
            <p className="h5 capitalize">Transaksi aman dan balik nama dokumen</p>
          </li>
          <li className="flex gap-4">
            <Image className="w-24 h-24" src="/assets/icons/check.svg" alt="check" width={24} height={24} />
            <p className="h5 capitalize">Komunitas pembeli terverifikasi</p>
          </li>
          <li className="flex gap-4">
            <Image className="w-24 h-24" src="/assets/icons/check.svg" alt="check" width={24} height={24} />
            <p className="h5 capitalize">Riwayat kendaraan gratis</p>
          </li>
        </ul>

        <div className="flex gap-40 items-center sm-flex-col sm-items-start sm-gap-16">
          <Link href="/contact-us" className="btn btn-primary btn-large-3 font-weight-600">
            Hubungi Kami
          </Link>

          <a href="#" className="flex gap-16">
            <Image src="/assets/icons/PhoneCall-3.svg" alt="PhoneCall" width={24} height={24} />
            <div className="mt2">
              <span className="text-sm text-secondary">Ada Pertanyaan?</span>
              <p className="h4">1-555-678-8888</p>
            </div>
          </a>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="flat-tabs about-form">
          <div className="overflow-x-auto mb-26">
            <ul className="menu-tab menu-tab-style7 large">
              <li className={tab === "license" ? "active" : undefined} onClick={() => setTab("license")}>
                Nomor Polisi
              </li>
              <li className={tab === "vin" ? "active" : undefined} onClick={() => setTab("vin")}>
                VIN
              </li>
            </ul>
          </div>

          <div className="content-tab">
            <div className={`content-inner${tab === "license" ? " active" : ""}`}>
              <div className="about-form">
                <form action="#" className="calculate-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 gap-15 mb-20">
                    <div>
                      <p className="mb-8">Masukkan Nomor Rangka</p>
                      <input className="active input-large" placeholder="Enter the 17-digit VIN" id="VINNumber1" name="VINNumber1" type="text" required />
                    </div>

                    <div>
                      <p className="mb-8">Kode Pos</p>
                      <input className="input-large" id="ZipCode1" name="ZipCode1" placeholder="Zip code" type="text" required />
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary btn-large font-weight-600 w-full">
                    Mulai
                  </button>
                </form>
              </div>
            </div>

            <div className={`content-inner${tab === "vin" ? " active" : ""}`}>
              <form action="#" className="calculate-form" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 gap-15 mb-28">
                  <div>
                    <p className="mb-8">Masukkan Nomor Rangka</p>
                    <input className="active input-large" placeholder="Enter the 17-digit VIN" id="VINNumber2" name="VINNumber2" type="text" required />
                  </div>

                  <div>
                    <p className="mb-8">Kode Pos</p>
                    <input className="input-large" id="ZipCode" name="ZipCode" placeholder="Zip code" type="text" required />
                  </div>
                </div>
                <button type="button" className="btn btn-primary btn-large font-weight-600 w-full">
                  Mulai
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
