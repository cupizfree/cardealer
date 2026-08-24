"use client";

import { useEffect, useState } from "react";
import CarGallerySection from "./CarGallerySection";
import CarDetailsSection from "./CarDetailsSection";
import FeaturesSection from "./FeaturesSection";
import CarPriceSection from "./CarPriceSection";
import DealerLocationSection from "@/components/common/DealerLocationSection";
import VideoSection from "./VideoSection";
import AttachmentsSection from "./AttachmentsSection";

// Migrated from ../aurexo/add-listings-2.html lines 592-1172 (the `<form>`). `openDropdown` is lifted
// here (not into each section) because source's own `selectDropdown()` closes EVERY other
// `.filter-select-dropdown` on the page when one opens — including across sections (Car Details' fields
// and Location's "Map Location" dropdown all participate in the same single-open-at-a-time group).
export default function AddListingsForm() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".filter-select-dropdown")) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  function toggleDropdown(name: string) {
    setOpenDropdown((current) => (current === name ? null : name));
  }

  return (
    <form action="#" onSubmit={(event) => event.preventDefault()}>
      <CarGallerySection />
      <CarDetailsSection openDropdown={openDropdown} onToggleDropdown={toggleDropdown} />
      <FeaturesSection />
      <CarPriceSection />
      <DealerLocationSection openDropdown={openDropdown} onToggleDropdown={toggleDropdown} />
      <VideoSection />
      <AttachmentsSection />
    </form>
  );
}
