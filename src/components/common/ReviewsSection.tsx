import Image from "next/image";
import type { ListingRatingSummary, Review } from "@/data/listings";
import StarRatingInput from "@/components/listing-details/StarRatingInput";
import LoginToReviewButton from "@/components/listing-details/LoginToReviewButton";

// Blok "Ulasan Pelanggan" di halaman detail unit, detail showroom, dan detail tim.
//
// Sebelumnya blok ini SELALU menampilkan 4,8 dari 98 penilaian dan tiga ulasan
// yang sama di setiap unit — dan ketiga "pengulas" itu (Bagas Prasetyo, Rina
// Kusumawati, Dimas Nugroho) justru nama orang yang dulu dipajang sebagai tim
// sales di halaman lain. Artinya showroom mengutip stafnya sendiri sebagai
// pelanggan, di setiap mobil, dengan angka yang tidak pernah dihitung dari mana
// pun. Tidak ada tabel ulasan di basis data; tidak ada satu pun ulasan asli.
//
// Sekarang: tidak ada ulasan, dan itu dikatakan apa adanya. Begitu MARF punya
// ulasan sungguhan, isi `ratingSummary`/`reviews` di `src/data/listings.ts` —
// komponen ini langsung menampilkannya lagi tanpa perubahan lain.
//
// Formulir "Tambah ulasan" juga dibuang, bukan disembunyikan: `action="#"` dan
// tanpa penyimpanan apa pun, jadi siapa pun yang mengisinya akan mengira
// ulasannya terkirim padahal hilang begitu halaman ditutup.
export default function ReviewsSection({
  ratingSummary,
  reviews,
  sectionId,
}: {
  ratingSummary?: ListingRatingSummary;
  reviews?: Review[];
  /** Beberapa halaman memakai id ini sebagai jangkar bagian. */
  sectionId?: string;
}) {
  const adaUlasan = Boolean(reviews?.length) && Boolean(ratingSummary);

  if (!adaUlasan) {
    return (
      <div id={sectionId}>
        <p className="h4 mb-16">Ulasan Pelanggan</p>
        <p className="text-secondary">
          Belum ada ulasan. Ulasan yang tampil di sini nanti hanya yang benar-benar
          ditulis pelanggan MARF — bukan contoh.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="h4 mb-16" id={sectionId}>
        Ulasan Pelanggan
      </p>

      <div className="rating-box mb-40">
        <div className="rating-box__content">
          <div className="rating-box__overview">
            <div className="rating-box__average">
              <span className="rating-box__score">{ratingSummary!.average}</span>
              <div className="rating-box__stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Image key={i} src="/assets/icons/star-2.svg" alt="star" width={16} height={16} />
                ))}
              </div>
              <p className="rating-box__count">
                ({ratingSummary!.count.toLocaleString("id-ID")} Penilaian)
              </p>
            </div>
          </div>
          <div className="rating-box__distribution">
            {ratingSummary!.distribution.map((row) => (
              <div className="rating-box__bar-item" key={row.stars}>
                <p className="rating-box__bar-label">
                  <span className="text">{row.stars}</span>
                  <Image src="/assets/icons/star-2.svg" alt="star" width={16} height={16} />
                </p>
                <div className="rating-box__bar-wrapper">
                  <div className="rating-box__bar" style={{ width: `${row.percent}%` }} />
                </div>
                <span className="rating-box__bar-percent">{row.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="comments mb-40">
        {reviews!.map((review, index) => (
          <div className="comment-box" key={review.id} id={index === reviews!.length - 1 ? "reviewForm" : undefined}>
            <div className="comment-box__header mb-20">
              {review.authorAvatar ? (
                <div className="comment-box__avatar">
                  <Image src={review.authorAvatar} alt="avatar" width={48} height={48} />
                </div>
              ) : (
                <div className="comment-box__avatar guest">{review.authorInitials}</div>
              )}
              <div>
                <div className="flex items-center text-secondary mb-8 gap-4">
                  <p className="h5">{review.authorName}</p>
                  <span className="text-secondary text-sm">-</span>
                  <span className="text-secondary text-sm">{review.date}</span>
                </div>
                <div className="flex items-center">
                  {Array.from({ length: review.rating }, (_, i) => (
                    <Image key={i} src="/assets/icons/star-2.svg" alt="star" width={16} height={16} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-secondary">{review.text}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="h4 capitalize mb-8">tambah ulasan</p>
        <p className="mb-24">Alamat email Anda tidak akan dipublikasikan</p>
        <form action="#" className="add-review-form">
          <div className="grid grid-cols-2 gap-22 mb-12 md-grid-cols-1">
            <div className="md-col-span-2 padding-0">
              <p className="mb-8">Nama</p>
              <input className="active input-large" id="name-review" name="name-review" type="text" required />
            </div>
            <div className="md-col-span-2 padding-0">
              <p className="mb-8">Email</p>
              <input className="input-large" name="email-review" id="email-review" type="text" required />
            </div>
            <div className="col-span-2 padding-0">
              <p className="mb-8">Ulasan</p>
              <textarea placeholder="Tulis ulasan Anda" rows={3} tabIndex={5} name="message" className="message" id="message" required />
            </div>
          </div>

          <div className="col-span-2 padding-0">
            <p className="mb-12">Penilaian</p>
            <StarRatingInput defaultRating={5} />
          </div>

          <LoginToReviewButton />
        </form>
      </div>
    </>
  );
}
