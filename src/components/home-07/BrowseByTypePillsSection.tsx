import Link from "next/link";
import ParallaxImage from "@/components/common/ParallaxImage";

const CAR_TYPES = [
  "Listrik",
  "SUV",
  "Sedan",
  "Pikap",
  "Mewah",
  "Crossover",
  "Hybrid",
  "Solar",
  "Coupe",
  "Hatchback",
  "Wagon",
  "Konvertibel",
  "Minivan",
  "Plug-in Hybrid",
  "Van",
];

// Same repeated `.brand-item-style-3` icon for all 15 types (byte-identical path, confirmed via source
// read) — a real, disclosed simplification, unlike `home/carTypeIcons.tsx`'s per-type icon sets used
// elsewhere.
const PILL_ICON = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 25C9.65685 25 11 23.6569 11 22C11 20.3431 9.65685 19 8 19C6.34315 19 5 20.3431 5 22C5 23.6569 6.34315 25 8 25Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 25C25.6569 25 27 23.6569 27 22C27 20.3431 25.6569 19 24 19C22.3431 19 21 20.3431 21 22C21 23.6569 22.3431 25 24 25Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M11 22H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M27 22H30C30.2652 22 30.5196 21.8946 30.7071 21.7071C30.8946 21.5196 31 21.2652 31 21V16C31 15.7348 30.8946 15.4804 30.7071 15.2929C30.5196 15.1054 30.2652 15 30 15H26L20.2925 9.2925C20.1051 9.10532 19.8511 9.00012 19.5863 9H5.535C5.37053 9.0001 5.20863 9.04076 5.06364 9.11838C4.91864 9.196 4.79503 9.30819 4.70375 9.445L1 15V21C1 21.2652 1.10536 21.5196 1.29289 21.7071C1.48043 21.8946 1.73478 22 2 22H5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M26 15H1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VIEW_ALL_ICON = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 1.875C8.39303 1.875 6.82214 2.35152 5.486 3.24431C4.14985 4.1371 3.10844 5.40605 2.49348 6.8907C1.87852 8.37535 1.71762 10.009 2.03112 11.5851C2.34463 13.1612 3.11846 14.6089 4.25476 15.7452C5.39106 16.8815 6.8388 17.6554 8.4149 17.9689C9.99099 18.2824 11.6247 18.1215 13.1093 17.5065C14.594 16.8916 15.8629 15.8502 16.7557 14.514C17.6485 13.1779 18.125 11.607 18.125 10C18.1227 7.84581 17.266 5.78051 15.7427 4.25727C14.2195 2.73403 12.1542 1.87727 10 1.875ZM13.5672 10.4422L11.0672 12.9422C10.9499 13.0595 10.7909 13.1253 10.625 13.1253C10.4592 13.1253 10.3001 13.0595 10.1828 12.9422C10.0655 12.8249 9.99966 12.6659 9.99966 12.5C9.99966 12.3341 10.0655 12.1751 10.1828 12.0578L11.6164 10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H11.6164L10.1828 7.94219C10.0655 7.82491 9.99966 7.66585 9.99966 7.5C9.99966 7.33415 10.0655 7.17509 10.1828 7.05781C10.3001 6.94054 10.4592 6.87465 10.625 6.87465C10.7909 6.87465 10.9499 6.94054 11.0672 7.05781L13.5672 9.55781C13.6253 9.61586 13.6714 9.68479 13.7029 9.76066C13.7343 9.83654 13.7505 9.91787 13.7505 10C13.7505 10.0821 13.7343 10.1635 13.7029 10.2393C13.6714 10.3152 13.6253 10.3841 13.5672 10.4422Z"
      fill="white"
    />
  </svg>
);

// Migrated from ../aurexo/home-07.html lines 3686-3892 ("Cari Berdasarkan Tipe"). Genuinely different DOM from
// `home/BrowseByTypeSection.tsx` (the `.swiper-brand` carousel over `banner-brand.png`): this is a
// static `flex flex-wrap` list of `.brand-item-style-3` pills (no swiper at all) over a real
// `simpleParallax` background (`bg-fixed.jpg`, same mechanism as `common/ParallaxImage.tsx` — this
// component is explicitly listed in that file's own header comment as a home-07.html reuse target),
// with a separate static `.overlay-parallax` dark-tint layer (`rgba(0,0,0,0.4)`,
// `app.scss:326-337`) rendered as its own sibling div, not part of the parallax image itself. All 15
// pills share the exact same repeated icon (confirmed via source read) and all link to
// `/listing-grid4-columns`.
export default function BrowseByTypePillsSection() {
  return (
    <section className="py-100 relative">
      <div className="overlay-parallax" />
      <ParallaxImage src="/assets/images/background/bg-fixed.jpg" />

      <div className="container flex items-center justify-center flex-col relative text-center index-2 wow fadeIn" data-wow-delay="0.1s">
        <h2 className="text-white mb-40 capitalize">Cari Berdasarkan Tipe</h2>
        <div className="flex flex-wrap justify-center gap-8 mb-28">
          {CAR_TYPES.map((type) => (
            <Link key={type} href="/listing-grid4-columns" className="brand-item-style-3">
              {PILL_ICON}
              {type}
            </Link>
          ))}
        </div>
        <Link href="/listing-grid4-columns" className="btn btn-line-primary h-50 btn-large font-weight-600">
          Lihat Semua
          {VIEW_ALL_ICON}
        </Link>
      </div>
    </section>
  );
}
