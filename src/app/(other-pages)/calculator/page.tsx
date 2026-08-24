import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import CarPaymentCalculatorSection from "@/components/calculator/CarPaymentCalculatorSection";
import BrowseByPriceSection from "@/components/calculator/BrowseByPriceSection";
import FaqAccordion from "@/components/common/FaqAccordion";

export const metadata: Metadata = {
  title: "Car Payment Calculator | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

const AUTO_LOAN_BLURB = [
  "An auto loan is a sum of money that you borrow in order to buy a car. The person or organization lending you the money is known as the lender, and the person or organization who borrows the money is the borrower. The borrower agrees to pay back the full amount they borrowed by a certain date in the future. They also pay interest, which is a percentage of the loan amount. They usually pay both these amounts via monthly payments.",
];

const faqItems = [
  {
    question: "What is an Auto Loan?",
    answer: [
      AUTO_LOAN_BLURB[0],
      "Auto loans are very common: this year, according to Consumer Reports, Americans held more than $1.4 trillion in auto loans. This is because most people can't afford to pay full price for a vehicle right away. It's easier to afford smaller monthly payments spread out over a longer period of time.",
      "You can get an auto loan from a bank or credit union. They will look at your credit and other financial information, and decide how much money they are willing to lend you and what interest rate they'll offer. You can also get preapproved for a loan, which doesn't obligate you to borrow money from the bank or credit union that preapproves you. Preapproval lets you approach several different lenders and compare the loan terms and interest rates offered, so you can choose the best one. It's important to understand that the finance company technically owns the car until you pay off the loan.",
    ],
  },
  { question: "How to Calculate an Auto Loan?", answer: AUTO_LOAN_BLURB },
  { question: "Budget & Car Price?", answer: AUTO_LOAN_BLURB },
  { question: "Down Payment?", answer: AUTO_LOAN_BLURB },
  { question: "Trade-In Value?", answer: AUTO_LOAN_BLURB },
  { question: "Sales Tax?", answer: AUTO_LOAN_BLURB },
  { question: "Interest Rate?", answer: AUTO_LOAN_BLURB },
];

// Migrated from ../aurexo/calculator.html. Every FAQ item beyond the first repeats the SAME literal
// "An auto loan is a sum of money..." paragraph verbatim in source (confirmed via direct source read)
// — not a transcription shortcut, source itself never wrote distinct answers for questions 2-7.
export default function CalculatorPage() {
  return (
    <>
      <Header />

      <section className="background-light">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <Link href="/">Pages</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span>Calculator</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="pb-100">
        <div className="tf-spacing-style3" />

        <CarPaymentCalculatorSection />

        <div className="tf-spacing" />

        <BrowseByPriceSection />
      </section>

      <section className="background-light py-100">
        <div className="container">
          <h2 className="mb-40 text-center">Calculator FAQ</h2>
          <div className="max-width-930 mx-auto w-full">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
