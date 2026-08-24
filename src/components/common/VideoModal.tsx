"use client";

import Modal from "./Modal";

// Migrated from ../aurexo/home-02.html lines 4895-4913 (`#VideoModal`). A real, specific YouTube embed
// (not a template placeholder) — a plain `<iframe>` needs no third-party library, so this is built as
// a genuine working embed rather than a decorative fallback. Mounted per-page (like `NewsletterModal`),
// since only pages with a "Video Section" play-button trigger it.
export default function VideoModal() {
  return (
    <Modal id="VideoModal" className="modal-video">
      <iframe
        className="iframe-video"
        src="https://www.youtube.com/embed/BaoTxLLy_oQ?rel=0&modestbranding=1"
        allowFullScreen
      />
    </Modal>
  );
}
