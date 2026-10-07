"use client";

import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import ParallaxImage from "@/components/common/ParallaxImage";

// Migrated from ../aurexo/coming-soon.html lines 26-78. `.overlay-parallax`/`.overlay.image` is the
// same full-bleed background pattern already reproduced for sell-your-car.html's `GetInTouchBanner`
// — gets the same real `simpleParallaxVanilla.umd.js` scroll effect, see `common/ParallaxImage.tsx`.
// Source's filename
// itself is `comming-soon.jpg` (double "m", a real asset-naming typo) — kept as the literal path, not
// renamed.
//
// The subscribe form (`action="#"`, no script anywhere touches `emailcoming-soon`) is UI_ONLY, same
// treatment as every other unwired form this session — `onSubmit` just prevents the default GET
// navigation a plain `<form action="#">` would otherwise trigger.
export default function ComingSoonHero() {
  return (
    <section className="bg-white coming-soon-page">
      <div className="overlay-parallax" />
      <ParallaxImage src="/assets/images/banner/comming-soon.jpg" />

      <div className="coming-soon-page-blur" />
      <div className="max-w-1600 w-full mx-auto coming-soon-container">
        <div className="grid grid-cols-2 lg-grid-cols-1">
          <div className="coming-soon-content">
            <h1 className="text-white mb-40 md-mb-16">Segera Hadir</h1>
            <p className="h4 capitalize mb-20 text-white">Berlangganan untuk masuk daftar tunggu</p>

            <form className="coming-soon-form mb-12" action="#" onSubmit={(event) => event.preventDefault()}>
              <input type="text" placeholder="Masukkan alamat email Anda" name="emailcoming-soon" id="emailcoming-soon" />

              <button type="submit">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19.1279 6V15.75C19.1279 16.0484 19.0094 16.3345 18.7984 16.5455C18.5874 16.7565 18.3013 16.875 18.0029 16.875C17.7045 16.875 17.4184 16.7565 17.2074 16.5455C16.9964 16.3345 16.8779 16.0484 16.8779 15.75V8.71875L6.79883 18.7959C6.58748 19.0073 6.30084 19.126 6.00195 19.126C5.70307 19.126 5.41642 19.0073 5.20508 18.7959C4.99373 18.5846 4.875 18.2979 4.875 17.9991C4.875 17.7002 4.99373 17.4135 5.20508 17.2022L15.2841 7.125H8.25289C7.95452 7.125 7.66837 7.00647 7.45739 6.7955C7.24642 6.58452 7.12789 6.29837 7.12789 6C7.12789 5.70163 7.24642 5.41548 7.45739 5.2045C7.66837 4.99353 7.95452 4.875 8.25289 4.875H18.0029C18.3013 4.875 18.5874 4.99353 18.7984 5.2045C19.0094 5.41548 19.1279 5.70163 19.1279 6Z"
                    fill="#1C1C1C"
                  />
                </svg>
              </button>
            </form>

            <p className="text-white mb-40">Berlangganan untuk masuk daftar tunggu</p>

            <div className="clients md-flex-col gap-20 flex items-center">
              <div className="clients--images">
                <Image src="/assets/images/avatar/client-1.png" alt="client" width={72} height={72} />
                <Image src="/assets/images/avatar/client-2.png" alt="client" width={96} height={96} />
                <Image src="/assets/images/avatar/client-3.png" alt="client" width={96} height={96} />
                <Image src="/assets/images/avatar/client-4.png" alt="client" width={96} height={96} />
              </div>

              <p className="font-weight-500 text-white flex gap-8 h7 line-height-28">
                <span className="font-bold text-white">4k+</span> pelanggan sudah berlangganan
              </p>
            </div>
          </div>

          <div className="coming-soon-time">
            <div className="featured-countdown">
              <span className="slogan" />
              <CountdownTimer seconds={1065550} />
              <ul className="desc">
                <li>Hari</li>
                <li>Jam</li>
                <li>Min</li>
                <li>Sec</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
