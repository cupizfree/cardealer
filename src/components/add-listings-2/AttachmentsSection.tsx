"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type Attachment = { id: number; name: string; type: "PDF" | "Doc" };

const INITIAL_ATTACHMENTS: Attachment[] = [
  { id: 1, name: "Infomation", type: "PDF" },
  { id: 2, name: "Infomation", type: "Doc" },
];

let nextId = 3;

// Migrated from ../aurexo/add-listings-2.html lines 1130-1170 + its own trailing inline `<script>`.
// "Infomation" is source's own literal typo (same one already seen on services-center.html/about-us.html
// TeamModal), preserved verbatim on the 2 initial items. Traced the real behavior in full: "Choose File"
// accepts only .pdf/.doc/.docx (unsupported extensions are silently skipped, matching source), each valid
// file becomes a new real item showing its own file name and detected type/icon, and clicking the trash
// icon really removes that item — reproduced as real React state instead of direct DOM append/remove.
export default function AttachmentsSection() {
  const [attachments, setAttachments] = useState<Attachment[]>(INITIAL_ATTACHMENTS);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const added: Attachment[] = [];
    for (const file of files) {
      const extension = file.name.split(".").pop()?.toLowerCase();
      const type = extension === "pdf" ? "PDF" : extension === "doc" || extension === "docx" ? "Doc" : null;
      if (!type) continue;
      added.push({ id: nextId++, name: file.name.replace(/\.[^/.]+$/, ""), type });
    }
    if (added.length > 0) setAttachments((current) => [...current, ...added]);
    event.target.value = "";
  }

  function handleRemove(id: number) {
    setAttachments((current) => current.filter((attachment) => attachment.id !== id));
  }

  return (
    <div className="dashboard-box bg-white style-3 mb-30" id="Attachments">
      <p className="h4 mb-20">Attachments</p>

      <div className="attachments-box flex flex-wrap gap-20 mb-20">
        {attachments.map((attachment) => (
          <div className="flex" key={attachment.id}>
            <a className="item" href="#" onClick={(event) => event.preventDefault()}>
              <Image className="type-icon" src={attachment.type === "PDF" ? "/assets/icons/pdf.svg" : "/assets/icons/doc.svg"} alt="" width={24} height={24} />
              <p className="text-secondary flex flex-col">
                {attachment.name}
                <span className="h7 font-weight-600 line-height-28 text-primary">{attachment.type}</span>
              </p>

              <p className="trash" onClick={(event) => { event.preventDefault(); event.stopPropagation(); handleRemove(attachment.id); }}>
                <Image className="type-icon" src="/assets/icons/trash.svg" alt="" width={20} height={20} />
              </p>
            </a>
          </div>
        ))}
      </div>
      <div className="car-gallery-upload__actions">
        <button type="button" className="btn btn-line-1 btn-large font-weight-600 car-gallery-upload__btn" id="attachmentsChooseFileBtn" onClick={() => inputRef.current?.click()}>
          Choose File
        </button>
        <input
          ref={inputRef}
          type="file"
          id="attachmentsInput"
          accept=".pdf,.doc,.docx"
          multiple
          className="car-gallery-upload__input"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <span className="text-sm text-secondary">Upload file PDF, Doc, Docx</span>
      </div>
    </div>
  );
}
