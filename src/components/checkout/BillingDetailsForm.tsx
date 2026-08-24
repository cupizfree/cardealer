"use client";

import CustomSelect from "@/components/common/CustomSelect";

const COUNTRY_OPTIONS = [
  { value: "1", label: "Canada" },
  { value: "2", label: "Viet Nam" },
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
      <p className="h4 mb-20">Billing Details:</p>
      <div className="grid grid-cols-2 md-grid-cols-1 gap-16 mb-35">
        <input className="input-large mb-6 md-col-span-2" type="text" placeholder="First Name*" name="first-name" id="first-name" required />
        <input className="input-large mb-6 md-col-span-2" type="text" placeholder="Last Name*" name="last-name" id="last-name" required />
        <input className="input-large mb-6 md-col-span-2" type="text" placeholder="Email Address*" name="EmailAddress" id="EmailAddress" required />
        <input className="input-large mb-6 md-col-span-2" type="text" placeholder="Phone Number*" name="PhoneNumber" id="PhoneNumber" required />

        <div className="mb-6 col-span-2 padding-0">
          <CustomSelect options={COUNTRY_OPTIONS} placeholder="Choose Country/Region" name="country" />
        </div>
        <input className="input-large mb-6 md-col-span-2" type="text" placeholder="Town/City*" name="TownCity" id="TownCity" required />
        <input className="input-large mb-6 md-col-span-2" type="text" placeholder="Street,..." name="Street" id="Street" />

        <div className="mb-6 padding-0">
          <CustomSelect options={STATE_OPTIONS} placeholder="Choose State" name="state" />
        </div>
        <input className="input-large mb-6 md-col-span-2" type="text" placeholder="Postal Code*" name="Postal" id="Postal" required />
        <div className="col-span-2 padding-0">
          <textarea placeholder="Write note..." rows={3} tabIndex={5} name="Writenote" className="message" id="Writenote" />
        </div>
      </div>
    </>
  );
}
