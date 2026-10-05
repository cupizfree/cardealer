"use client";

import { useEffect } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { useModal } from "./ModalProvider";

// #NewsletterModal. Mirrors app.js's `newsletterModal()` verbatim: after the preloader clears, wait
// 100ms then show once per browser (localStorage 'suggest_subscribe' flag), never again after that.
// Source calls this unconditionally on EVERY page's document-ready, but only 11 of 63 pages actually
// include `#NewsletterModal` in their markup, so in practice it only ever pops up on those pages —
// this is why the component (and its auto-open effect) is mounted per-page (starting with about-us,
// the first of those 11 to be migrated) rather than in the root layout: mounting it globally would
// make it pop up on every route, which source itself never does.
//
// Source's own preload-check is a `setInterval` polling for `.preload` to disappear from the DOM;
// `Preloader` (this project's mount) removes itself already, so the same polling approach is kept
// here rather than inventing a new signal.
//
// RETROACTIVE FIX (found while checking `LoginModal.tsx`'s own "modal-sm" bug on request): this modal's
// own real `.modal-content` carries `modal-lg` (confirmed via source diff, `about-us.html`'s own
// `#NewsletterModal` markup), which was never applied at all — `modal.scss`'s `.modal-content.modal-lg
// { max-width: 920px }` never matched, so this modal was silently stuck at the full 1450px width. Fixed
// via `Modal.tsx`'s new `contentClassName` prop.
export default function NewsletterModal() {
  const { openModal } = useModal();

  useEffect(() => {
    if (localStorage.getItem("suggest_subscribe")) return;

    const checkPreloadInterval = setInterval(() => {
      if (document.querySelectorAll(".preload").length === 0) {
        clearInterval(checkPreloadInterval);
        setTimeout(() => {
          openModal("NewsletterModal");
          localStorage.setItem("suggest_subscribe", "false");
        }, 100);
      }
    }, 3000);

    return () => clearInterval(checkPreloadInterval);
  }, [openModal]);

  return (
    <Modal id="NewsletterModal" className="modal-newsletter" contentClassName="modal-lg">
      <div className="grid grid-cols-2 md-grid-cols-1">
        <div className="flex">
          <Image className="w-full" src="/assets/images/pages/newletter.jpg" alt="" width={880} height={880} />
        </div>

        <div className="newsletter--content flex justify-center items-center flex-col">
          <p className="text-highlight mb-8">Berlangganan Buletin Kami!</p>
          <p className="h5 mb-28">
            Daftar untuk Berita &amp; <br className="lg-hidden" /> Acara Terbaru.
          </p>

          <form action="#" className="newsletter-form mb-16" onSubmit={(e) => e.preventDefault()}>
            <input
              className="input-large"
              type="email"
              id="email-newsletter"
              name="email-newsletter"
              placeholder="Masukkan e-mail Anda"
              required
            />
            <button type="submit">Berlangganan</button>
          </form>

          <ul className="newsletter-social flex gap-4">
            <li>
              <a href="#" className="hover-stroke-hover">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.25 11.25L8.75 8.75L11.25 11.25L13.75 8.75" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.24382 16.4912C7.81923 17.403 9.67248 17.7108 11.458 17.3571C13.2436 17.0034 14.8396 16.0124 15.9484 14.5689C17.0573 13.1253 17.6033 11.3278 17.4847 9.51146C17.3662 7.69508 16.5911 5.98381 15.304 4.69671C14.0169 3.4096 12.3056 2.63451 10.4892 2.51594C8.67284 2.39737 6.87533 2.94341 5.43182 4.05227C3.98831 5.16113 2.99733 6.75711 2.64363 8.54266C2.28993 10.3282 2.59766 12.1814 3.50944 13.7569L2.5321 16.6748C2.49538 16.785 2.49005 16.9031 2.51671 17.0161C2.54337 17.1291 2.60097 17.2324 2.68306 17.3145C2.76514 17.3966 2.86847 17.4542 2.98145 17.4808C3.09443 17.5075 3.2126 17.5022 3.32273 17.4655L6.24382 16.4912Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </li>
            <li>
              <a href="#" className="hover-stroke-hover">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.75 3.125H7.5L16.25 16.875H12.5L3.75 3.125Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8.89687 11.2129L3.75 16.8746" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16.2484 3.125L11.1016 8.78672" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </li>
            <li>
              <a href="#" className="hover-stroke-hover">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 13.125C11.7259 13.125 13.125 11.7259 13.125 10C13.125 8.27411 11.7259 6.875 10 6.875C8.27411 6.875 6.875 8.27411 6.875 10C6.875 11.7259 8.27411 13.125 10 13.125Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.75 2.5H6.25C4.17893 2.5 2.5 4.17893 2.5 6.25V13.75C2.5 15.8211 4.17893 17.5 6.25 17.5H13.75C15.8211 17.5 17.5 15.8211 17.5 13.75V6.25C17.5 4.17893 15.8211 2.5 13.75 2.5Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14.0625 6.71875C14.494 6.71875 14.8438 6.36897 14.8438 5.9375C14.8438 5.50603 14.494 5.15625 14.0625 5.15625C13.631 5.15625 13.2812 5.50603 13.2812 5.9375C13.2812 6.36897 13.631 6.71875 14.0625 6.71875Z" fill="#1C1C1C" />
                </svg>
              </a>
            </li>
            <li>
              <a href="#" className="hover-stroke-hover">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 11.875C7.5 12.9102 8.61953 13.75 10 13.75C11.3805 13.75 12.5 12.9102 12.5 11.875C12.5 9.375 7.63906 10.3125 7.63906 8.125C7.63906 7.08984 8.61953 6.25 10 6.25C11.0352 6.25 11.8461 6.71875 12.1875 7.39531" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16.7224 11.4599C17.2774 12.1817 17.5508 13.0806 17.4917 13.9891C17.4325 14.8976 17.045 15.7536 16.4012 16.3973C15.7575 17.0411 14.9015 17.4286 13.993 17.4877C13.0845 17.5469 12.1856 17.2734 11.4638 16.7185C10.3391 16.9617 9.17125 16.9188 8.06731 16.5939C6.96337 16.269 5.95856 15.6723 5.14484 14.8586C4.33113 14.0449 3.7345 13.0401 3.40957 11.9362C3.08465 10.8322 3.04179 9.66441 3.28494 8.53963C2.73003 7.81789 2.45662 6.91893 2.51573 6.01045C2.57483 5.10197 2.96242 4.24601 3.60617 3.60226C4.24992 2.95851 5.10587 2.57093 6.01436 2.51182C6.92284 2.45272 7.8218 2.72612 8.54353 3.28103C9.66832 3.03789 10.8361 3.08074 11.9401 3.40567C13.044 3.7306 14.0488 4.32722 14.8625 5.14094C15.6763 5.95465 16.2729 6.95947 16.5978 8.06341C16.9227 9.16735 16.9656 10.3352 16.7224 11.4599Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </li>
            <li>
              <a href="#" className="hover-fill-hover">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.24939 10.5366L13.301 16.7186C13.3822 16.7903 13.4806 16.8396 13.5867 16.8618C13.6927 16.8839 13.8027 16.8781 13.9058 16.845C14.0089 16.8118 14.1016 16.7524 14.1749 16.6726C14.2481 16.5928 14.2994 16.4953 14.3236 16.3897L17.4994 2.59521C17.5025 2.58138 17.5018 2.56696 17.4973 2.55351C17.4928 2.54006 17.4848 2.52807 17.474 2.51884C17.4633 2.50961 17.4502 2.50348 17.4362 2.5011C17.4223 2.49873 17.4079 2.5002 17.3947 2.50537L1.56189 8.70146C1.4636 8.73929 1.38023 8.80798 1.3243 8.89722C1.26837 8.98646 1.2429 9.09143 1.2517 9.19638C1.26051 9.30133 1.30312 9.4006 1.37313 9.47927C1.44315 9.55794 1.5368 9.61178 1.64001 9.63271L6.24939 10.5366Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.25 10.5375L17.4539 2.50781" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.71641 13.5789L7.325 16.0602C7.23859 16.1498 7.12737 16.2116 7.00561 16.2376C6.88384 16.2636 6.75708 16.2527 6.64157 16.2062C6.52607 16.1597 6.42709 16.0797 6.35732 15.9766C6.28755 15.8735 6.25018 15.7519 6.25 15.6273V10.5391" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
