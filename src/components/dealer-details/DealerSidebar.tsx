import Image from "next/image";
import Link from "next/link";
import type { Dealer } from "@/data/dealers";

// Migrated from ../aurexo/dealer-details.html lines 991-1038. Unlike sale-agents-details.html's
// sidebar, this page has NO "Send Inquiry about Vehicle" form at all (confirmed via source search) —
// just the Location box.
//
// Address/phones are this dealer's own real values from `src/data/dealers.ts` (the same fields
// `dealers-listing.html`'s list already shows) — source's own sidebar instead hardcodes the unrelated
// canonical dealer/location values also seen on sale-agents-details.html ("6205 Peachtree Dunwoody
// Rd..."), which don't match this page's own hero address ("537 Orchard St, NY") either. Personalizing
// both to the real `dealer` record resolves that inconsistency, same as `DealerProfile`'s name/photo.
// The map iframe itself stays the one generic embed the whole site shares — there's no real per-dealer
// map/pin data anywhere in source to replace it with.
//
// "Call To Dealer" literally links back to `dealer-details.html` itself in source (a real, if odd,
// source content bug — not a `tel:` action) — preserved as a self-link to this same dealer's own page.
export default function DealerSidebar({ dealer }: { dealer: Dealer }) {
  return (
    <div className="innerpage__sidebar">
      <div className="listing-details--sidebar-box">
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
                <a href="#">{dealer.address}</a>
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
                {dealer.phones.map((phone) => (
                  <a href={`tel:${phone}`} key={phone}>
                    {phone}
                  </a>
                ))}
              </div>
            </li>
          </ul>

          <Link href={`/dealer-details/${dealer.slug}`} className="btn btn-medium btn-primary-3 font-weight-600 mb-12 gap-5">
            <Image src="/assets/icons/PhoneCall-2.svg" alt="phone" width={20} height={20} />
            Call To Dealer
          </Link>

          <a href="#" className="btn btn-medium btn-primary-4 font-weight-600 gap-5">
            <Image src="/assets/icons/ChatCircleDots.svg" alt="phone" width={20} height={20} />
            Chat via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
