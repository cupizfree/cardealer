"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const INITIAL_PREVIEW = "/assets/images/inner-page/slide-listing-details-5.jpg";
const INITIAL_GALLERY = [
  "/assets/images/inner-page/slide-listing-details-6.jpg",
  "/assets/images/inner-page/slide-listing-details-5.jpg",
  "/assets/images/inner-page/slide-listing-details-7.jpg",
  "/assets/images/inner-page/slide-listing-details-8.jpg",
  "/assets/images/inner-page/slide-listing-details-9.jpg",
  "/assets/images/inner-page/slide-listing-details-10.jpg",
  "/assets/images/inner-page/slide-listing-details-11.jpg",
];
const MAX_GALLERY = 6;

// Migrated from ../aurexo/add-listings-2.html's own trailing inline `<script>` (real, page-specific).
// Traced in full: clicking "Choose File" triggers the hidden file input; on selection, `FileReader`
// reads each file as a data URL and swaps it into the preview image (single-image case) or fills the
// gallery grid (first into any empty slot, then appends a new slot only while under 6 total).
// Reproduced as real React state instead of direct DOM mutation. **Confirmed via Playwright that the
// Car Gallery upload is a real feature that is nonetheless effectively inert given source's own initial
// markup**: the static gallery already ships with 7 images (all with real, non-empty `src` values, so
// source's own "look for an empty slot" scan never finds one), and 7 already exceeds source's own "only
// create a new slot below 6" cap — so a freshly uploaded file can never visibly appear in the grid on
// this page as authored. Reproduced exactly: `gallery.length < MAX_GALLERY` starts `false` (7 < 6) and
// stays that way, matching source's real runtime behavior rather than "fixing" the cap to make uploads
// visibly work.
export default function CarGallerySection() {
  const [previewSrc, setPreviewSrc] = useState(INITIAL_PREVIEW);
  const [gallery, setGallery] = useState<string[]>(INITIAL_GALLERY);
  const previewInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  function handlePreviewChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => setPreviewSrc(loadEvent.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleGalleryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target?.result as string;
        setGallery((current) => (current.length < MAX_GALLERY ? [...current, dataUrl] : current));
      };
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="dashboard-box bg-white style-3 mb-30">
      <p className="h4 mb-20">Gallery</p>

      <div className="car-preview-upload mb-20">
        <p className="h4 mb-20">Car Preview</p>
        <div className="car-preview-upload__image-wrapper">
          <Image id="carPreviewImage" src={previewSrc} alt="Car Preview" width={694} height={520} className="car-preview-upload__image" unoptimized={previewSrc.startsWith("data:")} />
        </div>
        <div className="car-preview-upload__actions">
          <button type="button" className="btn btn-line-1 btn-large font-weight-600 car-preview-upload__btn" onClick={() => previewInputRef.current?.click()}>
            Choose File
          </button>
          <input
            ref={previewInputRef}
            type="file"
            id="carPreviewInput"
            accept="image/jpeg,image/png,image/jpg"
            className="car-preview-upload__input"
            onChange={handlePreviewChange}
          />
          <span className="text-sm text-secondary">Upload file JPG, PNG</span>
        </div>
      </div>

      <div className="car-gallery-upload">
        <p className="h4 mb-20">Car Gallery</p>
        <div className="car-gallery-upload__grid">
          {gallery.map((src, index) => (
            <div className="car-gallery-upload__item" key={index}>
              <Image src={src} alt={`Gallery ${index + 1}`} width={105} height={105} className="car-gallery-upload__image" unoptimized={src.startsWith("data:")} />
            </div>
          ))}
        </div>
        <div className="car-gallery-upload__actions">
          <button type="button" className="btn btn-line-1 btn-large font-weight-600 car-gallery-upload__btn" onClick={() => galleryInputRef.current?.click()}>
            Choose File
          </button>
          <input
            ref={galleryInputRef}
            type="file"
            id="carGalleryInput"
            accept="image/jpeg,image/png,image/jpg"
            multiple
            className="car-gallery-upload__input"
            onChange={handleGalleryChange}
          />
          <span className="text-sm text-secondary">Upload file JPG, PNG</span>
        </div>
      </div>
    </div>
  );
}
