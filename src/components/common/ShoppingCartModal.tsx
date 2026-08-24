"use client";

import Image from "next/image";
import Link from "next/link";
import Modal from "./Modal";
import { useModal } from "./ModalProvider";
import { useCart } from "./CartProvider";

// The right-side shopping cart drawer (`#ShoppingCartModal`). Traced `shop.js` in full and confirmed
// this is genuinely real, localStorage-backed behavior in source (see `CartProvider.tsx`'s own header
// comment) — now wired to the real `CartProvider` context instead of source's `localStorage`.
//
// The shipping progress bar ("Congratulations! You've got free shipping!" at a fixed 75%) is confirmed
// static/decorative in source — no script anywhere recomputes `--percent` from the real subtotal — so
// it stays a fixed visual here too, not tied to `subtotal`.
export default function ShoppingCartModal() {
  const { items, subtotal, removeFromCart } = useCart();
  const { closeModal } = useModal();

  const handleRemove = (id: string) => {
    removeFromCart(id);
    // Mirrors shop.js's own remove handler: removing the last item auto-closes the modal.
    if (items.length === 1) closeModal();
  };

  return (
    <Modal id="ShoppingCartModal" className="modal-right shopping-cart">
      <p className="h4 mb-16">Shopping Cart</p>

      <div className="ship mb-18">
        <div className="progress-bar style-2">
          <div className="percent" style={{ "--percent": "75%" } as React.CSSProperties} />
          <div className="progress-bar__bg" />
        </div>
        <p className="text-sm">Congratulations! You&apos;ve got free shipping!</p>
      </div>

      <div className="your-order scroll-custom mb-20">
        {items.map((item) => (
          <div className="order-item style-2" key={item.id}>
            <div className="flex items-center gap-24">
              <Image className="order-item-img" src={item.image} alt={item.name} width={64} height={64} />
              <div>
                <p className="font-weight-600 mb-12 clamp-1 clamp">{item.name}</p>
                <p className="font-weight-600">
                  {item.quantity} X ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
            <a
              href="#"
              className="remove-item font-weight-600 text-underline cursor-pointer"
              onClick={(event) => {
                event.preventDefault();
                handleRemove(item.id);
              }}
            >
              Remove
            </a>
          </div>
        ))}
      </div>
      <div className="divider mb-20" />

      <div className="bottom-modal">
        <div className="flex items-center justify-between gap-10 mb-20 w-full">
          <p className="h4">Subtotal</p>
          <p className="h4">${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex items-center w-full mb-24">
          <label className="filter-checkbox style-5 mb-18">
            <input type="checkbox" name="features" value="touch-screen" defaultChecked />
            <span />
          </label>
          <a href="/terms">
            I agree with <span className="text-underline">Terms &amp; Conditions</span>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-16 mb-16">
          <Link href="/shopping-cart" className="btn btn-line btn-large font-weight-600 capitalize w-full">
            View Cart
          </Link>
          <Link href="/check-out" className="btn btn-primary btn-large font-weight-600 w-full">
            Check Out
          </Link>
        </div>

        <a
          href="#"
          className="block cursor-pointer text-underline text-center font-weight-600"
          onClick={(event) => {
            event.preventDefault();
            closeModal();
          }}
        >
          Or continue shopping
        </a>
      </div>
    </Modal>
  );
}
