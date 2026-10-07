import Image from "next/image";
import Link from "next/link";
import SendInquiryForm from "@/components/common/SendInquiryForm";
import { allDealers } from "@/data/dealers";

// Kotak "Lokasi" di halaman detail tim.
//
// Sebelumnya beralamat "6205 Peachtree Dunwoody Rd, Atlanta, GA 30328" dengan
// dua nomor Amerika (1-555-678-8888 / -9999), dan peta yang menunjuk New York
// (2d-74.22/3d40.48). Itu alamat kantor templat asal — bukan MARF, dan tidak
// ada hubungannya dengan Purwokerto. Nomor 555 juga nomor fiktif di Amerika,
// jadi siapa pun yang menekan "Telepon Showroom" tidak akan menghubungi siapa
// pun.
//
// Sekarang dibaca dari `allDealers` — sumber yang sama dengan halaman showroom,
// jadi alamat dan nomornya tidak bisa lagi berbeda antar halaman.
export default function AgentSidebar() {
  const showroom = allDealers[0];

  return (
    <div className="innerpage__sidebar">
      <div className="listing-details--sidebar-box mb-40">
        <div className="listing-details--contact">
          <p className="h4 mb-16">Lokasi</p>

          <div className="widget-gg-map flex radius-8 overflow-hidden mb-28">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d97101.88872869895!2d109.2396016!3d-7.4245941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1689125037376!5m2!1svi!2s"
              height={234}
              style={{ border: 0, width: "100%" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <ul className="contact-info mb-20">
            <li>
              <p className="icon">
                <Image src="/assets/icons/MapPin.svg" alt="phone" width={20} height={20} />
              </p>
              <div className="flex flex-col gap-4">
                <p>{showroom.address}</p>
                <Link
                  href={`/dealer-details/${showroom.slug}`}
                  className="text-underline text-highlight text-sm"
                >
                  Petunjuk Arah
                </Link>
              </div>
            </li>
          </ul>
          <ul className="contact-info mb-28">
            <li className="items-center">
              <p className="icon">
                <Image src="/assets/icons/PhoneCall.svg" alt="phone" width={20} height={20} />
              </p>
              <div className="flex flex-col">
                {showroom.phones.map((nomor) => (
                  <a key={nomor} href={`tel:${nomor.replace(/\D/g, "")}`}>
                    {nomor}
                  </a>
                ))}
              </div>
            </li>
          </ul>

          <Link
            href={`/dealer-details/${showroom.slug}`}
            className="btn btn-medium btn-primary-3 font-weight-600 mb-12 gap-5"
          >
            <Image src="/assets/icons/PhoneCall-2.svg" alt="phone" width={20} height={20} />
            Telepon Showroom
          </Link>

          <a
            href={`https://wa.me/${showroom.phones[0].replace(/\D/g, "").replace(/^0/, "62")}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-medium btn-primary-4 font-weight-600 gap-5"
          >
            <Image src="/assets/icons/ChatCircleDots.svg" alt="phone" width={20} height={20} />
            Chat WhatsApp
          </a>
        </div>
      </div>

      <SendInquiryForm />
    </div>
  );
}
