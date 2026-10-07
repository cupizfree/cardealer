"use client";

import Image from "next/image";
import { KONTAK } from "@/data/kontak";
import type { BlogComment } from "@/data/blogPosts";

// Migrated from ../aurexo/blog-details-1.html lines 625-716. "Balas" links and the comment form are
// both UI_ONLY — no matching handler anywhere in source (confirmed via search); the form's `onSubmit`
// just prevents the default GET-to-"#" navigation. Source's 2nd comment (Tony Nguyen) is the only one
// missing the `h5` class on its name (a real, minor markup inconsistency, preserved as-is).
export default function BlogComments({ comments }: { comments: BlogComment[] }) {
  return (
    <>
      <p className="h3 mb-20">{comments.length.toString().padStart(2, "0")} Comments</p>

      <div className="flex flex-col gap-24 mb-42">
        {comments.map((comment, index) => (
          <a
            href="#"
            className={`comments-post${index === 1 ? " comments-post--inner" : ""}`}
            key={comment.id}
            onClick={(event) => event.preventDefault()}
          >
            <div className="avatar">
              <Image src={comment.avatar ?? "/assets/images/blog/comments-post-1.jpg"} alt="avatar" width={56} height={56} />
            </div>
            <div className="content">
              {index === 1 ? (
                <p className="mb-4">{comment.authorName}</p>
              ) : (
                <p className="h5 mb-4">{comment.authorName}</p>
              )}
              <p className="text-secondary text-sm mb-12">{comment.timeAgo}</p>
              <p className="text-secondary h7 mb-12">{comment.text}</p>
              <p className="text-underline font-weight-600 text-highlight">Balas</p>
            </div>
          </a>
        ))}
      </div>

      <form action="#" className="blog-detail-comment-form" onSubmit={(event) => event.preventDefault()}>
        <p className="h3 mb-24 capitalize">Tinggalkan komentar</p>
        <div className="grid grid-cols-2 gap-22 mb-16 md-grid-cols-1">
          <div className="md-col-span-2">
            <p className="mb-8">Nama Anda (publik)</p>
            <input className="active input-large" id="name-comment" name="name-review" type="text" required />
          </div>
          <div className="md-col-span-2">
            <p className="mb-8">Email Anda (privat)</p>
            <input className="input-large" name="email-comment" id="email-review" type="text" required />
          </div>

          <div className="col-span-2 padding-0">
            <p className="mb-8">Komentar</p>
            <textarea placeholder="Tulis komentar Anda di sini" rows={3} tabIndex={5} name="comment" className="message" id="comment" required />
          </div>
        </div>

        <label className="filter-checkbox style-2 style-3 mb-28">
          <input type="checkbox" name="features" value="touch-screen" />
          <span>Simpan nama dan email untuk ulasan berikutnya</span>
        </label>
        <button type="submit" className="btn btn-primary-3 btn-large font-weight-600 capitalize">
          Kirim Komentar
        </button>
      </form>
    </>
  );
}
