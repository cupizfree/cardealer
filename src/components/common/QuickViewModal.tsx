"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { useModal } from "./ModalProvider";
import { useCart } from "./CartProvider";
import { allProducts, parsePrice, type ProductCardData } from "@/data/products";

// The right-side "Quick View" drawer (`#QuickViewModal`), triggered from shop.html's product-card eye
// icons. Traced `shop.js`'s click handler in full and confirmed a genuinely odd but real behavior:
// the modal's own displayed title/price/specs/gallery are 100% STATIC — always "Fog Light Lamp
// White/Yellow Dual Colors" (byte-identical to `allProducts[0]`, the same demo product shown on its
// own detail page), regardless of which product card's eye icon was actually clicked. Only two things
// genuinely change per-click: the "Add to Cart" button's own total-price text (real quantity × the
// REAL clicked product's real price, via `updateTotalPriceInModal()`) and which product actually gets
// added to the cart. Reproduced faithfully rather than "fixed" into a real per-product quick view: the
// static content comes straight from `allProducts[0]`, while `modalPayload` (see `ModalProvider.tsx`)
// carries whichever real product card was clicked, used only for the Add-to-Cart action.
//
// Source's own gallery thumbnails here are product-1..5.jpg — a THIRD distinct image set from this
// same demo product, different again from product-details.html's own product-10..13.jpg gallery for
// the identical "Fog Light Lamp..." content. Preserved as its own real, if inconsistent, set.
//
// RETROACTIVE FIX (found while checking `LoginModal.tsx`'s own "modal-sm" bug on request): this modal's
// own real outer class is `modal modal-right quick-view` (confirmed via source diff, `shop.html`'s own
// `#QuickViewModal` markup) — `modal-right` was missing entirely, and `modal-lg` was misplaced on the
// outer `.modal` div instead of `.modal-content` (source: `<div class="modal-content modal-lg">`).
// `modal-right` isn't cosmetic: `modal.scss`'s `.modal-right .modal-content` rule makes this a full-
// height, 480px right-edge sliding drawer (`justify-content: flex-end`, `transform: translateX(100%)`
// → `translateX(0)` on open) — a completely different interaction from the default centered/scaled
// popup this was rendering as. Fixed by moving `modal-right` to `Modal`'s own `className` and `modal-lg`
// to its new `contentClassName` prop.
const demo = allProducts[0];
const galleryImages = ["product-1", "product-2", "product-3", "product-4", "product-5"];

export default function QuickViewModal() {
  const [quantity, setQuantity] = useState(1);
  const { modalPayload, openModal } = useModal();
  const { addToCart } = useCart();

  const clicked = modalPayload as ProductCardData | null;
  const clickedPrice = clicked ? parsePrice(clicked.price) : 0;
  const hasClickedProduct = Boolean(clicked);

  const handleAddToCart = () => {
    if (clicked) {
      addToCart({ name: clicked.title, image: clicked.image, price: clickedPrice }, quantity);
    }
    openModal("ShoppingCartModal");
  };

  return (
    <Modal id="QuickViewModal" className="modal-right quick-view" contentClassName="modal-lg">
      <div className="product-shop">
        <div className="product-images">
          {galleryImages.map((name) => (
            <div className="relative" key={name}>
              <Image className="thumbnail radius-16" src={`/assets/images/shop/${name}.jpg`} alt="thumbnail" width={200} height={150} />
            </div>
          ))}
        </div>

        <div className="product-info">
          <div className="modal-inner--title">
            <p className="h4 mb-20">Quick View</p>
          </div>
          <div className="inner-content">
            <p className="mb-16 flex items-center gap-4">
              <svg className="svg-themes" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20.0491 11.7617L9.54911 23.0117C9.43784 23.1305 9.29097 23.2098 9.13065 23.2377C8.97034 23.2657 8.80528 23.2407 8.66039 23.1667C8.5155 23.0926 8.39863 22.9734 8.32743 22.827C8.25623 22.6807 8.23455 22.5152 8.26568 22.3555L9.64005 15.4808L4.23724 13.452C4.12121 13.4086 4.01773 13.3371 3.93606 13.244C3.85439 13.1508 3.79706 13.0389 3.76921 12.9182C3.74135 12.7975 3.74383 12.6718 3.77642 12.5522C3.80902 12.4327 3.87071 12.3231 3.95599 12.2333L14.456 0.983274C14.5673 0.864526 14.7141 0.785191 14.8744 0.75724C15.0348 0.729289 15.1998 0.75424 15.3447 0.828326C15.4896 0.902412 15.6065 1.02161 15.6777 1.16794C15.7489 1.31428 15.7705 1.47979 15.7394 1.63952L14.3613 8.52171L19.7641 10.5476C19.8793 10.5913 19.9819 10.6627 20.063 10.7555C20.144 10.8483 20.2009 10.9596 20.2287 11.0796C20.2565 11.1996 20.2544 11.3246 20.2224 11.4436C20.1904 11.5626 20.1296 11.6718 20.0454 11.7617H20.0491Z"
                  fill="#1C1C1C"
                />
              </svg>
              {demo.soldCount}
            </p>
            <p className="h3 font-weight-500 mb-20">{demo.title}</p>

            <div className="flex items-center gap-8 mb-20">
              <p className="h3">{demo.price}</p>
              {demo.oldPrice && <span className="price-old text-muted h5">{demo.oldPrice}</span>}
              {demo.discountLabel && <span className="sale-box text-white ml-8">{demo.discountLabel}</span>}
            </div>

            <p className="text-secondary mb-20">{demo.shortDescription}</p>

            <ul className="flex flex-col product-details-list gap-4 mb-20">
              {demo.specs?.map((spec) => (
                <li className="flex items-center gap-8" key={spec.label}>
                  <p className="flex items-center gap-2">
                    <span>&#x2022; </span>
                    <span className="font-weight-600 flex w-80">{spec.label}</span>
                  </p>
                  {spec.value}
                </li>
              ))}
            </ul>

            <div className="divider mb-20" />

            <div className="mb-20">
              <p className="h7 font-weight-500 line-height-28 mb-8">Quantity:</p>
              <div className="quantity-selector style-2">
                <button
                  type="button"
                  className="quantity-selector__btn quantity-selector__btn--minus"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <input
                  className="quantity-selector__value"
                  value={quantity}
                  type="number"
                  min={1}
                  onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                />
                <button
                  type="button"
                  className="quantity-selector__btn quantity-selector__btn--plus"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 12H19" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-12">
              <div className="add-to-cart-btn">
                <button
                  type="button"
                  className="btn btn-primary btn-large font-weight-600 capitalize w-full"
                  onClick={handleAddToCart}
                >
                  Add to cart{hasClickedProduct ? ` - $${(quantity * clickedPrice).toFixed(2)}` : ""}
                </button>
                <a className="bth-heart" href="#" onClick={(event) => event.preventDefault()}>
                  <svg className="svg-themes" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 21C12 21 2.25 15.75 2.25 9.5625C2.25 8.21984 2.78337 6.93217 3.73277 5.98277C4.68217 5.03337 5.96984 4.5 7.3125 4.5C9.43031 4.5 11.2444 5.65406 12 7.5C12.7556 5.65406 14.5697 4.5 16.6875 4.5C18.0302 4.5 19.3178 5.03337 20.2672 5.98277C21.2166 6.93217 21.75 8.21984 21.75 9.5625C21.75 15.75 12 21 12 21Z"
                      stroke="#1C1C1C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
              <a href="/check-out" className="btn btn-primary-3 btn-large font-weight-600">
                Buy It Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
