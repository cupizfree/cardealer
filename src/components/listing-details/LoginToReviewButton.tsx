"use client";

import { useModal } from "@/components/common/ModalProvider";

export default function LoginToReviewButton() {
  const { openModal } = useModal();
  return (
    <button
      type="button"
      className="btn btn-primary btn-large font-weight-600 capitalize"
      onClick={() => openModal("LoginModal")}
    >
      Login to add a Review
    </button>
  );
}
