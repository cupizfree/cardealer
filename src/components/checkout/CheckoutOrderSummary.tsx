"use client";

import Image from "next/image";
import { useCart } from "@/components/common/CartProvider";

// Migrated from ../aurexo/check-out.html lines 709-767. Traced `shop.js`'s real `renderCartItems()` in
// full: it targets the generic `.your-order` class (shared with `ShoppingCartModal`, NOT
// shopping-cart.html's own dedicated `#shopCartItems`/`renderShoppingCartItems()` — a different
// function with a different real behavior), and unconditionally `.empty()`s the container before
// repopulating from real `localStorage` data. Unlike shopping-cart.html's own page (which falls back to
// 3 static demo rows only while the cart is genuinely empty), this page's order summary has NO fallback
// at all — an empty real cart renders nothing here, matching `renderCartItems()`'s real behavior
// exactly. Per the explicit request to pull real cart contents here, this renders `CartProvider`'s
// `items` directly with no static placeholder rows.
//
// Source's own per-item link (`href="product-details.html"`, identical for every row) has no real
// per-product destination `CartItem` could resolve to (it only carries name/image/price/quantity, not
// a slug) — rendered as a plain non-link row instead of a dead link to nowhere in particular.
//
// Traced `updateSubtotal()`/`updateShoppingCartSubtotal()` again: neither's selector scope
// (`.bottom-modal`/`.send-inquiry`) matches anything on this page, so Shipping/Discounts/Total are
// never touched by any script here — they stay permanently static ("Free"/"-$80.00"/"$186,99")
// regardless of what's actually in the cart, reproduced as literal strings, not computed.
export default function CheckoutOrderSummary() {
  const { items } = useCart();

  return (
    <div className="right">
      <div className="h-48 lg-hidden" />
      <div className="tf-spacing-style3" />
      <p className="h4 mb-30">Your Order</p>

      <div className="your-order mb-20">
        {items.map((item) => (
          <div className="order-item" key={item.id}>
            <div className="flex items-center gap-16">
              <Image className="order-item-img" src={item.image} alt={item.name} width={64} height={64} />
              <p className="font-weight-600">{item.name}</p>
            </div>
            <p className="font-weight-600">
              {item.quantity} X ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="cart-total style-2 flex justify-between gap-12 flex-col mb-12">
        <div className="cart-total__voucher full">
          <input type="text" className="input-large" placeholder="Add voucher discount" />
          <button type="button" className="btn btn-small-2 btn-primary">
            Apply Coupon
          </button>
        </div>
      </div>

      <p className="text-sm mb-30">Discount code is only used for orders with a total value of products over $50.00</p>

      <div className="divider mb-20" />

      <div className="flex justify-between gap-8 mb-16">
        <p className="font-weight-600">Shipping</p>
        <p className="text-secondary">Free</p>
      </div>

      <div className="flex justify-between gap-8 mb-20">
        <p className="font-weight-600">Discounts</p>
        <p className="text-secondary">-$80.00</p>
      </div>

      <div className="divider mb-20" />

      <div className="flex justify-between gap-8 mb-20">
        <p className="h4 font-weight-600">Total</p>
        <p className="h4 text-secondary">$186,99</p>
      </div>
    </div>
  );
}
