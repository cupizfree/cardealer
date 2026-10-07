import Image from "next/image";
import { KONTAK } from "@/data/kontak";
import Link from "next/link";

// Migrated from about-us.html lines 483-534 (the container only — source nests this inside the SAME
// `<section class="pb-100">` as Testimonials right after it, so that wrapper lives in page.tsx, not
// here). `wow`/`data-wow-*` attributes preserved verbatim (per this migration's explicit instruction)
// — now real, driven globally by `WowInit`.
export default function AboutHero() {
  return (
      <div className="container">
        <h2>Tentang Kami</h2>
        <div className="tf-spacing-style3" />

        <div className="row">
          <div className="col-lg-6">
            <div className="about-box">
              <Image
                className="main-img radius-16 wow fadeIn"
                data-wow-delay="0.1s"
                src="/assets/images/pages/about-1.jpg"
                alt=""
                width={885}
                height={885}
              />
              <div className="sub-img wow fadeInUp" data-wow-delay="0.2s">
                <Image src="/assets/images/pages/about-2.jpg" alt="" width={420} height={420} />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="about-content">
              <h2 className="font-weight-600 mb-20">Wujudkan Mobil Impian Anda Bersama Kami</h2>

              <p className="text-secondary h7 line-height-28 mb-32">
                Di MARF, kami membuat proses memiliki mobil jadi sederhana dan terjangkau: panduan dari
                orang yang paham, pilihan yang disesuaikan kebutuhan, dan pelayanan yang tidak berbelit.
                Tim kami membantu Anda menemukan unit yang tepat tanpa drama.
              </p>

              <ul className="flex flex-col gap-24 mb-32">
                <li className="flex gap-4">
                  <Image className="w-24 h-24" src="/assets/icons/check.svg" alt="check" width={24} height={24} />
                  <p className="h5">Tim Berpengalaman</p>
                </li>
                <li className="flex gap-4">
                  <Image className="w-24 h-24" src="/assets/icons/check.svg" alt="check" width={24} height={24} />
                  <p className="h5">Harga Terbuka, Tanpa Biaya Tersembunyi</p>
                </li>
                <li className="flex gap-4">
                  <Image className="w-24 h-24" src="/assets/icons/check.svg" alt="check" width={24} height={24} />
                  <p className="h5">Proses Cepat, Transaksi Lancar</p>
                </li>
              </ul>

              <div className="flex gap-28 items-center">
                <Link href="/contact-us" className="btn btn-primary btn-large font-weight-600">
                  Hubungi Kami
                </Link>

                <a href="#" className="flex gap-16">
                  <Image src="/assets/icons/PhoneCall-3.svg" alt="PhoneCall" width={24} height={24} />
                  <div className="mt2">
                    <span className="text-sm text-secondary">Ada Pertanyaan?</span>
                    <p className="h4">{KONTAK.telepon}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
