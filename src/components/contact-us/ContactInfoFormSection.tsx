"use client";

import Image from "next/image";
import { XIcon, InstagramIcon } from "@/components/common/SocialIcons";
import { socialIconPaths } from "@/data/socialIconPaths";

// Migrated from ../aurexo/contact-us.html lines 469-609. No breadcrumb section on this page (confirmed
// via source grep) — genuinely different from every other `(other-pages)` route migrated so far, not
// an oversight.
//
// The 6 "Follow Us On social media" icons turned out to be assembled from TWO already-existing icon
// sources rather than one: Facebook/TikTok/Amazon/Pinterest are byte-identical to `Footer.tsx`'s own
// social row (moved to shared `socialIconPaths`), while the X and Instagram icons are actually the
// stroke-outline `XIcon`/`InstagramIcon` from `common/SocialIcons.tsx` (about-us/sale-agents' Executive
// Team set) — NOT the footer's fill-logo X/Instagram. Confirmed via direct path-data comparison, not
// assumed from visual similarity. All 6 links are source's own literal dead `href="#"`, preserved as-is.
//
// Form (First/Last name, Email, Phone, Message) is UI_ONLY — confirmed no script anywhere touches
// `Firstname`/`Lastname`/`SendInquiryemail`/`SendInquiryphone`/`message` on this page — same treatment
// as every other unwired form this session. Source's own "First Name" field is prefilled with "Tony"
// (matching the same demo-name convention as `SendInquiryForm`'s "Tony Nguyen"), "Last Name" is empty.
export default function ContactInfoFormSection() {
  return (
    <section className="bg-white pb-84">
      <div className="tf-spacing" />
      <div className="container contact-page">
        <div className="grid grid-cols-2 lg-grid-cols-1 gap-30">
          <div className="contact-page-info">
            <p className="h3 mb-12 capitalize">Reach Out to Us</p>
            <p className="text-body-style-2 mb-24">
              We&rsquo;re here to assist with any questions, concerns, or inquiries—contact us today!
            </p>

            <ul className="grid grid-cols-1 gap-24 mb-24">
              <li className="contact gap-16">
                <div className="icon">
                  <Image src="/assets/icons/MapPin.svg" alt="phone" width={28} height={28} />
                </div>
                <div className="flex flex-col">
                  <p className="h5 mb-8">Address Business</p>
                  <p className="text-secondary">6205 Peachtree Dunwoody Rd, Atlanta, GA 30328</p>
                </div>
              </li>
              <li className="contact gap-16">
                <div className="icon">
                  <Image src="/assets/icons/PhoneCall.svg" alt="phone" width={24} height={24} />
                </div>
                <div className="flex flex-col">
                  <p className="h5 mb-8">Contact Us</p>
                  <a href="tel:1-555-678-8888" className="text-secondary">
                    1-555-678-8888
                  </a>
                  <a href="tel:1-333-123-6666" className="text-secondary">
                    1-333-123-6666
                  </a>
                </div>
              </li>
              <li className="contact gap-16">
                <div className="icon">
                  <Image src="/assets/icons/Alarm-white.svg" alt="phone" width={32} height={32} />
                </div>
                <div className="flex flex-col">
                  <p className="h5 mb-8">Working Time</p>
                  <p className="text-secondary">Week-Day: 8:00 - 18:00</p>
                  <p className="text-secondary">Sunday: Closed</p>
                </div>
              </li>
            </ul>

            <p className="h5 mb-20 capitalize">Follow Us On social media:</p>

            <ul className="contact-page-info-social flex gap-8">
              <li>
                <a href="#" className="hover-fill-white">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {socialIconPaths.facebook.map((d, i) => (
                      <path key={i} d={d} fill="#1C1C1C" />
                    ))}
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" className="hover-stroke-white">
                  <XIcon stroke="#1C1C1C" />
                </a>
              </li>
              <li>
                <a href="#" className="hover-stroke-white">
                  <InstagramIcon stroke="#1C1C1C" />
                </a>
              </li>
              <li>
                <a href="#" className="hover-fill-white">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {socialIconPaths.tiktok.map((d, i) => (
                      <path key={i} d={d} fill="#1C1C1C" />
                    ))}
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" className="hover-fill-white">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {socialIconPaths.amazon.map((d, i) => (
                      <path key={i} d={d} fill="#1C1C1C" />
                    ))}
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" className="hover-fill-white">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {socialIconPaths.pinterest.map((d, i) => (
                      <path key={i} d={d} fill="#1C1C1C" />
                    ))}
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-white radius-20 contact-page-form">
            <p className="h3 mb-12 capitalize">get in touch</p>
            <p className="text-body-style-2 mb-32">We&apos;d love to hear from you! If you have any questions</p>

            <form action="#" onSubmit={(event) => event.preventDefault()}>
              <div className="grid grid-cols-2 md-grid-cols-1 gap-x-20 gap-y-24 mb-22">
                <div className="md-col-span-2 padding-0">
                  <p className="mb-8">First Name</p>
                  <input className="active input-large" id="Firstname" name="Firstname" type="text" defaultValue="Tony" required />
                </div>
                <div className="md-col-span-2 padding-0">
                  <p className="mb-8">Last Name</p>
                  <input className="input-large" placeholder="Enter your last name" id="Lastname" name="Lastname" type="text" required />
                </div>
                <div className="md-col-span-2 padding-0">
                  <p className="mb-8">Email</p>
                  <input className="input-large" name="SendInquiryemail" id="SendInquiryemail" type="text" placeholder="Enter your email address" required />
                </div>
                <div className="md-col-span-2 padding-0">
                  <p className="mb-8">Phone Number</p>
                  <input placeholder="Enter your phone number" className="input-large" name="SendInquiryphone" id="SendInquiryphone" type="number" required />
                </div>
                <div className="col-span-2 padding-0">
                  <p className="mb-8">Message</p>
                  <textarea placeholder="Your Message*" rows={3} tabIndex={5} name="message" className="message" id="message" required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-large font-weight-600 w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
