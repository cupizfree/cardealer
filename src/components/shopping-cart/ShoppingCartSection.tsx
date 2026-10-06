"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/common/CartProvider";

// Migrated from ../aurexo/shopping-cart.html lines 476-644. Source's own static markup hardcodes 3 demo
// rows as a real fallback for a genuinely empty cart (`shop.js`'s `renderShoppingCartItems()`: "If no
// items in localStorage, keep default HTML (do nothing)") — but per explicit user request, this is
// deliberately NOT reproduced: emptying the real cart (by removing every item) now shows a real empty
// state instead of falling back to those 3 unrelated demo products, which read as confusing/wrong right
// after a user's own remove action. This also makes `ShoppingCartSection` consistent with how
// `ShoppingCartModal`/`CheckoutOrderSummary` already handle an empty cart (nothing, not demo filler).
export default function ShoppingCartSection() {
  const { items, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="innerpage__content md-mb-30">
        <div className="compare-empty-state text-center">
          <p className="text-muted mb-20">Keranjang Anda masih kosong</p>
          <Link href="/shop" className="btn btn-primary btn-large font-weight-600">
            Lanjut Belanja
          </Link>
        </div>
      </div>
    );
  }

  return <ShoppingCartTable items={items} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />;
}

type CartRow = ReturnType<typeof useCart>["items"][number];

function ShoppingCartTable({
  items,
  updateQuantity,
  removeFromCart,
}: {
  items: CartRow[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
}) {
  return (
    <div className="innerpage__content md-mb-30">
      <p className="flash-sale mb-20">
        <Image className="icon" src="/assets/icons/flash.png" alt="flash" width={24} height={24} />
        <span className="text-primary">
          Keranjang Anda akan kedaluwarsa dalam <span className="font-bold text-primary">04:48</span> menit! Segera checkout sebelum barang habis!
        </span>
      </p>

      <p className="mb-4">
        Beli <span className="font-weight-600">Rp 1.050.000</span> lagi untuk dapat <span className="font-weight-600">Gratis kirim</span>
      </p>

      <div className="progress-bar mb-30">
        <div className="percent" style={{ "--percent": "50%" } as React.CSSProperties} />
        <div className="progress-bar__bg" />
      </div>

      <div className="cart-wrapper">
        <div className="cart-header">
          <div className="font-weight-600">Produk</div>
          <div className="font-weight-600">Harga</div>
          <div className="font-weight-600">Jumlah</div>
          <div className="font-weight-600">Total Harga</div>
          <div className="font-weight-600" />
        </div>

        <div className="cart-items" id="shopCartItems">
          {items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item__product">
                <div className="cart-item__image">
                  <Image src={item.image} alt={item.name} width={64} height={64} />
                </div>
                <div className="cart-item__name">
                  <span className="font-weight-600">{item.name}</span>
                </div>
              </div>
              <div className="cart-item__price">
                <span className="price">Rp {item.price.toLocaleString("id-ID")}</span>
              </div>
              <div className="cart-item__quantity">
                <div className="quantity-selector">
                  <button
                    type="button"
                    className="quantity-selector__btn quantity-selector__btn--minus flex"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <input
                    className="quantity-selector__value"
                    value={item.quantity}
                    type="number"
                    min={0}
                    onChange={(event) => updateQuantity(item.id, Math.max(0, Number(event.target.value) || 0))}
                  />
                  <button
                    type="button"
                    className="quantity-selector__btn quantity-selector__btn--plus flex"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 12H19" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="cart-item__total">
                <span className="total-price">
                  {item.quantity} X Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="cart-item__action">
                <button
                  type="button"
                  className="cart-item__remove"
                  aria-label="Remove item"
                  onClick={() => removeFromCart(item.id)}
                >
                  <RemoveIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* "Perbarui Keranjang" has no matching handler anywhere in source (quantity edits already apply
          immediately via the real +/- and typed-value handlers above, so there's nothing left to
          "commit") and "Pakai Kupon" has no matching handler either — both UI_ONLY, same as every
          other unwired form control this session. */}
      <div className="cart-total flex justify-between gap-12">
        <div className="cart-total__voucher">
          <input type="text" className="input-large" placeholder="Add voucher discount" />
          <button type="button" className="btn btn-small-2 btn-primary">
            Pakai Kupon
          </button>
        </div>
        <div className="cart-total__actions">
          <button type="button" className="btn btn-primary btn-large-3">
            Perbarui Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}

const RemoveIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.64052 9.1099C9.67536 9.14474 9.703 9.1861 9.72186 9.23162C9.74071 9.27714 9.75042 9.32594 9.75042 9.37521C9.75042 9.42448 9.74071 9.47327 9.72186 9.5188C9.703 9.56432 9.67536 9.60568 9.64052 9.64052C9.60568 9.67536 9.56432 9.703 9.5188 9.72186C9.47327 9.74071 9.42448 9.75042 9.37521 9.75042C9.32594 9.75042 9.27714 9.74071 9.23162 9.72186C9.1861 9.703 9.14474 9.67536 9.1099 9.64052L6.00021 6.53036L2.89052 9.64052C2.82016 9.71089 2.72472 9.75042 2.62521 9.75042C2.5257 9.75042 2.43026 9.71089 2.3599 9.64052C2.28953 9.57016 2.25 9.47472 2.25 9.37521C2.25 9.2757 2.28953 9.18026 2.3599 9.1099L5.47005 6.00021L2.3599 2.89052C2.28953 2.82016 2.25 2.72472 2.25 2.62521C2.25 2.5257 2.28953 2.43026 2.3599 2.3599C2.43026 2.28953 2.5257 2.25 2.62521 2.25C2.72472 2.25 2.82016 2.28953 2.89052 2.3599L6.00021 5.47005L9.1099 2.3599C9.18026 2.28953 9.2757 2.25 9.37521 2.25C9.47472 2.25 9.57016 2.28953 9.64052 2.3599C9.71089 2.43026 9.75042 2.5257 9.75042 2.62521C9.75042 2.72472 9.71089 2.82016 9.64052 2.89052L6.53036 6.00021L9.64052 9.1099Z"
      fill="#1C1C1C"
    />
  </svg>
);
