"use client";

import { useModal } from "./ModalProvider";
import { CloseXIcon, SearchIcon } from "./icons";

// `.search-modal` uses its own shell (full-width overlay), distinct from the generic `.modal`
// wrapper the other modals share — matches the source's separate markup for #SearchModal.
export default function SearchModal() {
  const { activeModal, closeModal } = useModal();
  const isOpen = activeModal === "SearchModal";

  return (
    <div className={`search-modal${isOpen ? " active" : ""}`}>
      <div className="search-modal__overlay" onClick={closeModal} />
      <div className="search-modal__content">
        <button className="search-modal__close" onClick={closeModal} aria-label="Close">
          <CloseXIcon />
        </button>
        <h2 className="search-modal__title">WHAT ARE YOU LOOKING FOR?</h2>
        <form className="search-modal__form" action="#" method="get">
          <div className="search-modal__input-wrapper">
            <input
              type="text"
              className="search-modal__input"
              placeholder="Search for anything"
              autoComplete="off"
              id="searchModalInput"
            />
            <button type="submit" className="search-modal__submit" aria-label="Search">
              <SearchIcon />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
