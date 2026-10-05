// Migrated from ../aurexo/calculator.html lines 486-579. A distinct, larger financing-calculator
// shape from the one embedded in `ListingDetailsContent` (6 fields incl. Trade-In/Sales Tax vs. that
// one's 4, and a separate results "Ringkasan Pinjaman" panel instead of an inline 3-value row) — a new
// component, not a variant. Confirmed via source search (no script anywhere touches
// `calculatePrice`/`CalculatorPayment`/`CalculatorTrade`/etc.) that this is UI_ONLY, same as the other
// financing calculator (LISTING_DATA_MAP.md #6) — static `defaultValue`s, no live computation, and
// (unlike the other one) not even a "Hitung" button in source to wire up.
export default function CarPaymentCalculatorSection() {
  return (
    <div className="container">
      <h2 className="text-center mb-12">Simulasi Cicilan Mobil</h2>
      <p className="mb-40 text-center text-secondary h7 line-height-28">
        Perkirakan cicilan bulanan dan anggaran mobil berikutnya dengan mudah.
      </p>

      <div className="grid grid-cols-2 gap-40 lg-grid-cols-1">
        <div className="border-box">
          <p className="h3 mb-28">Hitung Perkiraan Cicilan Bulanan</p>
          <form action="#" className="calculate-form">
            <div className="grid grid-cols-1 gap-15">
              <div>
                <p className="mb-8">Harga Mobil</p>
                <input className="active input-large" id="calculatePrice" name="calculatePrice" type="text" defaultValue="$46.300" required />
              </div>

              <div>
                <p className="mb-8">Uang Muka</p>
                <input className="input-large" id="CalculatorPayment" name="CalculatorPayment" type="text" defaultValue="$400" required />
              </div>

              <div>
                <p className="mb-8">
                  Tenor Pinjaman <span className="text-muted">(months)</span>
                </p>
                <select id="CalculatorInterestRate" name="CalculatorInterestRate">
                  <option>36 bulan</option>
                  <option>24 bulan</option>
                  <option>12 bulan</option>
                </select>
              </div>

              <div>
                <p className="mb-8">Nilai Tukar Tambah (Opsional)</p>
                <input className="input-large" id="CalculatorTrade" placeholder="$0" name="CalculatorTrade" type="text" required />
              </div>
              <div>
                <p className="mb-8">Bunga per Tahun</p>
                <input className="input-large" id="CalculatorInterestRate2" name="CalculatorInterestRate2" type="text" defaultValue="1.20%" required />
              </div>
              <div>
                <p className="mb-8">Pajak Penjualan</p>
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
          <p className="h5 mb-28 capitalize">selama 3 tahun</p>
          <div className="divider mb-28 w-full" />

          <p className="h4 mb-20">Ringkasan Pinjaman</p>

          <div className="flex flex-col gap-18 mb-28">
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Harga Mobil</span>
              <span className="h7">$46.300</span>
            </p>
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Uang Muka</span>
              <span className="h7">-$400</span>
            </p>
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Nilai Tukar Tambah</span>
              <span className="h7">-$0</span>
            </p>
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Perk. Bunga (1,20%)</span>
              <span className="h7">+$880</span>
            </p>
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Est. Sales Tax (3.00%)</span>
              <span className="h7">+$1.389</span>
            </p>
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Biaya Lain</span>
              <span className="h7">Tidak Termasuk</span>
            </p>
          </div>

          <div className="divider mb-28 w-full" />

          <div className="flex justify-between gap-8 mb-16">
            <p className="h4">Total Pinjaman</p>
            <p className="h4">$48.169</p>
          </div>

          <div className="flex justify-between gap-8">
            <p className="h4">Cicilan Bulanan</p>
            <p className="h4">$1.338</p>
          </div>
        </div>
      </div>
    </div>
  );
}
