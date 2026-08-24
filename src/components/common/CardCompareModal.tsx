"use client";

import Image from "next/image";
import Modal from "./Modal";

// Quick-view 2-vehicle compare table (#CardModal). Not triggered from any control on
// listing-grid4-columns.html — only listing-details-1.html's own "Compare" button (see
// `CompareButton.tsx`) opens it, which is why this was mounted globally ahead of that page's own
// migration. Content is Aurexo's own static demo comparison (Audi A6 Avant E-Tron vs. 2024 Hyundai
// Elantra), preserved verbatim rather than parameterized, since the source itself never varies it.
const rows: Array<{ icon: string; label: string; left: string; right: string }> = [
  { icon: "mileage.svg", label: "Mileage:", left: "51600 km", right: "42600 km" },
  { icon: "years.svg", label: "Years:", left: "2022", right: "2021" },
  { icon: "fuel.svg", label: "Fuel:", left: "Benzin + Plin", right: "Benzin + Plin" },
  { icon: "color.svg", label: "Color:", left: "White", right: "Gold" },
  { icon: "location.svg", label: "Location:", left: "Tampa, FL", right: "Tampa, FL" },
  { icon: "interior.svg", label: "Interior:", left: "Jet Black", right: "Jet Brown" },
  { icon: "engine.svg", label: "Engine:", left: "1.5L Inline", right: "2.5L Inline" },
  { icon: "transmission.svg", label: "Transmission:", left: "Automatic", right: "Automatic" },
  { icon: "VIN.svg", label: "VIN:", left: "1G1ZD5ST0PF", right: "1G1ZD5ST0PF" },
  { icon: "QrCode.svg", label: "Stock Number:", left: "165921", right: "165921" },
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
              <p className="h4 text-center">Audi A6 Avant E-Tron</p>
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
