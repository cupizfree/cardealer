// Migrated from ../aurexo/calculator.html lines 486-579. A distinct, larger financing-calculator
// shape from the one embedded in `ListingDetailsContent` (6 fields incl. Trade-In/Sales Tax vs. that
// one's 4, and a separate results "Loan Summary" panel instead of an inline 3-value row) — a new
// component, not a variant. Confirmed via source search (no script anywhere touches
// `calculatePrice`/`CalculatorPayment`/`CalculatorTrade`/etc.) that this is UI_ONLY, same as the other
// financing calculator (LISTING_DATA_MAP.md #6) — static `defaultValue`s, no live computation, and
// (unlike the other one) not even a "Calculate" button in source to wire up.
export default function CarPaymentCalculatorSection() {
  return (
    <div className="container">
      <h2 className="text-center mb-12">Car Payment Calculator</h2>
      <p className="mb-40 text-center text-secondary h7 line-height-28">
        Estimate your monthly payments and budget for your next car with ease.
      </p>

      <div className="grid grid-cols-2 gap-40 lg-grid-cols-1">
        <div className="border-box">
          <p className="h3 mb-28">Calculate Your Estimated Monthly</p>
          <form action="#" className="calculate-form">
            <div className="grid grid-cols-1 gap-15">
              <div>
                <p className="mb-8">Car Price</p>
                <input className="active input-large" id="calculatePrice" name="calculatePrice" type="text" defaultValue="$46.300" required />
              </div>

              <div>
                <p className="mb-8">Down Payment</p>
                <input className="input-large" id="CalculatorPayment" name="CalculatorPayment" type="text" defaultValue="$400" required />
              </div>

              <div>
                <p className="mb-8">
                  Loan Term <span className="text-muted">(months)</span>
                </p>
                <select id="CalculatorInterestRate" name="CalculatorInterestRate">
                  <option>36 months</option>
                  <option>24 months</option>
                  <option>12 months</option>
                </select>
              </div>

              <div>
                <p className="mb-8">Trade In Value (Optional)</p>
                <input className="input-large" id="CalculatorTrade" placeholder="$0" name="CalculatorTrade" type="text" required />
              </div>
              <div>
                <p className="mb-8">Interest Rate</p>
                <input className="input-large" id="CalculatorInterestRate2" name="CalculatorInterestRate2" type="text" defaultValue="1.20%" required />
              </div>
              <div>
                <p className="mb-8">Sales Tax</p>
                <input className="input-large" id="CalculatorTax" name="CalculatorTax" type="text" defaultValue="3.00%" required />
              </div>
            </div>
          </form>
        </div>

        <div className="border-box">
          <p className="h3 mb-8">Estimated Monthly Payment*</p>
          <p className="mb-10">
            <span className="text-56 font-weight-600">$1.338</span>
            <span className="h3 font-weight-600">/Month</span>
          </p>
          <p className="h5 mb-28 capitalize">for 3 years</p>
          <div className="divider mb-28 w-full" />

          <p className="h4 mb-20">Loan Summary</p>

          <div className="flex flex-col gap-18 mb-28">
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Car Price</span>
              <span className="h7">$46.300</span>
            </p>
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Down Payment</span>
              <span className="h7">-$400</span>
            </p>
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Trade In Value</span>
              <span className="h7">-$0</span>
            </p>
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Est. Interest (1.20%)</span>
              <span className="h7">+$880</span>
            </p>
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Est. Sales Tax (3.00%)</span>
              <span className="h7">+$1.389</span>
            </p>
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Other Fees</span>
              <span className="h7">Not Included</span>
            </p>
          </div>

          <div className="divider mb-28 w-full" />

          <div className="flex justify-between gap-8 mb-16">
            <p className="h4">Total Loan Amount</p>
            <p className="h4">$48.169</p>
          </div>

          <div className="flex justify-between gap-8">
            <p className="h4">Monthly Payment</p>
            <p className="h4">$1.338</p>
          </div>
        </div>
      </div>
    </div>
  );
}
