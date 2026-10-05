"use client";

import Image from "next/image";
import Link from "next/link";
import Modal from "./Modal";
import { useModal } from "./ModalProvider";
import { useCompare } from "./CompareProvider";

// The bottom "compare tray" (#CompareModal). Source hardcodes 3 identical static demo items
// ("2017 BMV X1 xDrive 20d xline") with no real link to whichever listings were actually compared —
// traced `app.js`'s `compareModal()` in full and confirmed it only removes items from that static
// list / toggles the empty state, nothing ever adds a real listing. Now wired to the real
// `CompareProvider` context (see its own header comment) so this shows whichever listings were
// actually clicked from `ListingCard`/`HalfMapListingCard` — a genuine new feature, not scoped to
// migrating source's decorative demo. Remove-button + empty-state markup/behavior unchanged.
export default function CompareTrayModal() {
  const { compareItems, removeFromCompare } = useCompare();
  const { closeModal } = useModal();

  return (
    <Modal id="CompareModal" className="modal-bottom">
      <div className="compare-modal-content">
        {compareItems.length > 0 ? (
          <div className="compare-items" id="compareItems">
            <div className="compare-item-list">
              {compareItems.map((item) => (
                <div className="compare-item flex items-center gap-12" key={item.id}>
                  <button
                    className="compare-item-remove"
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeFromCompare(item.id)}
                  >
                    <Image src="/assets/icons/close-modal.svg" alt="car" className="radius-50" width={16} height={16} />
                  </button>
                  <div className="compare-item-image">
                    <Image src={item.image} alt="car" className="radius-50" width={56} height={56} />
                  </div>
                  <div className="compare-item-info">
                    <p className="h7 font-weight-500 mb-8">{item.title}</p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-4">
                        <Image src="/assets/icons/icon-gauge.svg" alt="mileage" width={16} height={16} />
                        <span className="text-sm">{item.spec.mileage}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Image src="/assets/icons/calendar.svg" alt="fuel" width={16} height={16} />
                        <span className="text-sm">{item.spec.year}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Image src="/assets/icons/gaspump.svg" alt="transmission" width={16} height={16} />
                        <span className="text-sm">{item.spec.fuel}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Image src="/assets/icons/auto.svg" alt="transmission" width={16} height={16} />
                        <span className="text-sm">{item.spec.transmission}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="compare-action">
              {/* Client-side navigation doesn't remount the root layout, so without an explicit
                  closeModal() this tray would stay stacked open on top of /compare after navigating
                  there (a real page load in source would have reset it for free). */}
              <Link href="/compare" className="btn btn-primary btn-large font-weight-600" onClick={closeModal}>
                Bandingkan
              </Link>
            </div>
          </div>
        ) : (
          <div className="compare-empty-state text-center" id="compareEmptyState">
            <p className="text-muted">Perbandingan Anda masih kosong</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
