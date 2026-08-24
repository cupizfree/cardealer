import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SellCarHeroForm from "@/components/sell-your-car/SellCarHeroForm";
import HowItWorksSection from "@/components/sell-your-car/HowItWorksSection";
import GetInTouchBanner from "@/components/sell-your-car/GetInTouchBanner";
import WhyChooseUs from "@/components/about-us/WhyChooseUs";
import FaqAccordion from "@/components/common/FaqAccordion";

export const metadata: Metadata = {
  title: "Sell Your Car | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

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

// Migrated from ../aurexo/sell-your-car.html. Source's breadcrumb "Pages" crumb is a plain `<span>`
// here (not a link, unlike every other page's clickable "Pages" crumb) — confirmed via direct source
// read, reproduced as non-interactive rather than assumed to be a link. "Why Choose Us" section is
// byte-identical to about-us.html's own (same heading/checklist/stat-counters) — reused via the
// existing `WhyChooseUs` component; its "Find Your Car Now!" CTA already links to `/sell-your-car`
// (this exact page), matching source's own self-referential href.
export default function SellYourCarPage() {
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
              <span>Sell Your Car</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="pb-100">
        <div className="container">
          <h2>Sell Your Car</h2>
          <div className="tf-spacing-style3" />

          <SellCarHeroForm />
        </div>

        <div className="tf-spacing-style3" />
        <div className="divider w-full" />
        <div className="tf-spacing-style3" />

        <HowItWorksSection />
      </section>

      <WhyChooseUs />

      <GetInTouchBanner />

      <section className="background-light py-100">
        <div className="container">
          <h2 className="mb-40 text-center">Sell Your Car FAQ</h2>
          <div className="max-width-850 mx-auto w-full">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
