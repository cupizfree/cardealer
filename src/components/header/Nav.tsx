import Image from "next/image";
import Link from "next/link";
import {
  homeMenuItems,
  listingMenuColumns,
  listingPromo,
  newsMenuLinks,
  pagesMenuColumns,
} from "@/data/menu";
import { ChevronDownIcon } from "@/components/common/icons";

// Desktop mega-menu. Dropdown reveal is pure CSS (`.menu-item-has-children:hover .sub-menu`, ported
// verbatim from Aurexo's SCSS) — no client state needed here, matching the source, which only uses
// JS for the *mobile* nav (see MobileMenu.tsx). `current-menu-item`/`current-item` highlight the
// active page — `activePath` lets each page mark its own entry, same intent as the source's static
// `current-menu-item` class per file.
export default function Nav({
  activePath,
  listClassName,
  topLevelChevronColor = "#9FA1A4",
  wrapperClassName = "mr-18",
}: {
  activePath?: string;
  listClassName?: string;
  /** home-05.html's own header sits on a dark/blurred hero (`HeaderStyle4`'s `header-blur`), and its
   *  Home/Listing/News/Pages top-level chevrons are all real `stroke="white"` (confirmed via source
   *  diff against index.html's own `#9FA1A4`, retroactive fix — kept as the default since every other
   *  header variant genuinely uses it). Only the 4 top-level chevrons vary; the inner submenu-column
   *  chevrons (`hidden lg-show` and the Pages-column one) sit inside a white dropdown panel regardless
   *  of header skin, so they stay the fixed default color always. */
  topLevelChevronColor?: string;
  /** index.html's own `<nav id="main-nav">` is real `mr-18` (kept as the default) — home-05.html's own
   *  is `margin-right-auto`, home-06.html's own is `mr-50` (confirmed via source diff on both). */
  wrapperClassName?: string;
}) {
  const isHomeActive = activePath === "/" || activePath?.startsWith("/home-");
  return (
    <nav id="main-nav" className={`main-nav ${wrapperClassName}`}>
      <ul id="menu-primary-menu" className={`menu${listClassName ? ` ${listClassName}` : ""}`}>
        <li
          className={`menu-item menu-item-has-children menu-item--static menu-item-main${
            isHomeActive ? " current-menu-item" : ""
          }`}
        >
          <a href="#">
            {" "}
            Home <ChevronDownIcon className="chevron-down" stroke={topLevelChevronColor} />
          </a>
          <div className="sub-menu sub-menu--full sub-menu--main">
            <ul>
              {homeMenuItems.map((item) => (
                <li key={item.href}>
                  <Link className={`menu-item${item.href === activePath ? " current-item" : ""}`} href={item.href}>
                    <Image
                      className="menu-item-image"
                      src={item.image}
                      alt="ArrowDown"
                      // Source has no width/height on this <img> at all — it's a plain block image
                      // that fills 100% of its card via the global `img { max-width: 100%; height:
                      // auto }` rule (assets/scss/reset.scss). The real files are 960x1128; passing
                      // that true intrinsic size (next/image requires explicit dimensions) lets the
                      // same CSS rule scale it down to fill the card at any viewport, matching the
                      // source exactly instead of the previous wrong 112x72 guess (which left a
                      // visible gap since it never grew to fill wider cards).
                      width={960}
                      height={1128}
                      sizes="(min-width: 1400px) 280px, 220px"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>

        <li className={`menu-item${activePath === "/about-us" ? " current-menu-item" : ""}`}>
          <Link href="/about-us">About</Link>
        </li>

        <li
          className={`menu-item menu-item-has-children menu-item--static${
            activePath?.startsWith("/listing") ? " current-menu-item" : ""
          }`}
        >
          <a>
            Listing <ChevronDownIcon className="chevron-down" stroke={topLevelChevronColor} />
          </a>
          <div className="sub-menu sub-menu--full sub-menu--listing">
            <div className="sub-menu--listing-nav">
              {listingMenuColumns.map((column) => (
                <div className="sub-menu-item-listing" key={column.title}>
                  <p className="h5 mb-16 menu-item-inner-title">
                    {column.title}
                    <ChevronDownIcon className="chevron-down hidden lg-show" />
                  </p>
                  <ul className="flex flex-col gap-16 sub-menu-item-inner">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          // Source only ever hardcodes `current-item` on the one entry in the
                          // "Listing Layout" column, even when another column (e.g. "Listing Style")
                          // has a link pointing at the very same URL — matching href generically
                          // across every column marked both as current, which the source never does.
                          className={
                            column.title === "Listing Layout" && activePath === link.href
                              ? "current-item"
                              : undefined
                          }
                          href={link.href}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="sub-menu--listing-image">
              <div className="car-box-style-3">
                <Image
                  className="card--img"
                  src={listingPromo.image}
                  alt="car"
                  width={340}
                  height={220}
                />
                <div className="content">
                  <p className="h3">
                    <Link href="#" className="card--title h3 text-white font-weight-600 mb-8">
                      {listingPromo.title}
                    </Link>
                  </p>
                  <ul className="list">
                    {listingPromo.items.map((item) => (
                      <li className="text-sm" key={item}>
                        <Image src="/assets/icons/check.svg" alt="check" width={16} height={16} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={listingPromo.ctaHref}
                    className="btn btn-white btn-medium text-sm font-weight-600 max-w-min text-primary"
                  >
                    {listingPromo.ctaLabel}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </li>

        <li className="menu-item menu-item-has-children">
          <a href="#">
            News <ChevronDownIcon className="chevron-down" stroke={topLevelChevronColor} />
          </a>
          <ul className="sub-menu sub-menu--container">
            <li>
              {newsMenuLinks.map((link) => (
                <Link className="menu-item" href={link.href} key={link.href}>
                  {link.label}
                </Link>
              ))}
            </li>
          </ul>
        </li>

        <li className="menu-item menu-item-has-children">
          <a href="#">
            Pages <ChevronDownIcon className="chevron-down" stroke={topLevelChevronColor} />
          </a>
          <ul className="sub-menu sub-menu--container">
            {pagesMenuColumns.map((column, index) =>
              column.title ? (
                <li className="menu-item menu-item-inner cursor-pointer py-10" key={column.title}>
                  <p className="menu-item-inner-title flex items-center gap-8 justify-between">
                    {column.title}
                    <ChevronDownIcon />
                  </p>
                  <ul className="sub-menu-item-inner">
                    <li>
                      {column.links.map((link) => (
                        <Link className="menu-item" href={link.href} key={link.href}>
                          {link.label}
                        </Link>
                      ))}
                    </li>
                  </ul>
                </li>
              ) : (
                <li key={`pages-group-${index}`}>
                  {column.links.map((link) => (
                    <Link className="menu-item" href={link.href} key={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </li>
              )
            )}
          </ul>
        </li>

        <li className={`menu-item${activePath === "/contact-us" ? " current-menu-item" : ""}`}>
          <Link href="/contact-us">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}
