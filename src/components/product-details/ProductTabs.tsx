"use client";

import { useState } from "react";
import type { ProductWithDetail } from "@/data/products";
import ProductReviews from "./ProductReviews";

const TABS = ["Description", "Customer Reviews", "Shipping & Returns"] as const;
type Tab = (typeof TABS)[number];

// Migrated from ../aurexo/product-details.html lines 709-1030. Source itself defaults to the
// "Customer Reviews" tab active (confirmed via its `active` class sitting on that `<li>` and the
// matching `content-inner`, not "Description") — reproduced as the real `defaultActive`, not "fixed"
// to open on the first tab.
export default function ProductTabs({ product }: { product: ProductWithDetail }) {
  const [active, setActive] = useState<Tab>("Customer Reviews");

  return (
    <>
      <div className="tf-spacing mb-8" />

      <div className="overflow-x-auto">
        <ul className="menu-tab menu-tab-style6 primary text-white justify-center mx-auto">
          {TABS.map((tab) => (
            <li key={tab} className={active === tab ? "active" : undefined}>
              <span className="h4 text-white font-weight-600" onClick={() => setActive(tab)}>
                {tab}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rating-box-product-detail rating-box max-w-1170 mx-auto content-tab">
        <div className={`content-inner${active === "Description" ? " active" : ""}`}>
          <p className="mb-24">{product.descriptionTab.intro}</p>
          <div className="tf-product-des-demo grid grid-cols-2 gap-30">
            <div className="right">
              <p className="font-weight-500 h5">Features</p>
              <ul>
                {product.descriptionTab.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <p className="font-weight-500 h5">Materials Care</p>
              <ul className="mb-0">
                {product.descriptionTab.materialsContent.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="left">
              <p className="font-weight-500 h5 mb-15">Materials Care</p>
              {product.descriptionTab.careInstructions.map((line, index, arr) => (
                <div
                  className={`flex gap-10 items-center${index < arr.length - 1 ? " mb-16" : ""}`}
                  key={line}
                >
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`content-inner${active === "Customer Reviews" ? " active" : ""}`}>
          <ProductReviews ratingSummary={product.ratingSummary} reviews={product.reviews} />
        </div>

        <div className={`content-inner${active === "Shipping & Returns" ? " active" : ""}`}>
          <p className="font-weight-500 h5 mb-15">{product.shippingTab.heading}</p>
          {product.shippingTab.paragraphs.map((paragraph, index, arr) => (
            <p className={`text-secondary${index < arr.length - 1 ? " mb-15" : ""}`} key={index}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
