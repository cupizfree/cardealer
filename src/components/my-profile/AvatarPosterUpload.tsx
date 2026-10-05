"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const VALID_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
const MAX_SIZE = 4 * 1024 * 1024;

// Migrated from ../aurexo/my-profile.html's own trailing inline `<script>` (real, page-specific).
// Traced in full: selecting a file really validates its size (4MB max) and type (PNG/JPG/SVG only),
// `alert()`-ing and rejecting the file if either check fails, then reads it via `FileReader` and swaps
// the preview image + shows the real file name. Reproduced as real React state instead of direct DOM
// mutation, same validation rules and `alert()` fallback (kept as a plain `alert` rather than a styled
// toast — source itself uses the browser's own `alert()`, not a custom UI).
function useFileUpload(initialSrc: string) {
  const [previewSrc, setPreviewSrc] = useState(initialSrc);
  const [fileName, setFileName] = useState("No file choose");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE) {
      alert("File size must be less than 4MB");
      return;
    }
    if (!VALID_TYPES.includes(file.type)) {
      alert("Please select a PNG, JPG, or SVG file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => setPreviewSrc(loadEvent.target?.result as string);
    reader.readAsDataURL(file);
    setFileName(file.name);
  }

  return { previewSrc, fileName, inputRef, handleChange };
}

export default function AvatarPosterUpload() {
  const avatar = useFileUpload("/assets/images/avatar/avatar-10.jpg");
  const poster = useFileUpload("/assets/images/avatar/avatar-11.jpg");

  return (
    <>
      <p className="font-weight-600 mb-12">Upload Avatar*</p>
      <div className="upload-section mb-18">
        <div className="flex items-start gap-20">
          <div className="upload-preview upload-preview--avatar">
            <Image id="avatarPreview" src={avatar.previewSrc} alt="Avatar Preview" width={120} height={120} unoptimized={avatar.previewSrc.startsWith("data:")} />
          </div>
          <div className="upload-content flex-1">
            <p className="font-weight-600 mb-6">Unggah Berkas</p>
            <p className="text-xs text-secondary mb-6">PNG, JPG, SVG dimensi (400 × 400), ukuran berkas maksimal 4 MB.</p>
            <div className="flex">
              <div className="upload-action">
                <button type="button" className="upload-btn" onClick={() => avatar.inputRef.current?.click()}>
                  Pilih Berkas
                </button>
                <input
                  ref={avatar.inputRef}
                  type="file"
                  id="avatarInput"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                  className="upload-input"
                  onChange={avatar.handleChange}
                />
                <span className="text-xs text-muted file-name">{avatar.fileName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mb-12 font-weight-600"> Dealer Poster*</p>
      <div className="upload-section mb-20">
        <div className="upload-preview--poster-wrapper">
          <div className="upload-preview--poster">
            <Image id="posterPreview" src={poster.previewSrc} alt="Dealer Poster Preview" width={160} height={120} unoptimized={poster.previewSrc.startsWith("data:")} />
          </div>
          <div className="upload-content flex-1">
            <p className="font-weight-600 mb-4">Unggah Berkas</p>
            <p className="text-xs text-secondary mb-12">PNG, JPG, SVG dimensi (400 × 400), ukuran berkas maksimal 4 MB.</p>
            <div className="flex">
              <div className="upload-action">
                <button type="button" className="upload-btn" onClick={() => poster.inputRef.current?.click()}>
                  Pilih Berkas
                </button>
                <input
                  ref={poster.inputRef}
                  type="file"
                  id="posterInput"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                  className="upload-input"
                  onChange={poster.handleChange}
                />
                <span className="text-xs text-muted file-name">{poster.fileName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
