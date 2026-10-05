// Migrated from ../aurexo/home-02.html lines 4263-4306 (`.box-content`). Real, source-confirmed
// content bug preserved verbatim: box 2 duplicates box 1's "1. Pasang Iklan Mobil" copy instead of its own
// distinct step (boxes 3/4 correctly read "2. Pembayaran Aman"/"3. Serah Terima Mobil"), so there are
// really only 3 distinct steps across 4 boxes. `.box-content--effect` reveal-on-hover is pure CSS
// (`assets/scss/component/box.scss`), no JS/state needed — same `:hover`/`:has()`-driven pattern already
// used by `financing/HowItWorksSection.tsx`/`sell-your-car/HowItWorksSection.tsx`, though this section
// uses a different class family (`.box-content`, not `.sell-your-car-box`) since the DOM genuinely
// differs, per the variant classification rule.
const BOXES = [
  {
    title: "1. Pasang Iklan Mobil",
    description:
      "Masukkan detail mobil, tentukan harga, lalu pasang iklan Anda. Banyak platform menyediakan opsi murah atau gratis agar iklan Anda cepat terlihat.",
    effectTitle: "Jual mobil Anda, dengan cara Anda",
    effectDescription: "Dapatkan penawaran secara online dan selesaikan transaksi dengan cepat bersama showroom rekanan.",
    active: true,
  },
  {
    title: "1. Pasang Iklan Mobil",
    description:
      "Masukkan detail mobil, tentukan harga, lalu pasang iklan Anda. Banyak platform menyediakan opsi murah atau gratis agar iklan Anda cepat terlihat.",
    effectTitle: "Jual mobil Anda, dengan cara Anda",
    effectDescription: "Dapatkan penawaran secara online dan selesaikan transaksi dengan cepat bersama showroom rekanan.",
    active: false,
  },
  {
    title: "2. Pembayaran Aman",
    description:
      "Pembeli membayar secara online melalui sistem pembayaran yang aman, dan dana diteruskan kepada Anda dengan cepat dan transparan, dengan biaya transaksi yang wajar.",
    effectTitle: "Pembayaran Aman",
    effectDescription: "Dapatkan penawaran secara online dan selesaikan transaksi dengan cepat bersama showroom rekanan.",
    active: false,
  },
  {
    title: "3. Serah Terima Mobil",
    description:
      "Setelah pembayaran terkonfirmasi, serahkan mobil kepada pembeli. Jika masih ada cicilan berjalan, platform dapat membantu melunasinya untuk Anda.",
    effectTitle: "Serah Terima Mobil",
    effectDescription: "Dapatkan penawaran secara online dan selesaikan transaksi dengan cepat bersama showroom rekanan.",
    active: false,
  },
];

export default function HowItWorksBoxes() {
  return (
    <section>
      <div className="container-fluid px-0">
        <div className="grid grid-cols-4 md-grid-cols-1">
          {BOXES.map((box, index) => (
            <a href="#" className={`box-content${box.active ? " active" : ""}`} key={index}>
              <p className="h4 mb-8">{box.title}</p>
              <p className="text-secondary">{box.description}</p>

              <div className="box-content--effect">
                <p className="h3 mb-8 text-white capitalize">{box.effectTitle}</p>
                <p className="text-white">{box.effectDescription}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
