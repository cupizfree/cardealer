import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import FaqsAccordionSections, { type FaqSection } from "@/components/faqs/FaqsAccordionSections";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

const PURCHASE_STEPS_ANSWER = [
  "To purchase a car from our dealership, start by exploring our inventory online or visiting us in person to find the vehicle that suits your needs. Schedule a test drive to ensure it's the right fit, then review financing or leasing options with our team.",
  "Provide the necessary documents, such as your ID, proof of insurance, and income verification. Once terms are agreed upon, finalize the paperwork, inspect the car, and drive away with your new vehicle!",
];
const PURCHASE_STEPS_FIRST_PARAGRAPH = [PURCHASE_STEPS_ANSWER[0]];
const AUTO_LOAN_BLURB = [
  "An auto loan is a sum of money that you borrow in order to buy a car. The person or organization lending you the money is known as the lender, and the person or organization who borrows the money is the borrower. The borrower agrees to pay back the full amount they borrowed by a certain date in the future. They also pay interest, which is a percentage of the loan amount. They usually pay both these amounts via monthly payments.",
];

// Migrated from ../aurexo/faqs.html. 3 accordion groups, 12 questions total. Source itself reuses the
// same two answer texts across most questions (`PURCHASE_STEPS_ANSWER`'s 2 paragraphs for each group's
// 1st question, `PURCHASE_STEPS_FIRST_PARAGRAPH` for each group's 2nd, `AUTO_LOAN_BLURB` for the rest)
// — not a transcription shortcut, confirmed via direct source read that all 3 groups repeat this same
// pattern verbatim. See `FaqsAccordionSections` for why this needs its own component (single-open
// state shared across all 3 groups, not the 3 independent `FaqAccordion` instances this would
// otherwise look like).
const faqSections: FaqSection[] = [
  {
    heading: "How To Buy?",
    items: [
      { question: "Steps to purchase a car from our dealership?", answer: PURCHASE_STEPS_ANSWER },
      { question: "Required documents for financing or leasing?", answer: PURCHASE_STEPS_FIRST_PARAGRAPH },
      { question: "Options for reserving or pre-ordering a vehicle?", answer: AUTO_LOAN_BLURB },
      { question: "Available payment methods and financing plans?", answer: AUTO_LOAN_BLURB },
      { question: "How to schedule a test drive before buying?", answer: AUTO_LOAN_BLURB },
    ],
  },
  {
    heading: "Exchanges & Returns",
    items: [
      { question: "Policies on vehicle exchanges after purchase?", answer: PURCHASE_STEPS_ANSWER },
      { question: "Conditions for returning a rental car early?", answer: PURCHASE_STEPS_FIRST_PARAGRAPH },
      { question: "Timeframes for initiating an exchange or return?", answer: AUTO_LOAN_BLURB },
      { question: "Documentation needed for processing exchanges?", answer: AUTO_LOAN_BLURB },
    ],
  },
  {
    heading: "Refund Questions",
    items: [
      { question: "Eligibility for refunds on purchases or deposits?", answer: PURCHASE_STEPS_ANSWER },
      { question: "How refunds are processed for canceled rentals?", answer: PURCHASE_STEPS_FIRST_PARAGRAPH },
      { question: "Timeframes for receiving a refund?", answer: AUTO_LOAN_BLURB },
    ],
  },
];

export default function FaqsPage() {
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
              <span>Frequently Asked Questions</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-white pb-84">
        <FaqsAccordionSections pageHeading="Frequently Asked Questions" sections={faqSections} />
      </section>

      <Footer />
    </>
  );
}
