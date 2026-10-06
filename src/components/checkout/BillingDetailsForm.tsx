"use client";

import CustomSelect from "@/components/common/CustomSelect";

const COUNTRY_OPTIONS = [
  { value: "1", label: "Kanada" },
  { value: "2", label: "Vietnam" },
];

// Source's own State select reuses the exact same "Canada"/"Viet Nam" option list as the Country
// select above it (confirmed via direct source read) — clearly a copy-paste placeholder, not a real
// per-country state list. Preserved verbatim rather than inventing real state/province options.
const STATE_OPTIONS = COUNTRY_OPTIONS;

// Migrated from ../aurexo/check-out.html lines 485-520. All fields UI_ONLY (no backend on a static
// template) except the Country/State selects, which use the real `CustomSelect` widget (open/close +
// value selection genuinely works, per `app.js`'s `selectOptions()`).
export default function BillingDetailsForm() {
  return (
    <>
      <p className="h4 mb-20">Detail Penagihan:</p>
      <div className="grid grid-cols-2 md-grid-cols-1 gap-16 mb-35">
        <input className="input-large mb-6 md-col-span-2" type="text" placeholder="Nama Depan*" name="first-name" id="first-name" required />
        <input className="input-large mb-6 md-col-span-2" type="text" placeholder="Nama Belakang*" name="last-name" id="last-name" required />
        <input className="input-large mb-6 md-col-span-2" type="text" placeholder="Alamat Email*" name="EmailAddress" id="EmailAddress" required />
        <input className="input-large mb-6 md-col-span-2" type="text" placeholder="Nomor Telepon*" name="PhoneNumber" id="PhoneNumber" required />

        <div className="mb-6 col-span-2 padding-0">
          <CustomSelect options={COUNTRY_OPTIONS} placeholder="Pilih Negara/Wilayah" name="country" />
        </div>
        <input className="input-large mb-6 md-col-span-2" type="text" placeholder="Kota/Kabupaten*" name="TownCity" id="TownCity" required />
        <input className="input-large mb-6 md-col-span-2" type="text" placeholder="Jalan,..." name="Street" id="Street" />

        <div className="mb-6 padding-0">
          <CustomSelect options={STATE_OPTIONS} placeholder="Pilih Provinsi" name="state" />
        </div>
        <input className="input-large mb-6 md-col-span-2" type="text" placeholder="Kode Pos*" name="Postal" id="Postal" required />
        <div className="col-span-2 padding-0">
          <textarea placeholder="Tulis catatan..." rows={3} tabIndex={5} name="Writenote" className="message" id="Writenote" />
        </div>
      </div>
    </>
  );
}
