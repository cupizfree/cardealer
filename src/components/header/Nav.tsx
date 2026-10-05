import Image from "next/image";
import Link from "next/link";
import {
  listingMenuColumns,
  listingPromo,
  newsMenuLinks,
  pagesMenuColumns,
} from "@/data/menu";
import { ChevronDownIcon } from "@/components/common/icons";

// Menu utama MARF Showroom Mobil Purwokerto — satu arah: showroom mobil.
// Dropdown desktop murni CSS (`.menu-item-has-children:hover .sub-menu`), tanpa state klien;
// JS hanya dipakai untuk nav mobile (lihat MobileMenu.tsx). `current-menu-item`/`current-item`
// menandai halaman aktif lewat `activePath`.
//
// Perubahan dari template asal: kisi "Homepage 01-10" dibuang (tidak relevan untuk showroom
// sungguhan) dan diganti tautan "Beranda" biasa — kategorinya sudah ada di kolom
// "Jenis Mobil" pada menu Katalog. Label seluruhnya bahasa Indonesia.
export default function Nav({
  activePath,
  listClassName,
  topLevelChevronColor = "#9FA1A4",
  wrapperClassName = "mr-18",
}: {
  activePath?: string;
  listClassName?: string;
  /** Header di atas hero gelap memakai chevron `stroke="white"`. */
  topLevelChevronColor?: string;
  /** `index.html` asal memakai `mr-18` (default); varian lain `margin-right-auto` / `mr-50`. */
  wrapperClassName?: string;
}) {
  return (
    <nav id="main-nav" className={`main-nav ${wrapperClassName}`}>
      <ul id="menu-primary-menu" className={`menu${listClassName ? ` ${listClassName}` : ""}`}>
        <li className={`menu-item${activePath === "/" ? " current-menu-item" : ""}`}>
          <Link href="/">Beranda</Link>
        </li>

        <li
          className={`menu-item menu-item-has-children menu-item--static${
            activePath?.startsWith("/listing") ? " current-menu-item" : ""
          }`}
        >
          <a>
            Katalog <ChevronDownIcon className="chevron-down" stroke={topLevelChevronColor} />
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
                          // Hanya kolom pertama yang menandai entri aktif, meniru perilaku
                          // sumber asal (dulu "Listing Layout").
                          className={
                            column.title === "Jenis Mobil" && activePath === link.href
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
                  alt="Jual mobil"
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

        <li className={`menu-item${activePath === "/sell-your-car" ? " current-menu-item" : ""}`}>
          <Link href="/sell-your-car">Jual Mobil</Link>
        </li>

        <li className="menu-item menu-item-has-children">
          <a href="#">
            Artikel <ChevronDownIcon className="chevron-down" stroke={topLevelChevronColor} />
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
            Layanan <ChevronDownIcon className="chevron-down" stroke={topLevelChevronColor} />
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

        <li className={`menu-item${activePath === "/about-us" ? " current-menu-item" : ""}`}>
          <Link href="/about-us">Tentang</Link>
        </li>

        <li className={`menu-item${activePath === "/contact-us" ? " current-menu-item" : ""}`}>
          <Link href="/contact-us">Kontak</Link>
        </li>
      </ul>
    </nav>
  );
}
