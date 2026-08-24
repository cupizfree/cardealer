"use client";

import { useState } from "react";
import Image from "next/image";

// Migrated from ../aurexo/check-out.html lines 522-703. Same `.flat-accordion`/`.flat-toggle`/
// `.toggle-title`/`.toggle-content` widget as `common/FaqAccordion` (traced `app.js`'s
// `flatAccordion()` in full again — same real single-open handler, this time keyed by which payment
// radio is selected rather than a question index) — a new component rather than reusing `FaqAccordion`
// verbatim since the title row here holds a radio + brand icon + label instead of a question string,
// and each panel's content is a payment form, not FAQ text. Same CSS grid-rows animation technique
// (300ms, matching source's own `slideDown`/`slideUp` duration) instead of the jQuery show/hide.
//
// Every one of the 4 panels' own fields (Name On Card/Card Numbers/mm-yy/CVV/Save Card checkbox) is
// identical copy-pasted markup — even Apple Pay and PayPal show literal credit-card fields, and the
// PayPal panel's own payment icon `alt` text is "paypalPayment" (not "Payment" like the other 3) — a
// real, disclosed source content quirk, not fixed into something more sensible per payment type. All
// fields are UI_ONLY (no real payment processing on a static template), matching the accordion's own
// real open/close/radio-select behavior, which alone is genuinely real.
type PaymentMethod = {
  key: string;
  radioName: string;
  radioValue: string;
  titleContent: React.ReactNode;
  nameOnCardId: string;
  cardNumbersId: string;
  paymentAlt: string;
  mmyyId: string;
  cvvId: string;
};

const METHODS: PaymentMethod[] = [
  {
    key: "credit-card",
    radioName: "CreditCard",
    radioValue: "35",
    titleContent: <div className="flex items-center gap-8 font-weight-600">Credit Card</div>,
    nameOnCardId: "NameOnCard",
    cardNumbersId: "CardNumbersCardNumbers",
    paymentAlt: "Payment",
    mmyyId: "CardNumbersmmyy2",
    cvvId: "CVV",
  },
  {
    key: "cash-on-delivery",
    radioName: "Cashdelivery",
    radioValue: "32",
    titleContent: <div className="flex items-center gap-8 font-weight-600">Cash on delivery</div>,
    nameOnCardId: "CardNumbersNameOnCard",
    cardNumbersId: "CardNumbersCardNumbers2",
    paymentAlt: "Payment",
    mmyyId: "CardNumbersmmyy",
    cvvId: "CardNumbersCVV",
  },
  {
    key: "apple-pay",
    radioName: "ApplePay",
    radioValue: "34",
    titleContent: (
      <div className="flex items-center gap-8 font-weight-600">
        <Image src="/assets/icons/ApplePay.svg" alt="Apple Pay" width={24} height={24} />
        Apple Pay
      </div>
    ),
    nameOnCardId: "AppleNameOnCard",
    cardNumbersId: "AppleCardNumbers",
    paymentAlt: "Payment",
    mmyyId: "Applemmyy",
    cvvId: "AppleCVV",
  },
  {
    key: "paypal",
    radioName: "paypal",
    radioValue: "35",
    titleContent: <Image src="/assets/icons/paypal.svg" alt="Apple Pay" width={92} height={24} />,
    nameOnCardId: "paypalNameOnCard",
    cardNumbersId: "paypalCardNumbers",
    paymentAlt: "paypalPayment",
    mmyyId: "paypalmmyy",
    cvvId: "paypalCVV",
  },
];

export default function PaymentAccordion() {
  const [activeKey, setActiveKey] = useState<string | null>("credit-card");

  return (
    <div className="flat-accordion style-2 flex flex-col gap-20 max-width-930 wow fadeIn mb-40" data-wow-delay=".3s">
      {METHODS.map((method) => {
        const isOpen = activeKey === method.key;
        return (
          <div className={`flat-toggle bg-white${isOpen ? " active" : ""}`} key={method.key}>
            <div
              className={`toggle-title${isOpen ? " active" : ""}`}
              onClick={() => setActiveKey(isOpen ? null : method.key)}
            >
              <div className={`filter-radio${method.key === "paypal" ? " h-full" : ""}`}>
                <input
                  type="radio"
                  name={method.radioName}
                  value={method.radioValue}
                  checked={isOpen}
                  readOnly
                  onClick={(event) => event.stopPropagation()}
                />
                <div className={`label-focus${method.key === "paypal" ? " top-0" : ""}`}>{method.titleContent}</div>
              </div>
              <span className="icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 15L12 7L4 15" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 300ms ease",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                {/* `.toggle-content` has a base CSS rule of `display: none` (flat-accordion.scss) —
                    source's own jQuery `slideDown()` overrides that with an inline `display: block`
                    directly on this element, same as `FaqAccordion`'s own precedent; missing this
                    override left the panel permanently collapsed regardless of the outer grid-rows
                    wrapper's state, caught via Playwright bounding-box check. */}
                <div className="toggle-content" style={{ display: "block" }}>
                  <p className="mb-20 text-secondary">
                    Make your payment directly into our bank account. Your order will not be shipped until the
                    funds have cleared in our account.
                  </p>
                  <div className="grid grid-cols-2 lg-grid-cols-1 gap-16">
                    <div className="col-span-2 padding-0">
                      <input className="input-large mb-6" type="text" placeholder="Name On Card*" id={method.nameOnCardId} />
                    </div>

                    <div className="relative col-span-2 padding-0 input-payment-wrapper">
                      <input className="input-large mb-6" type="text" placeholder="Card Numbers*" id={method.cardNumbersId} />
                      <Image className="payment h-16" src="/assets/icons/Payment.png" alt={method.paymentAlt} width={120} height={16} />
                    </div>

                    <div className="mb-8 col-span-2 padding-0 grid grid-cols-2 lg-grid-cols-1 gap-16">
                      <input className="input-large" type="text" placeholder="mm/yy*" id={method.mmyyId} />
                      <input className="input-large" type="text" placeholder="CVV*" id={method.cvvId} />
                    </div>

                    <label className="filter-checkbox style-5">
                      <input type="checkbox" name="features" value="touch-screen" defaultChecked />
                      <span>Save Card Details</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
