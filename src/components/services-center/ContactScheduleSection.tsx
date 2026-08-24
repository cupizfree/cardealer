"use client";

import Image from "next/image";
import ParallaxImage from "@/components/common/ParallaxImage";

// Migrated from ../aurexo/services-center.html lines 685-791. Same `.overlay-parallax`/`.overlay.image`
// full-bleed background pattern as sell-your-car.html's `GetInTouchBanner` — gets the same real
// `simpleParallaxVanilla.umd.js` scroll effect, see `common/ParallaxImage.tsx`.
//
// "Schedule A Services" is a distinct form from the shared `SendInquiryForm` (extra Date/Brand/Model
// fields, different button text/label) — not a reuse candidate, source's own field ids
// (`SendInquiryname`/`SendInquiryemail`/`SendInquiryphone`) coincidentally match `SendInquiryForm`'s but
// the full field set differs, so this stays its own component. `type="submit"`-less button with no
// handler anywhere in source — UI_ONLY, same treatment as the other unwired forms this session.
export default function ContactScheduleSection() {
  return (
    <section className="relative py-100">
      <div className="overlay-parallax" />
      <ParallaxImage src="/assets/images/banner/bg-service-center.jpg" />
      <div className="container relative index-10">
        <div className="grid grid-cols-2 lg-grid-cols-1 gap-30">
          <div className="services-center-info">
            <h2 className="mb-12 text-white">Contact Infomation</h2>
            <p className="mb-28 text-white h7 line-height-28 font-weight-500">
              Get in touch with us for expert service and support. Whether you need routine maintenance,
              urgent repairs, or professional guidance, our dedicated team is here to ensure your vehicle
              stays in top condition.
            </p>

            <ul className="grid grid-cols-2 lg-grid-cols-1 gap-x-8 gap-y-16 mb-40">
              <li className="font-weight-600 flex items-start gap-12 text-white">
                <Image src="/assets/icons/check-white.svg" alt="check" width={24} height={24} />
                Expert Technicians
              </li>
              <li className="font-weight-600 flex items-start gap-12 text-white">
                <Image src="/assets/icons/check-white.svg" alt="check" width={24} height={24} />
                Quick Turnaround Time
              </li>
              <li className="font-weight-600 flex items-start gap-12 text-white">
                <Image src="/assets/icons/check-white.svg" alt="check" width={24} height={24} />
                Affordable Pricing
              </li>
              <li className="font-weight-600 flex items-start gap-12 text-white">
                <Image src="/assets/icons/check-white.svg" alt="check" width={24} height={24} />
                Comprehensive Vehicle Care
              </li>
            </ul>

            <div className="divider-vertical-style4 mb-40" />

            <ul className="grid grid-cols-2 lg-grid-cols-1 gap-12">
              <li className="contact gap-12">
                <div className="icon">
                  <Image src="/assets/icons/PhoneCall-2.svg" alt="phone" width={20} height={20} />
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted">Contact Us</p>
                  <a href="tel:1-555-678-8888" className="text-sm text-white">1-555-678-8888</a>
                  <a href="tel:1-333-123-6666" className="text-sm text-white">1-333-123-6666</a>
                </div>
              </li>

              <li className="contact gap-12">
                <div className="icon">
                  <Image src="/assets/icons/Alarm.svg" alt="phone" width={32} height={32} />
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted">Working Time</p>
                  <span className="text-sm text-white">Mon-Sat:8:00am - 18:00pm</span>
                  <span className="text-sm text-white">Sun: Closed</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-white radius-20 services-center-form">
            <p className="h4 mb-16">Schedule A Services</p>
            <form action="#" className="send-inquiry" onSubmit={(event) => event.preventDefault()}>
              <div className="grid grid-cols-2 lg-grid-cols-1 gap-x-12 gap-y-24 mb-22">
                <div>
                  <p className="mb-8">Name</p>
                  <input className="active input-large" id="SendInquiryname" name="SendInquiryname" type="text" defaultValue="Tony Nguyen" required />
                </div>
                <div>
                  <p className="mb-8">Email</p>
                  <input className="input-large" name="SendInquiryemail" id="SendInquiryemail" type="text" defaultValue="themesflat@gmail.com" required />
                </div>
                <div>
                  <p className="mb-8">Phone</p>
                  <input placeholder="Phone (optional)" className="input-large" name="SendInquiryphone" id="SendInquiryphone" type="tel" />
                </div>
                <div>
                  <p className="mb-8">Date</p>
                  <input className="input-large" id="SendInquirydate" name="SendInquirydate" type="date" defaultValue="2024-01-23" required />
                </div>

                <div>
                  <p className="mb-8">Brand</p>
                  <select className="select-style-2" name="SendInquirybrand" id="SendInquirybrand">
                    <option>Audi</option>
                    <option>Audi 2</option>
                    <option>Audi 3</option>
                  </select>
                </div>

                <div>
                  <p className="mb-8">Model</p>
                  <select className="select-style-2" name="SendInquirymodel" id="SendInquirymodel">
                    <option>Model</option>
                    <option>Model 2</option>
                    <option>Model 3</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-large font-weight-600 w-full">
                Schedule Services
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
