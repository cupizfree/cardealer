// Halaman "Ulasan Pelanggan" (/clients-reviews).
//
// Dulu sembilan ulasan dengan sembilan foto wajah orang, lengkap dengan
// paginasi tiga halaman — semuanya karangan. Salah satunya bahkan menjabat
// "CEO BMW", dan komentar di dalam berkas aslinya mengakui bahwa tiga entri
// pertama identik byte-per-byte dengan slide di halaman about-us.
//
// Tidak ada tabel ulasan di basis data. Jadi: tidak ada ulasan, dan itu
// dikatakan apa adanya — bukan sembilan kartu kosong dengan bintang lima di
// atasnya, dan bukan paginasi yang membagi nol ulasan jadi tiga halaman.
//
// Paginasi dan state-nya ikut dibuang, bukan cuma disembunyikan: keduanya
// menghitung dari `testimonials.length`, jadi kalau array-nya kosong mereka
// tidak pernah tampil tapi juga tidak pernah berguna.
//
// Begitu MARF punya ulasan sungguhan, halaman ini tinggal memanggil
// `ClientsReviewsCarousel` dengan isinya.
export default function ClientsReviewsSection() {
  return (
    <section className="pb-100">
      <div className="container">
        <h2>Ulasan Pelanggan</h2>
        <div className="tf-spacing-style3" />

        <p className="text-secondary">
          Belum ada ulasan. Ulasan yang tampil di halaman ini nanti hanya yang benar-benar
          ditulis pelanggan MARF — bukan contoh.
        </p>
      </div>
    </section>
  );
}
