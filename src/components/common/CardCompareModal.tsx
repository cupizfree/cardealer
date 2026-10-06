"use client";

import Image from "next/image";
import Modal from "./Modal";

// Quick-view 2-vehicle compare table (#CardModal). Not triggered from any control on
// listing-grid4-columns.html — only listing-details-1.html's own "Bandingkan" button (see
// `CompareButton.tsx`) opens it, which is why this was mounted globally ahead of that page's own
// migration. Content is Aurexo's own static demo comparison (Audi A6 Avant E-Tron vs. 2024 Hyundai
// Elantra), preserved verbatim rather than parameterized, since the source itself never varies it.
const rows: Array<{ icon: string; label: string; left: string; right: string }> = [
  { icon: "mileage.svg", label: "Jarak Tempuh:", left: "51600 km", right: "42600 km" },
  { icon: "years.svg", label: "Tahun:", left: "2022", right: "2021" },
  { icon: "fuel.svg", label: "Bahan Bakar:", left: "Benzin + Plin", right: "Benzin + Plin" },
  { icon: "color.svg", label: "Warna:", left: "Putih", right: "Emas" },
  { icon: "location.svg", label: "Lokasi:", left: "Purwokerto", right: "Purwokerto" },
  { icon: "interior.svg", label: "Interior:", left: "Hitam Jet", right: "Cokelat Jet" },
  { icon: "engine.svg", label: "Mesin:", left: "1.5L Inline", right: "2.5L Inline" },
  { icon: "transmission.svg", label: "Transmisi:", left: "Matic", right: "Matic" },
  { icon: "VIN.svg", label: "VIN:", left: "1G1ZD5ST0PF", right: "1G1ZD5ST0PF" },
  { icon: "QrCode.svg", label: "Nomor Stok:", left: "165921", right: "165921" },
];

export default function CardCompareModal() {
  return (
    <Modal id="CardModal">
      <div className="card-details">
        <div className="flex mb-40">
          <div className="w-24" />
          <div className="w-76 grid grid-cols-2 gap-60">
            <div>
              <Image className="mb-10 radius-16" src="/assets/images/card/card-50.jpg" alt="" width={200} height={140} />
              <p className="h4 text-center">Toyota Avanza 1.5 G</p>
            </div>
            <div>
              <Image className="mb-10 radius-16" src="/assets/images/card/card-51.jpg" alt="" width={200} height={140} />
              <p className="h4 text-center">2024 Hyundai Elantra</p>
            </div>
          </div>
        </div>

        <table className="card-details--table">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td>
                  <div className="flex items-center gap-8">
                    <Image src={`/assets/icons/${row.icon}`} alt="mileage" width={16} height={16} />
                    <span>{row.label}</span>
                  </div>
                </td>
                <td>{row.left}</td>
                <td>{row.right}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
