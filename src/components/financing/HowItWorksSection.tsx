// Migrated from ../aurexo/financing.html lines 535-561. Same `.sell-your-car-box` card shape already
// used by sell-your-car.html's own "Cara Kerja" (see `sell-your-car/HowItWorksSection.tsx`), but
// genuinely different here: a real CSS modifier `.style-2` (3-column grid instead of 4, see
// `assets/scss/component/box.scss`), only 3 steps instead of 4, and this section additionally has a
// subtitle paragraph + its own `background-light py-100` wrapper that sell-your-car.html's version
// doesn't — different enough content/structure to warrant a separate component rather than overloading
// that one with variant props for a single reuse case. Step 2 carries the same static `.active-step`
// modifier (pure CSS `:has()`-driven, not JS) as sell-your-car.html's step 2 — preserved verbatim.
const steps = [
  {
    number: "1",
    title: "Mulai dengan pengajuan awal",
    description:
      "Isi formulir sederhana dalam beberapa menit, tanpa mempengaruhi kredit Anda, dan lihat hasilnya seketika dari mitra pembiayaan terpercaya.",
  },
  {
    number: "2",
    title: "Cari sesuai anggaran bulanan Anda",
    description:
      "Setelah pra-layak, masukkan uang muka, tenor, dan anggaran bulanan Anda untuk melihat semua pilihan yang sesuai.",
    active: true,
  },
  {
    number: "3",
    title: "Pilih penawaran untuk mobil tersebut",
    description:
      "Setiap penawaran pra-layak berbeda untuk tiap mobil. Pilih mobil, lihat penawaran khusus untuk unit tersebut, lalu bawa ke showroom terdekat.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="background-light py-100">
      <div className="container wow fadeIn" data-wow-delay="0.1s">
        <div className="flex flex-col items-center mb-40">
          <h2 className="capitalize mb-14">Cara kerja</h2>
          <p className="text-secondary h7 line-height-28">
            Temukan mobil yang tepat dengan fitur yang tepat sesuai anggaran Anda.
          </p>
        </div>

        <div className="sell-your-car-box-wrapper style-2">
          {steps.map((step) => (
            <div className={`sell-your-car-box${step.active ? " active-step" : ""}`} key={step.number}>
              <p className="number">{step.number}</p>
              <a href="#" className="h4 font-weight-600 mb-8 capitalize text-center">
                {step.title}
              </a>
              <p className="text-secondary text-center">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
