// Migrated from ../aurexo/home-02.html lines 4263-4306 (`.box-content`). Real, source-confirmed
// content bug preserved verbatim: box 2 duplicates box 1's "1. List Your Car" copy instead of its own
// distinct step (boxes 3/4 correctly read "2. Get Paid Securely"/"3. Hand Over the Car"), so there are
// really only 3 distinct steps across 4 boxes. `.box-content--effect` reveal-on-hover is pure CSS
// (`assets/scss/component/box.scss`), no JS/state needed — same `:hover`/`:has()`-driven pattern already
// used by `financing/HowItWorksSection.tsx`/`sell-your-car/HowItWorksSection.tsx`, though this section
// uses a different class family (`.box-content`, not `.sell-your-car-box`) since the DOM genuinely
// differs, per the variant classification rule.
const BOXES = [
  {
    title: "1. List Your Car",
    description:
      "Provide your car details, set your price, and publish your listing. Many platforms offer low-cost or free options to maximize visibility.",
    effectTitle: "Sell your car your way",
    effectDescription: "Get an offer online and quickly complete the transaction with a local dealer.",
    active: true,
  },
  {
    title: "1. List Your Car",
    description:
      "Provide your car details, set your price, and publish your listing. Many platforms offer low-cost or free options to maximize visibility.",
    effectTitle: "Sell your car your way",
    effectDescription: "Get an offer online and quickly complete the transaction with a local dealer.",
    active: false,
  },
  {
    title: "2. Get Paid Securely",
    description:
      "The buyer pays online through a secure payment system, and funds are transferred to you quickly and transparently, with reasonable transaction fees.",
    effectTitle: "Get Paid Securely",
    effectDescription: "Get an offer online and quickly complete the transaction with a local dealer.",
    active: false,
  },
  {
    title: "3. Hand Over the Car",
    description:
      "Once payment is confirmed, hand over the car to the buyer. If you have an outstanding loan, the platform may assist in settling it for you.",
    effectTitle: "Hand Over the Car",
    effectDescription: "Get an offer online and quickly complete the transaction with a local dealer.",
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
