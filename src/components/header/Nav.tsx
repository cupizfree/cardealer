"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
  informasiMenuColumns,
  kolomHarga,
  layananMenuColumns,
  listingPromo,
  type ListingMenuColumn,
} from "@/data/menu";
import { ChevronDownIcon } from "@/components/common/icons";
import { useKatalog } from "@/components/common/KatalogProvider";
import { fasetJenis, fasetMerek } from "@/lib/faset";

/**
 * Tautan katalog penuh. Semua tautan di kolom Katalog memakai kueri penyaring,
 * jadi tanpa ini tidak ada jalan dari navigasi ke seluruh stok — dan mengklik
 * "Katalog" sendiri harus membawa ke katalog, bukan diam.
 */
const KATALOG_SEMUA = "/listing-grid3-columns";

// Menu utama MARF Showroom Mobil Purwokerto.
// Dropdown desktop murni CSS (`.menu-item-has-children:hover .sub-menu`), tanpa state klien;
// JS hanya dipakai untuk nav mobile (lihat MobileMenu.tsx). `current-menu-item` menandai halaman
// aktif lewat `activePath`.
//
// Isi menu ini sengaja dibatasi pada apa yang dicari pembeli showroom: unit apa yang ada,
// dan layanan apa yang tersedia. Yang dibuang dari templat asal:
//
//   - Kisi "Homepage 01-10" (sisa demo).
//   - Kolom "Tampilan Daftar" (Grid 4 Kolom / Daftar + Sidebar / Dengan Peta / Peta Penuh) —
//     pengunjung tidak datang untuk memilih tata letak halaman.
//   - Lima dari enam tautan blog (semuanya satu blog yang sama dengan gaya berbeda).
//   - Menu "Halaman" templat: Halaman 404, Segera Hadir, Dasbor, dan halaman internal toko.
//   - "Jual Mobil" yang muncul tiga kali (menu atas, menu Halaman, kartu promo) — kini satu,
//     di dalam Layanan.
//
// Kolom "Jenis Mobil" dan "Merek" tidak ditulis di `src/data/menu.ts`: keduanya dihitung dari
// stok yang sedang tayang (`src/lib/faset.ts`), jadi tidak akan pernah ada kategori yang
// mengarah ke halaman kosong.
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
  const katalog = useKatalog();

  const kolom = useMemo<ListingMenuColumn[]>(() => {
    const daftar: ListingMenuColumn[] = [];

    const jenis = fasetJenis(katalog);
    if (jenis.length) {
      daftar.push({
        title: "Jenis Mobil",
        links: jenis.map((f) => ({ label: `${f.label} (${f.jumlah})`, href: f.href })),
      });
    }

    daftar.push(kolomHarga);

    const merek = fasetMerek(katalog);
    if (merek.length) {
      daftar.push({
        title: "Merek",
        links: merek.map((f) => ({ label: `${f.label} (${f.jumlah})`, href: f.href })),
      });
    }

    return daftar;
  }, [katalog]);

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
          <Link href={KATALOG_SEMUA}>
            Katalog <ChevronDownIcon className="chevron-down" stroke={topLevelChevronColor} />
          </Link>
          <div className="sub-menu sub-menu--full sub-menu--listing">
            <div className="sub-menu--listing-nav">
              {kolom.map((kolomItem) => (
                <div className="sub-menu-item-listing" key={kolomItem.title}>
                  <p className="h5 mb-16 menu-item-inner-title">
                    {kolomItem.title}
                    <ChevronDownIcon className="chevron-down hidden lg-show" />
                  </p>
                  <ul className="flex flex-col gap-16 sub-menu-item-inner">
                    {kolomItem.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>{link.label}</Link>
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
                    <Link href={listingPromo.ctaHref} className="card--title h3 text-white font-weight-600 mb-8">
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
            Layanan <ChevronDownIcon className="chevron-down" stroke={topLevelChevronColor} />
          </a>
          <ul className="sub-menu sub-menu--container">
            {layananMenuColumns.map((column, index) => (
              <li key={`layanan-${index}`}>
                {column.links.map((link) => (
                  <Link className="menu-item" href={link.href} key={link.href}>
                    {link.label}
                  </Link>
                ))}
              </li>
            ))}
          </ul>
        </li>

        <li className={`menu-item${activePath === "/sale-agents" ? " current-menu-item" : ""}`}>
          <Link href="/sale-agents">Tim Sales</Link>
        </li>

        <li className="menu-item menu-item-has-children">
          <a href="#">
            Informasi <ChevronDownIcon className="chevron-down" stroke={topLevelChevronColor} />
          </a>
          <ul className="sub-menu sub-menu--container">
            {informasiMenuColumns.map((column, index) => (
              <li key={`informasi-${index}`}>
                {column.links.map((link) => (
                  <Link className="menu-item" href={link.href} key={link.href}>
                    {link.label}
                  </Link>
                ))}
              </li>
            ))}
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
