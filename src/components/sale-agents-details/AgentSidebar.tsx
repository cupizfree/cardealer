import Image from "next/image";
import Link from "next/link";
import SendInquiryForm from "@/components/common/SendInquiryForm";

// Migrated from ../aurexo/sale-agents-details.html lines 971-1066. The "Location" box's map
// iframe/address/phone numbers are byte-identical to the canonical dealer/location data already in
// `src/data/listings.ts` (`allListings[0].location`/`.dealer.phones`) — coincidental reuse of the same
// demo values, not a real dependency on the listings dataset, so kept as literal values here rather
// than importing `@/data/listings` into an agent-profile component.
export default function AgentSidebar() {
  return (
    <div className="innerpage__sidebar">
      <div className="listing-details--sidebar-box mb-40">
        <div className="listing-details--contact">
          <p className="h4 mb-16">Location</p>

          <div className="widget-gg-map flex radius-8 overflow-hidden mb-28">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d97101.88872869895!2d-74.22688511715344!3d40.487336736141906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1689125037376!5m2!1svi!2s"
              height={234}
              style={{ border: 0, width: "100%" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <ul className="contact-info mb-20">
            <li>
              <p className="icon">
                <Image src="/assets/icons/MapPin.svg" alt="phone" width={20} height={20} />
              </p>
              <div className="flex flex-col gap-4">
                <a href="#">6205 Peachtree Dunwoody Rd, Atlanta, GA 30328</a>
                <a href="#" className="text-underline text-highlight text-sm">
                  Get Directions
                </a>
              </div>
            </li>
          </ul>
          <ul className="contact-info mb-28">
            <li className="items-center">
              <p className="icon">
                <Image src="/assets/icons/PhoneCall.svg" alt="phone" width={20} height={20} />
              </p>
              <div className="flex flex-col">
                <a href="tel:1-555-678-8888">1-555-678-8888</a>
                <a href="tel:1-555-678-9999">1-555-678-9999</a>
              </div>
            </li>
          </ul>

          {/* Representative real dealer slug — /dealer-details is now a per-dealer [slug] route, see
              that route's own COMPONENT_MAP.md entry. */}
          <Link href="/dealer-details/dynamic-drive-garage" className="btn btn-medium btn-primary-3 font-weight-600 mb-12 gap-5">
            <Image src="/assets/icons/PhoneCall-2.svg" alt="phone" width={20} height={20} />
            Call To Dealer
          </Link>

          <a href="#" className="btn btn-medium btn-primary-4 font-weight-600 gap-5">
            <Image src="/assets/icons/ChatCircleDots.svg" alt="phone" width={20} height={20} />
            Chat via WhatsApp
          </a>
        </div>
      </div>

      <SendInquiryForm />
    </div>
  );
}
