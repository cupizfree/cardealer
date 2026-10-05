"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Product } from "@/data/products";
import { parsePrice } from "@/data/products";
import { useCart } from "@/components/common/CartProvider";
import { useModal } from "@/components/common/ModalProvider";

// Migrated from ../aurexo/product-details.html lines 1034-1158, and reused verbatim by
// shopping-cart.html (byte-identical 4-product carousel there — confirmed via direct source diff).
// Same `.swiper-card`/`.swiper-products` pagination config as `RelatedListings` (`assets/js/swiper.js`).
//
// Two real per-page differences, parameterized rather than duplicating the whole component:
// - `headingClassName`: product-details.html centers this heading (`mb-40 text-center`);
//   shopping-cart.html's own heading is left-aligned (`mb-40` only) — confirmed via direct source diff.
// - `enableQuickView`: each card's "quick view" eye icon (`data-modal-id="#QuickViewModal"`) has NO
//   matching modal anywhere on product-details.html (confirmed via search of that page specifically) —
//   dead there, so it defaults to unwired. shop.html AND shopping-cart.html DO define a real
//   `#QuickViewModal` (see `common/QuickViewModal.tsx`), so this page's own usage passes
//   `enableQuickView` to open it — each page's real source behavior is reproduced on its own terms
//   rather than homogenized across every place this component is reused.
// The heart (wishlist) icon is not wired to anything real in source on either page (no `shop.js`
// favorites call reads this specific icon's state) and stays decorative everywhere. "Masukkan Keranjang" IS
// real in source on both pages (`shop.js`'s `getProductDataFromCard` reads this exact card's own
// name/image/price) — reproduced with the real `CartProvider` regardless of host page.
export default function RelatedProducts({
  products,
  headingClassName = "mb-40 text-center",
  enableQuickView = false,
}: {
  products: Product[];
  headingClassName?: string;
  enableQuickView?: boolean;
}) {
  const { addToCart } = useCart();
  const { openModal } = useModal();

  return (
    <>
      <div className="tf-spacing" />
      <h2 className={headingClassName}>Produk Terkait</h2>
      <div className="swiper-card swiper-products">
        <Swiper
          modules={[Pagination]}
          spaceBetween={30}
          pagination={{ el: ".pagination-swiper-products", clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            767: { slidesPerView: 2 },
            991: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="product">
                <div className="product-top">
                  {product.promotion && (
                    <div className={`promotion text-white ${product.promotion.colorClass}`}>
                      {product.promotion.text}
                    </div>
                  )}
                  <div className="actions">
                    <p className="action-heart action" onClick={(event) => event.preventDefault()}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16.6875 3C14.7516 3 13.0566 3.8325 12 5.23969C10.9434 3.8325 9.24844 3 7.3125 3C5.77146 3.00174 4.29404 3.61468 3.20436 4.70436C2.11468 5.79404 1.50174 7.27146 1.5 8.8125C1.5 15.375 11.2303 20.6869 11.6447 20.9062C11.7539 20.965 11.876 20.9958 12 20.9958C12.124 20.9958 12.2461 20.965 12.3553 20.9062C12.7697 20.6869 22.5 15.375 22.5 8.8125C22.4983 7.27146 21.8853 5.79404 20.7956 4.70436C19.706 3.61468 18.2285 3.00174 16.6875 3ZM12 19.3875C10.2881 18.39 3 13.8459 3 8.8125C3.00149 7.66921 3.45632 6.57317 4.26475 5.76475C5.07317 4.95632 6.16921 4.50149 7.3125 4.5C9.13594 4.5 10.6669 5.47125 11.3062 7.03125C11.3628 7.16881 11.4589 7.28646 11.5824 7.36926C11.7059 7.45207 11.8513 7.49627 12 7.49627C12.1487 7.49627 12.2941 7.45207 12.4176 7.36926C12.5411 7.28646 12.6372 7.16881 12.6937 7.03125C13.3331 5.46844 14.8641 4.5 16.6875 4.5C17.8308 4.50149 18.9268 4.95632 19.7353 5.76475C20.5437 6.57317 20.9985 7.66921 21 8.8125C21 13.8384 13.71 18.3891 12 19.3875Z"
                          fill="#1C1C1C"
                        />
                      </svg>
                    </p>

                    <p
                      className="action transition3s"
                      onClick={enableQuickView ? () => openModal("QuickViewModal", product) : undefined}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M23.1853 11.6962C23.1525 11.6222 22.3584 9.86062 20.5931 8.09531C18.2409 5.74312 15.27 4.5 12 4.5C8.72999 4.5 5.75905 5.74312 3.40687 8.09531C1.64155 9.86062 0.843741 11.625 0.814679 11.6962C0.772035 11.7922 0.75 11.896 0.75 12.0009C0.75 12.1059 0.772035 12.2097 0.814679 12.3056C0.847491 12.3797 1.64155 14.1403 3.40687 15.9056C5.75905 18.2569 8.72999 19.5 12 19.5C15.27 19.5 18.2409 18.2569 20.5931 15.9056C22.3584 14.1403 23.1525 12.3797 23.1853 12.3056C23.2279 12.2097 23.25 12.1059 23.25 12.0009C23.25 11.896 23.2279 11.7922 23.1853 11.6962ZM12 18C9.11437 18 6.59343 16.9509 4.50655 14.8828C3.65028 14.0313 2.92179 13.0603 2.34374 12C2.92164 10.9396 3.65014 9.9686 4.50655 9.11719C6.59343 7.04906 9.11437 6 12 6C14.8856 6 17.4066 7.04906 19.4934 9.11719C20.3514 9.9684 21.0814 10.9394 21.6609 12C20.985 13.2619 18.0403 18 12 18ZM12 7.5C11.11 7.5 10.2399 7.76392 9.49992 8.25839C8.7599 8.75285 8.18313 9.45566 7.84253 10.2779C7.50194 11.1002 7.41282 12.005 7.58646 12.8779C7.76009 13.7508 8.18867 14.5526 8.81801 15.182C9.44735 15.8113 10.2492 16.2399 11.1221 16.4135C11.995 16.5872 12.8998 16.4981 13.7221 16.1575C14.5443 15.8169 15.2471 15.2401 15.7416 14.5001C16.2361 13.76 16.5 12.89 16.5 12C16.4987 10.8069 16.0242 9.66303 15.1806 8.81939C14.337 7.97575 13.1931 7.50124 12 7.5ZM12 15C11.4066 15 10.8266 14.8241 10.3333 14.4944C9.83993 14.1648 9.45541 13.6962 9.22835 13.1481C9.00129 12.5999 8.94188 11.9967 9.05763 11.4147C9.17339 10.8328 9.45911 10.2982 9.87867 9.87868C10.2982 9.45912 10.8328 9.1734 11.4147 9.05764C11.9967 8.94189 12.5999 9.0013 13.148 9.22836C13.6962 9.45542 14.1648 9.83994 14.4944 10.3333C14.824 10.8266 15 11.4067 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15Z"
                          fill="#1C1C1C"
                        />
                      </svg>
                    </p>
                  </div>

                  <Link className="img" href={`/product-details/${product.slug}`}>
                    <Image className="img" src={product.image} alt={product.title} width={280} height={210} />
                  </Link>

                  <p
                    className="product-add-to-cart"
                    onClick={() => {
                      addToCart({ name: product.title, image: product.image, price: parsePrice(product.price) }, 1);
                      openModal("ShoppingCartModal");
                    }}
                  >
                    Masukkan Keranjang
                  </p>
                </div>
                <Link href={`/product-details/${product.slug}`} className="font-weight-600">
                  {product.title}
                </Link>
                <p className="h5 price">
                  {product.price} {product.oldPrice && <span className="price-old">{product.oldPrice}</span>}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-pagination pagination-dark pagination-style pagination-swiper-products mt-38" />
      </div>
    </>
  );
}
