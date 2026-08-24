"use client";

import Image from "next/image";
import Link from "next/link";
import { useModal } from "@/components/common/ModalProvider";

// Migrated from ../aurexo/financing.html lines 484-532. "Sign in" is a real `open-modal` trigger for
// `LoginModal` (reused via `useModal`, same pattern as every other `open-modal` trigger this session).
// "Get Prequalified" links to `/contact-us` (not yet migrated) — matches source's own
// `href="contact-us.html"`.
export default function FinancingHero() {
  const { openModal } = useModal();

  return (
    <section className="bg-white pb-100">
      <div className="container">
        <h2>Financing</h2>
        <div className="tf-spacing-style3" />

        <div className="grid grid-cols-2 xl-grid-cols-2 lg-grid-cols-1 gap-30">
          <div className="wow fadeInUp">
            <h2 className="mb-12 capitalize">Get Prequalified for Auto Financing</h2>
            <p className="mb-42 h7 line-height-28 text-secondary">
              Explore personalized rates and flexible financing options in minutes—without impacting
              your credit score.
            </p>
            <ul className="grid grid-cols-1 gap-26 mb-40">
              <li className="flex items-start gap-12">
                <Image className="w-24 h-24" src="/assets/icons/check.svg" alt="check" width={24} height={24} />
                <div>
                  <p className="h5 mb-4 capitalize">Secure transactions and title transfer</p>
                  <p className="h7">See your personalized rate from our network of lenders.</p>
                </div>
              </li>
              <li className="flex items-start gap-12">
                <Image className="w-24 h-24" src="/assets/icons/check.svg" alt="check" width={24} height={24} />
                <div>
                  <p className="h5 mb-4 capitalize">No impact to your credit</p>
                  <p className="h7">Prequalification with our lenders will not affect your credit score.</p>
                </div>
              </li>
              <li className="flex items-start gap-12">
                <Image className="w-24 h-24" src="/assets/icons/check.svg" alt="check" width={24} height={24} />
                <div>
                  <p className="h5 mb-4 capitalize">It only takes a few minutes</p>
                  <p className="h7">Answer a few basic questions and instantly see your personalized results.</p>
                </div>
              </li>
            </ul>

            <div className="flex gap-20 items-center">
              <Link href="/contact-us" className="btn btn-primary btn-large-3 font-weight-600">
                Get Prequalified
              </Link>
              <p className="flex gap-8">
                <span>Already prequalified?</span>
                <span className="font-weight-600 text-underline cursor-pointer" onClick={() => openModal("LoginModal")}>
                  Sign in
                </span>
              </p>
            </div>
          </div>
          <div className="ml-24 flex md-ml-0 wow fadeInUp image-effect-scale overflow-hidden radius-20">
            <Image className="w-full" src="/assets/images/home/banner-download-app.jpg" alt="banner-download-app" width={1330} height={996} />
          </div>
        </div>
      </div>
    </section>
  );
}
