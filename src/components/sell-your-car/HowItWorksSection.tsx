// Migrated from ../aurexo/sell-your-car.html lines 581-608. Step 2 carries source's own static
// `.active-step` modifier — a pure-CSS `:has()`-driven progress-line highlight (see
// assets/scss/component/box.scss), not JS-driven — preserved verbatim, same "one item permanently
// marked as the demo's current step" precedent as `.sale-agent-box.active`/`.dealer-box.active`.
const steps = [
  { number: "1", title: "Masukkan Detail Mobil Anda", description: "Masukkan informasi mobil Anda untuk mendapat perkiraan nilai seketika." },
  { number: "2", title: "Sempurnakan Nilai Mobil Anda", description: "Sesuaikan faktor seperti warna dan jarak tempuh untuk melihat pengaruhnya pada nilai mobil Anda.", active: true },
  { number: "3", title: "Receive Your Offer", description: "Siap jual? Dapatkan penawaran khusus dari showroom terdekat." },
  { number: "4", title: "Complete the Sale Easily", description: "Finalize the deal with secure transactions & hassle-free paperwork assistance." },
];

export default function HowItWorksSection() {
  return (
    <div className="container wow fadeInUp" data-wow-delay="0.1s">
      <div className="flex justify-center mb-40">
        <h2 className="">Cara Kerja</h2>
      </div>

      <div className="sell-your-car-box-wrapper">
        {steps.map((step) => (
          <div className={`sell-your-car-box${step.active ? " active-step" : ""}`} key={step.number}>
            <p className="number">{step.number}</p>
            <a href="#" className="h4 font-weight-600 mb-8">
              {step.title}
            </a>
            <p className="text-secondary text-center">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
