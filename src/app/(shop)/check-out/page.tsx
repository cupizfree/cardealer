import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import BillingDetailsForm from "@/components/checkout/BillingDetailsForm";
import PaymentAccordion from "@/components/checkout/PaymentAccordion";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";

export const metadata: Metadata = {
  title: "Check Out | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/check-out.html. Breadcrumb is only 2 crumbs (Home > Check Out) — confirmed
// via source read, same pattern as shopping-cart.html. "Place Order" has no real order-submission
// handler anywhere in source (a static template, no backend) — UI_ONLY; the form's `onSubmit`
// (in `CheckoutForm`, a small client boundary) just prevents the default GET-to-"#" navigation.
export default function CheckOutPage() {
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
              <span>Check Out</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-white shopping-cart-page">
        <div className="container">
          <CheckoutForm>
            <div className="checkout-container">
              <div className="left">
                <h2>Check Out</h2>
                <div className="tf-spacing-style3" />

                <BillingDetailsForm />

                <p className="h4 capitalize mb-20">Choose payment Option:</p>
                <PaymentAccordion />

                <button type="submit" className="btn btn-primary btn-large w-full">
                  Place Order
                </button>
              </div>

              <CheckoutOrderSummary />
            </div>
          </CheckoutForm>
        </div>
      </section>

      <Footer />
    </>
  );
}
