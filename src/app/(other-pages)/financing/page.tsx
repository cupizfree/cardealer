import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import FinancingHero from "@/components/financing/FinancingHero";
import HowItWorksSection from "@/components/financing/HowItWorksSection";
import NewsTipsSection from "@/components/financing/NewsTipsSection";
import FaqAccordion from "@/components/common/FaqAccordion";

export const metadata: Metadata = {
  title: "Financing | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/financing.html. The "Auto financing FAQ" section is byte-identical to
// sell-your-car.html's own FAQ (same 4 questions/answers, confirmed via source diff) — including
// questions literally about "selling my car" on this financing page, a real source copy-paste
// mismatch, not a transcription error here — reproduced verbatim via the same shared `FaqAccordion`.
const faqItems = [
  {
    question: "What paperwork is needed to sell my car?",
    answer: [
      "Usually, you will need the current registration for the vehicle signed by all registered owners, along with the car title and your ID or driver's license. You may also need to provide warranty information. To complete your sale transaction, you will likely need to complete a bill of sale.",
      "Check with your local DMV to confirm what you'll need in your state.",
    ],
  },
  {
    question: "Can I sell my car if I still owe money on it?",
    answer: [
      "An auto loan is a sum of money that you borrow in order to buy a car. The person or organization lending you the money is known as the lender, and the person or organization who borrows the money is the borrower. The borrower agrees to pay back the full amount they borrowed by a certain date in the future. They also pay interest, which is a percentage of the loan amount. They usually pay both these amounts via monthly payments.",
    ],
  },
  {
    question: "Can I sell my car if I am leasing?",
    answer: [
      "An auto loan is a sum of money that you borrow in order to buy a car. The person or organization lending you the money is known as the lender, and the person or organization who borrows the money is the borrower. The borrower agrees to pay back the full amount they borrowed by a certain date in the future. They also pay interest, which is a percentage of the loan amount. They usually pay both these amounts via monthly payments.",
    ],
  },
  {
    question: "What are the benefits of selling with Aurexo?",
    answer: [
      "An auto loan is a sum of money that you borrow in order to buy a car. The person or organization lending you the money is known as the lender, and the person or organization who borrows the money is the borrower. The borrower agrees to pay back the full amount they borrowed by a certain date in the future. They also pay interest, which is a percentage of the loan amount. They usually pay both these amounts via monthly payments.",
    ],
  },
];

export default function FinancingPage() {
  return (
    <>
      <Header />

      <section className="background-light mb-32">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span>Pages</span>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span>Financing</span>
            </li>
          </ul>
        </div>
      </section>

      <FinancingHero />

      <HowItWorksSection />

      <NewsTipsSection />

      <section className="background-light py-100">
        <div className="container">
          <h2 className="mb-40 text-center capitalize">Auto financing FAQ</h2>
          <div className="max-width-930 mx-auto w-full">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
