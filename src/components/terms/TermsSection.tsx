"use client";

import { useEffect, useRef, useState } from "react";

const sections = [
  {
    id: "section1",
    navLabel: "1. Ketentuan Umum",
    heading: "1. Ketentuan Umum",
    paragraphs: [
      "Selamat datang di situs MARF Showroom. Dengan mengakses dan menggunakan situs ini, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang tercantum di halaman ini.",
      "Situs ini dikelola oleh MARF Showroom yang berkedudukan di Purwokerto, Jawa Tengah, dan disediakan untuk memudahkan Anda melihat katalog unit, membandingkan pilihan, serta menghubungi kami. Seluruh informasi mengenai unit, harga, spesifikasi, dan ketersediaan bersifat indikatif dan tidak merupakan penawaran yang mengikat sebelum ada kesepakatan tertulis antara kedua belah pihak.",
    ],
    list: null,
  },
  {
    id: "section2",
    navLabel: "2. Pembatasan Tanggung Jawab",
    heading: "2. Pembatasan Tanggung Jawab",
    paragraphs: [
      "Kami berupaya menyajikan informasi yang akurat, namun harga dan ketersediaan unit dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu.",
    ],
    list: [
      "Foto dan video unit adalah dokumentasi pada saat pengambilan gambar. Kondisi fisik, warna, dan kelengkapan dapat berbeda karena usia maupun perawatan sebelumnya.",
      "Simulasi kredit pada situs ini bersifat estimasi. Angka cicilan, bunga, dan biaya yang mengikat hanya yang tertulis pada perjanjian pembiayaan yang disetujui lembaga pembiayaan.",
      "MARF Showroom tidak bertanggung jawab atas kerugian yang timbul akibat penggunaan informasi di situs ini tanpa didahului pemeriksaan langsung terhadap unit yang bersangkutan.",
    ],
    trailingParagraph:
      "Segala keputusan pembelian sebaiknya diambil setelah Anda memeriksa unit secara langsung atau melalui pemeriksaan pihak ketiga yang Anda tunjuk sendiri.",
  },
  {
    id: "section3",
    navLabel: "3. Perubahan dan Koreksi",
    heading: "3. Perubahan dan koreksi",
    paragraphs: [
      "Kami berusaha menampilkan setiap unit seakurat mungkin. Meski demikian, kekeliruan penulisan harga, tahun, kilometer, atau spesifikasi dapat terjadi.",
      "Apabila ditemukan kekeliruan tersebut, kami berhak melakukan koreksi pada halaman yang bersangkutan tanpa pemberitahuan terlebih dahulu. Koreksi tidak membatalkan transaksi yang telah disepakati secara sah oleh kedua belah pihak.",
    ],
    list: null,
  },
  {
    id: "section4",
    navLabel: "4. Perubahan Ketentuan Situs",
    heading: "4. Perubahan ketentuan situs",
    paragraphs: [
      "MARF Showroom dapat memperbarui syarat dan ketentuan ini dari waktu ke waktu, menyesuaikan perubahan layanan maupun ketentuan yang berlaku.",
    ],
    list: [
      "Versi terbaru berlaku sejak dipublikasikan di halaman ini dan menggantikan versi sebelumnya.",
      "Anda disarankan meninjau halaman ini secara berkala agar mengetahui ketentuan yang sedang berlaku.",
      "Dengan tetap menggunakan situs ini setelah pembaruan, Anda dianggap menyetujui ketentuan yang telah diperbarui.",
    ],
    trailingParagraph:
      "Apabila ada bagian dari ketentuan ini yang tidak lagi sesuai dengan peraturan yang berlaku, bagian tersebut akan disesuaikan tanpa memengaruhi keabsahan bagian lainnya.",
  },
  {
    id: "section5",
    navLabel: "5. Risiko",
    heading: "5. Risiko",
    paragraphs: [
      "Jual beli kendaraan bekas selalu mengandung risiko yang hanya dapat dinilai dengan memeriksa unit secara langsung. Kami menyarankan Anda melihat, menyalakan, dan menguji kendaraan sebelum mengambil keputusan.",
      "Penggunaan situs ini sepenuhnya menjadi tanggung jawab pengguna. MARF Showroom tidak menjamin situs selalu tersedia tanpa gangguan, dan tidak bertanggung jawab atas kerusakan perangkat maupun kehilangan data yang timbul dari penggunaan situs ini.",
    ],
    list: null,
  },
];

