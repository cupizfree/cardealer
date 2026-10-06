"use client";

// "Save & Preview"/"Pasang Iklan" are source's own literal dead `href="#"` (confirmed via grep — no script
// anywhere touches either) — UI_ONLY.
export default function AddListingsHeader() {
  return (
    <div className="title-section gap-12 mb-30">
      <p className="h3">Tambah Iklan</p>
      <div className="flex items-center gap-10">
        <a href="#" className="btn btn-line-1 px-24 btn-large font-weight-600" onClick={(event) => event.preventDefault()}>
          Simpan &amp; Pratinjau
        </a>
        <a href="#" className="btn btn-primary px-24 btn-large font-weight-600" onClick={(event) => event.preventDefault()}>
          Pasang Iklan
        </a>
      </div>
    </div>
  );
}
