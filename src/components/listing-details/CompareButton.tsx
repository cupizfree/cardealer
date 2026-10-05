"use client";

import { useModal } from "@/components/common/ModalProvider";

// Opens the same static 2-vehicle `#CardModal` (`CardCompareModal.tsx`) already mounted globally in
// the root layout — this page is the first control in the app that actually references it (see that
// component's own comment, updated alongside this change).
export default function CompareButton() {
  const { openModal } = useModal();
  return (
    <a
      href="#"
      className="btn btn-medium btn-line open-modal padding-button-medium gap-5 font-weight-600"
      onClick={(event) => {
        event.preventDefault();
        openModal("CardModal");
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
          stroke="#1C1C1C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M6.875 10H13.125" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 6.875V13.125" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Bandingkan
    </a>
  );
}