// Migrated from ../aurexo/terms.html lines 482-568. The sticky sidebar nav (`#sidebarSticky` inside
// `#scrollContainer`) is real, working functionality in source — traced `app.js`'s `scrollSidebar()`/
// `checkPosition()` in full: it's a hand-rolled scroll-listener that toggles `.menuFixed`
// (`position: fixed; top: 94px`, sticks below the header) and `.menuSticky` (`position: absolute;
// bottom: 0`, locks to the bottom of `.term-page--nav-container` once the content column has scrolled
// past) — the classic "sidebar sticks while scrolling, then stops at the bottom of its own container"
// pattern, confirmed this is the ONLY page in the whole site using this `#sidebarSticky`/
// `#scrollContainer` id pair.
//
// Initially tried a native CSS `position: sticky` replacement (no JS) since the two observable states
// looked equivalent to what `position:sticky` gives for free. Verified via Playwright that this DOESN'T
// actually work here: the site's global `#wrapper { overflow: hidden !important }` (reset.scss, present
// in source too) becomes the nearest non-visible-overflow ancestor, which makes it the containing block
// for sticky positioning — but since `#wrapper` itself never scrolls (the window/html does), the sticky
// element never re-anchors and just scrolls away with the page. Source's own approach sidesteps this
// entirely by using `position: fixed`/`position: absolute` (via `.menuFixed`/`.menuSticky`, both
// unaffected by an ancestor's `overflow: hidden`), so the scroll-listener is ported faithfully instead of
// replaced — this is a case where the "small CSS-only equivalent" call from elsewhere this session
// (FAQ accordion, Google Maps embeds) doesn't hold up under the site's actual global layout.
//
// Ported 1:1 from `checkPosition`/`scrollSidebar`: `referenceElement` = `#scrollContainer` (`.term-page`,
// stretched by flexbox to the height of the taller `.content` column), `menuSticky` = `#sidebarSticky`,
// `headerHeight` = the real rendered `.header` element's height. `totalHeight` is the scroll position at
// which the bottom of the (flex-stretched) nav container is about 100px from being reached; past that,
// the nav switches from `menuFixed` to `menuSticky` (pinned to the bottom of its own column instead of
// the viewport). No scroll-spy/active-link-highlighting exists anywhere in source for this nav (confirmed
// via search) — only the whole nav's own sticky/unstick position, not per-link state.
//
// `.section:not(:first-child) { margin-top: -60px; padding-top: 100px }` (already in the existing
// compiled CSS) is source's own anchor-scroll-offset trick accounting for the fixed header — native
// `<a href="#section1">` anchor links need no extra JS to land at the right vertical position.
export default function TermsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const [stickyState, setStickyState] = useState<"" | "menuFixed" | "menuSticky">("");

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 767px)");

    const checkPosition = () => {
      const container = containerRef.current;
      const nav = navRef.current;
      const header = document.querySelector<HTMLElement>(".header");
      if (!desktop.matches || !container || !nav || !header) return;

      const headerHeight = header.offsetHeight;
      const totalHeight = container.offsetTop + container.clientHeight - nav.clientHeight - 100;
      const rectScroll = container.getBoundingClientRect();

      if (window.scrollY > totalHeight) {
        setStickyState("menuSticky");
        return;
      }
      setStickyState(rectScroll.top <= headerHeight ? "menuFixed" : "");
    };

    checkPosition();
    window.addEventListener("scroll", checkPosition);
    window.addEventListener("resize", checkPosition);
    return () => {
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("resize", checkPosition);
    };
  }, []);

  return (
    <section className="bg-white pb-100">
      <div className="container">
        <h2 className="capitalize">Syarat &amp; Ketentuan</h2>
        <div className="tf-spacing-style3" />

        <div className="term-page" id="scrollContainer" ref={containerRef}>
          <div className="term-page--nav-container">
            <ul
              className={`term-page--nav${stickyState ? ` ${stickyState}` : ""}`}
              id="sidebarSticky"
              ref={navRef}
            >
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.navLabel}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="content">
            {sections.map((section) => (
              <div className="section" id={section.id} key={section.id}>
                <p className="h4 mb-12 capitalize">{section.heading}</p>
                {section.paragraphs.map((paragraph, i) => (
                  <p
                    className={`text-body-style-2${i < section.paragraphs.length - 1 || section.list ? " mb-12" : ""}`}
                    key={i}
                  >
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="list-style">
                    {section.list.map((item, i) => (
                      <li className="mb-12 text-body-style-2" key={i}>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.trailingParagraph && (
                  <p className="text-body-style-2">{section.trailingParagraph}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
