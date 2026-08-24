import Image from "next/image";
import Link from "next/link";
import {
  footerBottomLinks,
  footerColumns,
  footerContact,
  footerOpeningHours,
  footerSocialLinks,
} from "@/data/footer";
import { socialIconPaths } from "@/data/socialIconPaths";

const currentYear = 2026; // Date.now() is unavailable at build time for this static export; matches
// the source's own hardcoded "©2026" copyright year (see ../aurexo/listing-grid4-columns.html).

// Structurally identical across pages per docs/migration/AUREXO_SOURCE.md §6 — content sourced
// from src/data/footer.ts so future pages reuse this same component/data unchanged.
export default function Footer({
  extraClassName,
}: {
  /** home-09.html's own footer carries a real `radius-40` modifier (rounded corners, same page-wide
   *  signature as its hero/other sections, confirmed via source diff). */
  extraClassName?: string;
} = {}) {
  return (
    <footer className={`bg-primary footer${extraClassName ? ` ${extraClassName}` : ""}`}>
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="footer-top-inner">
                <div>
                  <Link href="/">
                    <Image className="logo" src="/assets/images/logo-white.png" alt="logo" width={140} height={36} />
                  </Link>
                  <p className="text-xs uppercase font-weight-500 mb-8 text-muted">Opening Hours:</p>
                  <p className="text-white mb-28">
                    {footerOpeningHours.line1} <br />
                    {footerOpeningHours.line2}
                  </p>
                </div>
                <form className="form-footer relative" action="#">
                  <input type="text" placeholder="Enter your e-mail" name="footer-email" id="footer-email" required />
                  <button type="submit" className="btn-submit" aria-label="Subscribe">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19.1279 6V15.75C19.1279 16.0484 19.0094 16.3345 18.7984 16.5455C18.5874 16.7565 18.3013 16.875 18.0029 16.875C17.7045 16.875 17.4184 16.7565 17.2074 16.5455C16.9964 16.3345 16.8779 16.0484 16.8779 15.75V8.71875L6.79883 18.7959C6.58748 19.0073 6.30084 19.126 6.00195 19.126C5.70307 19.126 5.41642 19.0073 5.20508 18.7959C4.99373 18.5846 4.875 18.2979 4.875 17.9991C4.875 17.7002 4.99373 17.4135 5.20508 17.2022L15.2841 7.125H8.25289C7.95452 7.125 7.66837 7.00647 7.45739 6.7955C7.24642 6.58452 7.12789 6.29837 7.12789 6C7.12789 5.70163 7.24642 5.41548 7.45739 5.2045C7.66837 4.99353 7.95452 4.875 8.25289 4.875H18.0029C18.3013 4.875 18.5874 4.99353 18.7984 5.2045C19.0094 5.41548 19.1279 5.70163 19.1279 6Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="flex justify-between gap-8 footer-links">
                {footerColumns.map((column) => (
                  <div className="collapse" key={column.title}>
                    <p
                      className="font-weight-600 text-white mb-14 collapse-title justify-between"
                      data-breakpoint="mobile"
                    >
                      {column.title}
                      <span className="icon text-white hidden md-block">+</span>
                    </p>
                    <ul className="widget-links collapse-content md-hidden">
                      {column.links.map((link, index) => (
                        <li key={`${column.title}-${index}`}>
                          <Link href={link.href}>{link.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="footer-contact">
                <div>
                  <p className="font-weight-500 text-white mb-8">
                    <a href={footerContact.phoneHref} className="flex items-start h7">
                      {footerContact.phone}
                    </a>
                  </p>
                  <a href={footerContact.mapHref} target="_blank" className="block font-weight-500 text-white mb-20 h7">
                    {footerContact.address}
                  </a>

                  <ul className="widget-socical mb-12">
                    {footerSocialLinks.map((social) => (
                      <li key={social.name}>
                        <a href={social.href} target="_blank">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {(socialIconPaths[social.name] ?? []).map((d, index) => (
                              <path key={index} d={d} fill="white" />
                            ))}
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm text-white font-weight-600 mb-16">Download App</p>
                  <div className="flex items-center gap-12">
                    <a href="#">
                      <Image className="h-40" src="/assets/images/brand/app-store-dark.png" alt="app-store" width={135} height={40} />
                    </a>
                    <a href="#">
                      <Image className="h-40" src="/assets/images/brand/google-play-dark.png" alt="google-play" width={135} height={40} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="divider divider-blur" />
      <div className="footer-bottom">
        <div className="container">
          <div className="flex justify-between md-flex-col">
            <p className="text-sm text-muted">
              ©{currentYear}{" "}
              <a className="text-sm text-white" href="https://themeforest.net/user/themesflat" target="_blank">
                Aurexo
              </a>
              . All Rights Reserved.
            </p>
            <ul className="footer-bottom-links">
              {footerBottomLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
