// Canonical Aurexo blog post entity — "Blog family" per docs/migration/MIGRATION_STATUS.md. Built
// while migrating blog-details-1.html, the first blog page analyzed (blog-list.html/blog-standard.html/
// blog-grid-style-*.html haven't been migrated yet). Mirrors the same "one fully-analyzed record + real
// card-only stubs falling back to it" shape as `Listing`/`Product` (see `src/data/listings.ts` and
// `src/data/products.ts`): every blog card site-wide points at the literal same static
// `blog-details-1.html` file (confirmed via site-wide grep for `blog-details-1.html`) with no
// per-post identifier — the same "no working per-item route in source" situation those two families
// had — so `id`/`slug` here are synthetic, same convention as `Listing`/`Product`.
//
// Semua 14 artikel kini punya badan lengkap sendiri (intro, kutipan, 4-5 bagian, kesimpulan,
// tag, komentar). Sebelumnya hanya id 1 yang punya; id 2-14 jatuh ke badan id 1 lewat
// `withBlogPostDetailFallback`, sehingga halaman artikel tentang ban menampilkan tulisan tentang
// SUV. Fallback di bawah kini hanya jaring pengaman, bukan jalur normal.
// Ids 2-4 are real card titles/images/dates/excerpts already captured from financing.html's
// `NewsTipsSection` (all 3 of its cards linked generically to `/blog-details-1` before this dataset
// existed) — not invented for this task. Notably, 2 of those 3 titles ("Truck vs. Minivan..."/
// "Tires: All-Season vs. Summer vs. Winter...") are the exact same titles blog-details-1.html's own
// Previous/Next navigation names — but that navigation's own `href` points at `blog-details-2.html`
// (not this dataset), a real source cross-reference disclosed in `BlogPostBody.tsx`'s own comment
// rather than silently rewired to point here instead.

export type BlogComment = {
  id: number;
  authorName: string;
  avatar?: string;
  timeAgo: string;
  text: string;
};

export type BlogPostSection = {
  heading: string;
  body: string;
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  cardImage: string;
  excerpt?: string;

  // Detail-only — setiap artikel kini mengisinya sendiri. Sisa opsional supaya artikel baru
  // bisa ditambahkan sebagai kartu dulu tanpa memaksa badan tulisan langsung ada.
  bannerImage?: string;
  bodyImage?: string;
  intro?: string;
  quote?: { text: string; author: string };
  introContinued?: string;
  sideImages?: [string, string];
  sections?: BlogPostSection[];
  conclusion?: BlogPostSection;
  tags?: string[];
  comments?: BlogComment[];
};

export type BlogPostCardData = Pick<BlogPost, "id" | "slug" | "title" | "category" | "date" | "author" | "cardImage" | "excerpt">;

export const allBlogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "compact-suv-vs-full-size-suv",
    title: "SUV Kompak vs. SUV Besar: Apa Bedanya?",
    category: "PERFORMA",
    date: "Aug. 8, 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/blog-details.jpg",
    bannerImage: "/assets/images/blog/blog-details.jpg",
    bodyImage: "/assets/images/blog/post-40.jpg",
    intro:
      "Saat memilih antara SUV kompak dan SUV besar, ada beberapa faktor utama yang perlu dipertimbangkan. Memahami perbedaan kedua jenis kendaraan ini bisa sangat memengaruhi keputusan Anda — membantu menemukan yang paling sesuai dengan gaya hidup, kebiasaan berkendara, dan kebutuhan Anda.",
    quote: {
      text: "“Memilih SUV yang tepat bukan sekadar soal ukuran—tapi soal menemukan yang paling sesuai dengan gaya hidup, kebutuhan, dan petualangan Anda.”",
      author: "Tim MARF",
    },
    introContinued:
      "Dari ukuran dan ruang yang ditawarkan sampai efisiensi bahan bakar, kemampuan performa, dan total biaya kepemilikan, setiap jenis SUV menjawab prioritas dan preferensi yang berbeda. Dengan menimbang semua aspek ini secara cermat, Anda bisa membuat pilihan yang lebih matang — yang tidak hanya memenuhi kebutuhan saat ini, tetapi juga mendukung tujuan jangka panjang dan gaya hidup Anda.",
    sideImages: ["/assets/images/blog/post-41.jpg", "/assets/images/blog/post-42.jpg"],
    sections: [
      {
        heading: "1. Ukuran dan Ruang",
        body: "SUV besar menawarkan ruang kabin lebih lega, sehingga cocok untuk keluarga besar atau yang butuh kapasitas bagasi lebih banyak. Sebaliknya, SUV kompak lebih lincah dan mudah diparkir, jadi pilihan tepat untuk berkendara di dalam kota.",
      },
      {
        heading: "2. Efisiensi Bahan Bakar",
        body: "Umumnya, SUV kompak lebih hemat bahan bakar dibandingkan versi besarnya. Kalau efisiensi bahan bakar jadi prioritas Anda, SUV kompak bisa menghemat pengeluaran bensin seiring waktu.",
      },
      {
        heading: "3. Performa dan Kemampuan",
        body: "SUV besar sering dibekali mesin lebih bertenaga dan kemampuan menarik beban lebih besar, sehingga cocok untuk petualangan off-road dan angkutan berat. SUV kompak, meski tetap mumpuni, mungkin tidak menawarkan tingkat performa dan kemampuan yang sama dengan model besar.",
      },
      {
        heading: "4. Biaya",
        body: "Biaya jadi pembeda penting lainnya. SUV besar biasanya lebih mahal, baik dari harga beli maupun biaya perawatan rutinnya. SUV kompak umumnya lebih terjangkau, sehingga jadi pilihan ramah kantong bagi banyak pembeli.",
      },
    ],
    conclusion: {
      heading: "Kesimpulan",
      body: "Memilih antara SUV kompak dan SUV besar bergantung pada kebutuhan spesifik Anda — apakah mengutamakan efisiensi bahan bakar, ruang kabin, atau performa. Memahami perbedaan ini membantu Anda mengambil keputusan yang lebih matang sesuai gaya hidup dan anggaran.",
    },
    tags: ["Performa", "Mewah"],
    comments: [],
  },
  {
    id: 2,
    slug: "luxury-suvs-vs-crossovers",
    title: "SUV Mewah vs. Crossover: Mana yang Tepat untuk Anda?",
    category: "PERAWATAN",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-32.jpg",
    bannerImage: "/assets/images/blog/post-32.jpg",
    bodyImage: "/assets/images/blog/post-33.jpg",
    intro:
      "Di ruang pamer, dua mobil bisa tampak sama besar dan sama tinggi, tetapi harganya terpaut ratusan juta. Di situlah bedanya SUV mewah dan crossover sering kali tidak terlihat dari luar.",
    quote: {
      text: "“Mobil mewah tidak lebih baik dari crossover. Ia hanya menjawab pertanyaan yang berbeda.”",
      author: "Admin MARF",
    },
    introContinued:
      "Perbedaan keduanya bukan soal siapa yang menang, melainkan soal apa yang Anda bayar. SUV mewah menaruh uang Anda pada bahan kabin, peredaman suara, dan tenaga mesin. Crossover menaruhnya pada efisiensi, biaya perawatan, dan kemudahan parkir. Memahami ke mana uang itu pergi membuat Anda tidak membeli sesuatu yang sebenarnya tidak Anda butuhkan.",
    sideImages: ["/assets/images/blog/post-34.jpg", "/assets/images/blog/post-35.jpg"],
    sections: [
      {
        heading: "1. Definisi dan Posisi",
        body: "Crossover dibangun di atas platform mobil penumpang, dengan bodi yang ditinggikan. Hasilnya: bobot lebih ringan, kemudi lebih ringan, dan konsumsi bahan bakar lebih dekat ke sedan. SUV mewah umumnya memakai platform khusus dengan sasis lebih kaku, suspensi lebih rumit, dan penggerak yang disiapkan untuk medan berat.",
      },
      {
        heading: "2. Kenyamanan dan Ruang Kabin",
        body: "Di sinilah jarak keduanya paling terasa. SUV mewah memakai bahan pelapis lebih tebal, kaca akustik, dan peredam yang membuat kabin senyap di kecepatan tinggi. Crossover tetap nyaman untuk harian, tetapi suara jalan dan mesin lebih terdengar masuk. Soal ruang, keduanya sering setara — yang berbeda adalah kualitas materialnya, bukan luasnya.",
      },
      {
        heading: "3. Biaya Kepemilikan",
        body: "Harga beli hanyalah awal. Servis berkala SUV mewah bisa dua sampai tiga kali crossover, dan suku cadangnya sering harus didatangkan. Konsumsi bahan bakar juga lebih tinggi karena bobot dan tenaganya. Kalau Anda memakai mobil setiap hari untuk jarak jauh, selisih ini menumpuk cepat.",
      },
      {
        heading: "4. Nilai Jual Kembali",
        body: "Kedua jenis menyusut, tetapi polanya berbeda. Crossover populer dengan mesin kecil cenderung lebih mudah dijual karena pasarnya luas dan biaya perawatannya terjangkau. SUV mewah menyusut lebih tajam di awal, lalu melandai — tetapi pembelinya lebih sedikit dan lebih pemilih, jadi proses jualnya bisa lebih lama.",
      },
    ],
    conclusion: {
      heading: "Kesimpulan",
      body: "Pilih SUV mewah kalau kenyamanan, ketenangan kabin, dan tenaga adalah hal yang Anda nikmati setiap hari, dan Anda siap menanggung biaya perawatannya. Pilih crossover kalau Anda mencari kendaraan praktis dengan biaya wajar dan pemakaian dalam kota yang lebih sering. Kalau ragu, coba keduanya untuk rute harian Anda — bukan hanya putaran singkat di sekitar showroom.",
    },
    tags: ["Mewah", "Ulasan"],
    comments: [],
  },
  {
    id: 3,
    slug: "truck-vs-minivan",
    title: "Pikap vs. Minibus: Mana yang Lebih Baik untuk Keluarga?",
    category: "BERITA",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-31.jpg",
    bannerImage: "/assets/images/blog/post-31.jpg",
    bodyImage: "/assets/images/blog/post-30.jpg",
    intro:
      "Pikap dan minibus sering dibeli karena alasan yang sama: butuh mobil yang bisa menampung banyak. Tetapi begitu dipakai sehari-hari, keduanya menuntut kompromi yang sangat berbeda.",
    quote: {
      text: "“Pikap mengangkut barang dan menitipkan penumpangnya di belakang. Minibus melakukan sebaliknya.”",
      author: "Admin MARF",
    },
    introContinued:
      "Pilihan ini jarang soal mana yang lebih baik, melainkan soal siapa yang paling sering Anda bawa. Kalau bak belakang lebih sering terisi daripada kursi ketiga, pikap menang. Kalau penumpang lebih penting daripada muatan, minibus hampir selalu lebih masuk akal.",
    sideImages: ["/assets/images/blog/post-29.jpg", "/assets/images/blog/post-36.jpg"],
    sections: [
      {
        heading: "1. Kapasitas Penumpang",
        body: "Minibus menang tanpa perdebatan. Kabin tertutup dengan kursi berbaris membuat penumpang duduk seperti di mobil biasa, dengan sabuk pengaman dan AC yang menjangkau semua baris. Pikap biasanya hanya punya satu baris kabin; versi double cabin menambah baris kedua, tetapi kursinya sempit dan tegak karena berbagi ruang dengan bak.",
      },
      {
        heading: "2. Ruang Barang",
        body: "Di sini pikap tidak tertandingi. Bak terbuka bisa memuat barang yang tinggi, kotor, atau basah tanpa merusak kabin — sesuatu yang tidak mungkin dilakukan minibus. Kelemahannya, barang di bak terbuka terkena hujan, panas, dan risiko hilang. Anda perlu menambah penutup bak, dan itu biaya tersendiri.",
      },
      {
        heading: "3. Kenyamanan Berkendara",
        body: "Minibus dibangun untuk kenyamanan: suspensi lebih lembut, kabin senyap, dan posisi duduk yang wajar. Pikap memakai suspensi belakang yang kaku karena harus menahan beban, jadi saat kosong terasa memantul. Radius putarnya juga lebih besar, dan parkir di gang sempit jadi pekerjaan tersendiri.",
      },
      {
        heading: "4. Biaya Operasional",
        body: "Pikap umumnya bermesin diesel dengan torsi besar dan konsumsi bahan bakar yang wajar meski dimuat penuh — tetapi pajaknya lebih tinggi karena masuk kategori kendaraan niaga. Minibus berbensin lebih murah pajaknya, tetapi konsumsi bahan bakarnya naik tajam saat penuh. Hitung keduanya dengan pemakaian nyata Anda, bukan angka di brosur.",
      },
    ],
    conclusion: {
      heading: "Kesimpulan",
      body: "Untuk keluarga dengan anak yang masih kecil, minibus hampir selalu pilihan yang lebih baik — penumpang duduk di dalam, aman, dan nyaman. Pikap masuk akal kalau Anda punya usaha yang butuh mengangkut barang, atau memang sering membawa peralatan besar. Kalau kebutuhan Anda campuran, pertimbangkan minibus dengan kursi belakang yang bisa dilipat.",
    },
    tags: ["Berita", "Tips"],
    comments: [],
  },
  {
    id: 4,
    slug: "tires-all-season-vs-summer-vs-winter",
    title: "Ban: Segala Musim vs. Musim Panas vs. Musim Dingin – Yang Perlu Anda Tahu",
    category: "TIPS",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-23.jpg",
    bannerImage: "/assets/images/blog/post-23.jpg",
    bodyImage: "/assets/images/blog/post-37.jpg",
    intro:
      "Ban adalah satu-satunya bagian mobil yang menyentuh jalan. Dari empat telapak sebesar telapak tangan itulah seluruh pengereman, belok, dan akselerasi disalurkan.",
    quote: {
      text: "“Mesin menentukan seberapa cepat Anda pergi. Ban menentukan apakah Anda sampai.”",
      author: "Admin MARF",
    },
    introContinued:
      "Tiga jenis ban yang beredar di pasaran dirancang untuk kondisi yang berbeda. Memilih yang salah tidak langsung berbahaya, tetapi membuat mobil tidak bekerja sebaik seharusnya — dan di Indonesia, ban musim dingin hampir selalu pilihan yang keliru.",
    sideImages: ["/assets/images/blog/post-38.jpg", "/assets/images/blog/post-39.jpg"],
    sections: [
      {
        heading: "1. Ban Segala Musim (All-Season)",
        body: "Ini pilihan paling aman untuk mayoritas pengendara Indonesia. Komponnya dirancang tetap lentur di suhu dingin maupun panas, dengan alur yang cukup untuk membuang air. Komprominya: cengkeraman di salju tidak sebaik ban musim dingin, dan di lintasan kering tidak sebaik ban musim panas. Untuk iklim tropis, kompromi ini hampir tidak terasa.",
      },
      {
        heading: "2. Ban Musim Panas",
        body: "Komponnya lebih lunak dan alurnya lebih sedikit, sehingga area kontak dengan aspal lebih luas. Hasilnya cengkeraman kering dan basah yang sangat baik, serta jarak pengereman lebih pendek. Kelemahannya, ban ini mengeras dan kehilangan cengkeraman di suhu rendah — dan aus lebih cepat kalau dipakai di jalan yang kasar.",
      },
      {
        heading: "3. Ban Musim Dingin",
        body: "Dirancang untuk suhu di bawah titik beku, dengan kompon yang tetap lentur dan alur berukir dalam untuk menahan salju. Di jalan panas, kompon ini cepat aus dan jarak pengeremannya justru memburuk. Untuk pemakaian di Indonesia, ban jenis ini tidak punya manfaat praktis.",
      },
      {
        heading: "4. Memilih Sesuai Iklim Indonesia",
        body: "Untuk pemakaian harian di Indonesia, ban segala musim adalah pilihan yang paling seimbang — terutama karena kita lebih sering menghadapi hujan lebat daripada jalan kering yang sempurna. Perhatikan kode tanggal produksi di dinding ban: karet mengeras seiring usia, jadi ban yang belum dipakai pun tetap menua. Ganti setelah lima tahun, apa pun ketebalan alurnya.",
      },
    ],
    conclusion: {
      heading: "Kesimpulan",
      body: "Kalau Anda berkendara harian di jalan campuran, ban segala musim sudah lebih dari cukup. Ban musim panas masuk akal kalau Anda memang sering melaju di jalan tol kering dan mengutamakan cengkeraman. Ban musim dingin tidak relevan untuk iklim kita. Yang paling penting bukan mereknya, melainkan tekanan angin yang tepat dan alur yang masih cukup untuk membuang air.",
    },
    tags: ["Tips", "Perawatan"],
    comments: [],
  },
  // ids 5-8: real card titles/images/dates captured from blog-standard.html's own featured card + grid
  // (the page being migrated when these were added) — not invented. That page repeats 2 of its own
  // titles across 2 differently-imaged/categorized card instances each (a real, disclosed source
  // inconsistency preserved as literal per-occurrence data in `BlogStandardList.tsx` rather than
  // reconciled here); the single `cardImage`/`category`/`excerpt` below is each post's most complete or
  // most prominent real occurrence on that page.
  {
    id: 5,
    slug: "sports-cars-vs-luxury-cars",
    title: "Mobil Sport vs. Mobil Mewah: Menemukan yang Tepat untuk Anda",
    category: "MEWAH",
    date: "Aug. 11, 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-18.jpg",
    bannerImage: "/assets/images/blog/post-18.jpg",
    bodyImage: "/assets/images/blog/post-19.jpg",
    intro:
      "Dua mobil bisa sama-sama berharga di atas satu miliar rupiah, tetapi dibangun dengan niat yang bertolak belakang. Yang satu dibuat untuk memuaskan pengemudi, yang satu untuk memanjakan penumpang.",
    quote: {
      text: "“Mobil sport meminta perhatian Anda. Mobil mewah meminta Anda melupakan bahwa Anda sedang mengemudi.”",
      author: "Admin MARF",
    },
    introContinued:
      "Kesalahpahaman paling umum adalah menganggap mobil mewah sebagai versi mobil sport yang lebih nyaman. Padahal keduanya menuntut kompromi yang berbeda, dan salah pilih akan terasa setiap hari — bukan hanya saat dipakai melaju kencang.",
    sideImages: ["/assets/images/blog/post-20.jpg", "/assets/images/blog/post-21.jpg"],
    sections: [
      {
        heading: "1. Tujuan Rancangan",
        body: "Mobil sport dibangun di sekitar pengemudi: posisi duduk rendah, kemudi berbobot, suspensi kaku, dan suara mesin yang sengaja diteruskan ke kabin. Mobil mewah dibangun di sekitar penumpang: kabin senyap, suspensi yang menyerap jalan buruk, dan kursi yang nyaman untuk perjalanan panjang. Keduanya berhasil, tetapi pada hal yang berbeda.",
      },
      {
        heading: "2. Kenyamanan Harian",
        body: "Kalau mobil ini dipakai setiap hari di jalan Indonesia, mobil mewah menang jauh. Suspensi kaku mobil sport terasa melelahkan di jalan bergelombang, dan posisi duduk rendah menyulitkan saat macet. Mobil sport baru menyenangkan ketika Anda punya jalan kosong dan waktu luang.",
      },
      {
        heading: "3. Biaya Perawatan",
        body: "Mobil sport menuntut lebih banyak: ban berperforma tinggi yang cepat aus, oli khusus, dan jarak servis lebih pendek. Rem dan kopling juga lebih cepat habis. Mobil mewah juga mahal, tetapi biayanya lebih terprediksi dan lebih jarang menuntut perhatian mendadak.",
      },
      {
        heading: "4. Nilai Emosional dan Nilai Jual",
        body: "Mobil sport cenderung menyusut lebih dalam karena pembelinya sedikit dan sangat memperhatikan riwayat pemakaian — mobil yang pernah dipakai di lintasan langsung dihindari. Mobil mewah menyusut lebih teratur karena pasarnya lebih luas dan pembelinya lebih mementingkan kondisi dan kelengkapan dokumen.",
      },
    ],
    conclusion: {
      heading: "Kesimpulan",
      body: "Kalau mobil ini jadi kendaraan utama Anda, mobil mewah adalah pilihan yang jauh lebih masuk akal — Anda akan memakainya setiap hari dan menikmatinya. Mobil sport masuk akal kalau ia kendaraan kedua, dan Anda memang punya jalan serta waktu untuk menikmatinya. Jangan beli mobil sport untuk dipakai macet setiap pagi; kecewa itu mahal.",
    },
    tags: ["Mewah", "Performa"],
    comments: [],
  },
  {
    id: 6,
    slug: "hybrid-vs-electric-cars",
    title: "Mobil Hibrida vs. Listrik: Mana yang Harus Anda Pilih?",
    category: "ULASAN AHLI",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-44.jpg",
    bannerImage: "/assets/images/blog/post-44.jpg",
    bodyImage: "/assets/images/blog/post-1.jpg",
    intro:
      "Hibrida dan listrik sering dianggap dua langkah menuju tujuan yang sama. Kenyataannya keduanya menjawab kebutuhan yang berbeda, dan pilihan yang tepat sangat bergantung pada di mana Anda tinggal.",
    quote: {
      text: "“Mobil listrik bukan sekadar mobil tanpa bensin. Ia mobil yang harus Anda isi di rumah.”",
      author: "Admin MARF",
    },
    introContinued:
      "Perbedaan paling menentukan bukan pada tenaga atau akselerasi, melainkan pada tempat tinggal Anda. Kalau Anda punya garasi dengan colokan listrik, mobil listrik bisa sangat masuk akal. Kalau Anda parkir di pinggir jalan atau tinggal di apartemen tanpa colokan, hibrida hampir selalu pilihan yang lebih tenang.",
    sideImages: ["/assets/images/blog/post-2.jpg", "/assets/images/blog/post-3.jpg"],
    sections: [
      {
        heading: "1. Cara Kerja Keduanya",
        body: "Hibrida menggabungkan mesin bensin dengan motor listrik kecil. Baterainya tidak perlu dicolok — ia terisi sendiri dari pengereman dan dari mesin bensin. Mobil listrik sepenuhnya mengandalkan baterai besar yang harus diisi dari sumber listrik luar.",
      },
      {
        heading: "2. Cara Mengisi dan Jarak Tempuh",
        body: "Hibrida tidak mengubah kebiasaan Anda sama sekali: isi bensin seperti biasa, dan konsumsi bahan bakarnya lebih hemat, terutama di dalam kota. Mobil listrik menuntut kebiasaan baru — Anda mengisi di rumah setiap malam seperti mengisi telepon genggam. Untuk perjalanan jauh, Anda perlu merencanakan tempat pengisian di sepanjang rute.",
      },
      {
        heading: "3. Biaya Kepemilikan",
        body: "Biaya per kilometer mobil listrik jauh lebih murah karena listrik lebih murah daripada bensin, dan komponen bergeraknya jauh lebih sedikit sehingga perawatannya ringan. Namun harga belinya masih lebih tinggi, dan penggantian baterai di kemudian hari adalah biaya besar yang harus Anda perhitungkan sejak awal.",
      },
      {
        heading: "4. Ketersediaan Layanan",
        body: "Hibrida bisa diservis di hampir semua bengkel yang menangani mobil biasa karena mesinnya masih mesin bensin. Mobil listrik memerlukan bengkel dengan teknisi dan peralatan khusus — jumlahnya masih terbatas dan sebagian besar terkonsentrasi di kota besar. Kalau Anda tinggal jauh dari kota, ini pertimbangan serius.",
      },
    ],
    conclusion: {
      heading: "Kesimpulan",
      body: "Kalau Anda punya akses listrik di rumah dan pemakaian Anda sebagian besar dalam kota, mobil listrik adalah pilihan yang sangat menyenangkan dan murah untuk dijalankan. Kalau Anda sering perjalanan jauh, tinggal di daerah dengan layanan terbatas, atau tidak punya tempat mengisi, hibrida memberi sebagian besar penghematan tanpa menuntut perubahan kebiasaan. Keduanya lebih baik daripada mobil bensin biasa — pertanyaannya cuma mana yang cocok dengan hidup Anda.",
    },
    tags: ["Ulasan", "Tren"],
    comments: [],
  },
  {
    id: 7,
    slug: "diesel-vs-gasoline-engines",
    title: "Diesel vs. Bensin: Kelebihan dan Kekurangannya",
    category: "PERFORMA",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-22.jpg",
    bannerImage: "/assets/images/blog/post-22.jpg",
    bodyImage: "/assets/images/blog/post-4.jpg",
    intro:
      "Mesin diesel dan bensin bekerja dengan prinsip yang berbeda, dan perbedaan itu menentukan karakter mobil yang memakainya — bukan sekadar soal mana yang lebih hemat.",
    quote: {
      text: "“Diesel membakar karena tekanan. Bensin membakar karena percikan api. Sisanya hanyalah akibat.”",
      author: "Admin MARF",
    },
    introContinued:
      "Di Indonesia, pilihan ini sering ditentukan oleh jenis mobilnya: pikap dan SUV besar hampir selalu diesel, sedangkan mobil penumpang kecil hampir selalu bensin. Tetapi memahami alasannya membantu Anda menilai apakah diesel masuk akal untuk pemakaian Anda.",
    sideImages: ["/assets/images/blog/post-5.jpg", "/assets/images/blog/post-6.jpg"],
    sections: [
      {
        heading: "1. Cara Kerja dan Karakter Tenaga",
        body: "Mesin bensin menyalakan campuran bahan bakar dengan percikan api busi. Mesin diesel memampatkan udara sampai sangat panas, lalu menyemprotkan bahan bakar yang menyala sendiri. Akibatnya diesel menghasilkan torsi besar di putaran rendah — itulah sebabnya ia kuat menarik beban dan menanjak tanpa perlu digas tinggi.",
      },
      {
        heading: "2. Efisiensi Bahan Bakar",
        body: "Mesin diesel lebih efisien secara termal, sehingga konsumsi bahan bakar per kilometer lebih rendah, terutama saat mengangkut beban. Namun harga solar di Indonesia tidak selalu lebih murah daripada bensin, jadi penghematannya tidak sebesar yang orang duga. Hitung ulang dengan harga di daerah Anda.",
      },
      {
        heading: "3. Biaya Perawatan",
        body: "Diesel menuntut lebih banyak: filter bahan bakar harus diganti lebih sering, dan sistem injeksinya sensitif terhadap kotoran maupun air. Perbaikan injektor diesel jauh lebih mahal daripada penggantian busi. Mesin bensin lebih sederhana, lebih murah dirawat, dan bisa ditangani hampir semua bengkel.",
      },
      {
        heading: "4. Suara, Getaran, dan Kenyamanan",
        body: "Diesel lebih berisik dan bergetar, terutama saat dingin. Mesin bensin lebih halus dan senyap. Untuk mobil penumpang yang dipakai di dalam kota, kehalusan bensin biasanya lebih dihargai. Untuk pikap dan kendaraan kerja, suara mesin bukan pertimbangan utama.",
      },
    ],
    conclusion: {
      heading: "Kesimpulan",
      body: "Pilih diesel kalau Anda mengangkut beban, sering menanjak, atau menempuh jarak jauh setiap hari — di sana torsonya benar-benar berguna dan penghematannya terasa. Pilih bensin kalau pemakaian Anda dalam kota, jarak dekat, dan Anda mengutamakan kehalusan serta biaya perawatan yang ringan. Jangan pilih diesel hanya karena katanya lebih hemat; kalau jarak tempuh Anda pendek, keuntungannya tidak akan pernah menutup biaya perawatannya.",
    },
    tags: ["Performa", "Ulasan"],
    comments: [],
  },
  {
    id: 8,
    slug: "manual-vs-automatic-transmission",
    title: "Manual vs. Matic: Mana yang Lebih Baik untuk Anda?",
    category: "ULASAN AHLI",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-23.jpg",
    bannerImage: "/assets/images/blog/post-23.jpg",
    bodyImage: "/assets/images/blog/post-7.jpg",
    intro:
      "Pertanyaan ini dulu mudah dijawab: manual lebih murah dan lebih hemat. Sekarang, dengan transmisi matic modern yang bertambah banyak gigi dan kopling ganda, jawabannya tidak lagi sesederhana itu.",
    quote: {
      text: "“Transmisi yang baik adalah transmisi yang membuat Anda berhenti memikirkannya.”",
      author: "Admin MARF",
    },
    introContinued:
      "Pilihan ini lebih banyak ditentukan oleh tempat Anda berkendara daripada oleh selera. Di kota yang macet setiap pagi, matic mengubah pengalaman berkendara secara drastis. Di jalan menanjak dan berkelok, manual masih memberi kendali yang tidak bisa ditiru matic konvensional.",
    sideImages: ["/assets/images/blog/post-8.jpg", "/assets/images/blog/post-9.jpg"],
    sections: [
      {
        heading: "1. Kemudahan Berkendara",
        body: "Matic menang telak di kemacetan. Tidak ada kopling yang harus dimainkan, tidak ada kaki kiri yang pegal, dan tidak ada risiko mesin mati saat menanjak. Manual menuntut koordinasi antara kopling, gas, dan tuas persneling — melelahkan di kota, tetapi justru memuaskan bagi yang menikmatinya.",
      },
      {
        heading: "2. Konsumsi Bahan Bakar",
        body: "Dulu manual selalu lebih hemat. Sekarang tidak lagi pasti. Matic modern dengan banyak gigi dan pengunci konverter torsi bisa menyamai atau bahkan mengalahkan manual, terutama di jalan datar. Manual masih unggul di jalan menanjak karena Anda bisa menahan gigi sesuai kebutuhan.",
      },
      {
        heading: "3. Biaya Perawatan",
        body: "Manual jauh lebih sederhana: satu kopling yang diganti setiap beberapa tahun, dan oli transmisi yang murah. Matic menuntut oli khusus dengan interval penggantian yang harus dipatuhi, dan kalau komponennya rusak, biaya perbaikannya bisa berkali lipat. Untuk mobil bekas berusia lanjut, ini pertimbangan besar.",
      },
      {
        heading: "4. Nilai Jual Kembali",
        body: "Pasar Indonesia condong ke matic, terutama untuk mobil keluarga dan mobil kota. Mobil matic dengan kondisi baik lebih cepat terjual dan harganya lebih stabil. Manual masih dicari untuk pikap, kendaraan niaga, dan kalangan penggemar — tetapi pasarnya lebih sempit.",
      },
    ],
    conclusion: {
      heading: "Kesimpulan",
      body: "Kalau Anda berkendara di kota setiap hari, matic adalah pilihan yang akan Anda syukuri setiap pagi. Kalau Anda tinggal di daerah berbukit, sering mengangkut beban, atau memang menikmati mengemudi, manual masih punya keunggulan nyata. Untuk mobil bekas berusia di atas delapan tahun, pertimbangkan biaya perbaikan matic sebelum memutuskan.",
    },
    tags: ["Ulasan", "Tips"],
    comments: [],
  },
  // ids 9-12: real card titles/images/dates for the "Artikel terbaru" sidebar widget (post-25..28), shared
  // verbatim by `blog-details/BlogSidebar.tsx` and `blog-standard/BlogStandardSidebar.tsx`. Originally
  // left un-sluggified as decorative filler (both sidebars just pointed every card at one existing real
  // slug), but the user explicitly asked for clicking a Recent Posts card to show that card's own real
  // content — added here so each of the 4 gets its own resolvable page (falling back to id 1's real
  // body/quote/sections/comments, same pattern as every other stub). No `excerpt` — this widget's own
  // card markup never shows one in source, only title/date/category.
  {
    id: 9,
    slug: "top-5-tips-car-resale-value",
    title: "5 Tips Menjaga Nilai Jual Mobil Anda",
    category: "BERITA",
    date: "5 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-25.jpg",
    bannerImage: "/assets/images/blog/post-25.jpg",
    bodyImage: "/assets/images/blog/post-10.jpg",
    intro:
      "Mobil adalah barang yang nilainya menyusut sejak hari pertama. Tetapi seberapa cepat ia menyusut sebagian besar bisa Anda kendalikan sendiri.",
    quote: {
      text: "“Calon pembeli tidak membeli tahun pembuatan. Ia membeli bukti bahwa mobil itu dirawat.”",
      author: "Admin MARF",
    },
    introContinued:
      "Lima kebiasaan berikut tidak mahal dan tidak merepotkan, tetapi selisihnya bisa puluhan juta rupiah saat Anda menjual kembali. Semuanya dimulai dari hal yang paling sering diabaikan: menyimpan bukti.",
    sideImages: ["/assets/images/blog/post-11.jpg", "/assets/images/blog/post-12.jpg"],
    sections: [
      {
        heading: "1. Rawat Buku Servis dan Bukti Perawatan",
        body: "Ini yang paling menentukan dan paling sering diabaikan. Simpan semua nota servis, tanggal penggantian oli, dan riwayat perbaikan. Mobil dengan buku servis lengkap bisa dihargai jauh lebih tinggi karena pembeli punya alasan untuk percaya. Tanpa bukti, klaim Anda hanya jadi cerita.",
      },
      {
        heading: "2. Jaga Kondisi Cat dan Bodi",
        body: "Bekas tabrakan kecil yang tidak diperbaiki cepat menyebar menjadi karat. Cuci rutin, segera bersihkan kotoran burung dan getah pohon, dan parkir di tempat teduh bila memungkinkan. Kalau ada lecet, perbaiki sebelum menjual — pembeli akan menawar jauh lebih besar daripada biaya perbaikannya.",
      },
      {
        heading: "3. Hindari Modifikasi yang Tidak Bisa Dikembalikan",
        body: "Pelek besar, knalpot bising, dan potong pegas menurunkan nilai jual, bukan menaikkannya. Sebagian besar pembeli menginginkan mobil yang masih standar. Kalau Anda memang ingin memodifikasi, simpan semua komponen aslinya supaya bisa dipasang kembali saat menjual.",
      },
      {
        heading: "4. Jaga Kabin dan Kilometer",
        body: "Kabin yang bersih dan wangi memberi kesan mobil dirawat, bahkan sebelum mesin dinyalakan. Pakai pelindung kursi sejak awal. Dan jangan tergoda menurunkan angka kilometer — selisihnya mudah terdeteksi dari riwayat servis, dan begitu ketahuan, seluruh kredibilitas Anda hilang.",
      },
      {
        heading: "5. Servis Sebelum Menjual",
        body: "Ganti oli, periksa rem, dan bereskan hal-hal kecil seperti lampu mati atau wiper keras sebelum memasang iklan. Biayanya kecil, tetapi membuat calon pembeli tidak punya alasan untuk menawar. Mobil yang siap pakai selalu terjual lebih cepat dan lebih mahal.",
      },
    ],
    conclusion: {
      heading: "Kesimpulan",
      body: "Nilai jual bukan ditentukan saat Anda menjual, melainkan sepanjang tahun-tahun sebelumnya. Kalau Anda melakukan kelima hal ini sejak awal, menjual mobil nanti akan jadi percakapan singkat, bukan perdebatan panjang soal harga.",
    },
    tags: ["Tips", "Perawatan"],
    comments: [],
  },
  {
    id: 10,
    slug: "rise-of-autonomous-vehicles",
    title: "Bangkitnya Kendaraan Otonom: Apa yang Bisa Diharapkan",
    category: "ULASAN AHLI",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-26.jpg",
    bannerImage: "/assets/images/blog/post-26.jpg",
    bodyImage: "/assets/images/blog/post-13.jpg",
    intro:
      "Selama bertahun-tahun kendaraan otonom digambarkan sebagai sesuatu yang akan tiba sekaligus. Kenyataannya kedatangannya bertahap, dan sebagian sudah Anda pakai tanpa menyebutnya demikian.",
    quote: {
      text: "“Mobil otonom tidak akan tiba dalam satu pagi. Ia menyelinap masuk lewat fitur yang Anda aktifkan satu per satu.”",
      author: "Admin MARF",
    },
    introContinued:
      "Rem darurat otomatis, penjaga jalur, dan pengatur jarak sudah menjadi perlengkapan standar di banyak mobil baru. Itu bukan kendaraan otonom penuh, tetapi itu adalah tangga menuju ke sana. Memahami tingkatannya membantu Anda menilai apa yang benar-benar Anda dapat hari ini.",
    sideImages: ["/assets/images/blog/post-14.jpg", "/assets/images/blog/post-15.jpg"],
    sections: [
      {
        heading: "1. Enam Tingkat Otonomi",
        body: "Tingkat 0 berarti tidak ada bantuan sama sekali. Tingkat 1 dan 2 membantu tetapi pengemudi tetap bertanggung jawab penuh — ini yang ada di mobil hari ini. Tingkat 3 membiarkan mobil mengemudi sendiri pada kondisi tertentu, tetapi pengemudi harus siap mengambil alih. Tingkat 4 dan 5 belum tersedia luas untuk konsumen.",
      },
      {
        heading: "2. Yang Sudah Ada di Jalan Indonesia",
        body: "Rem darurat otomatis, peringatan titik buta, kamera mundur, dan pengatur jarak sudah umum di mobil baru. Yang perlu dipahami: semuanya masih Tingkat 1 atau 2. Sistem ini membantu, bukan menggantikan. Pengemudi yang melepas tangan sepenuhnya pada sistem Tingkat 2 sedang menyalahgunakannya.",
      },
      {
        heading: "3. Hambatan Sebenarnya",
        body: "Kendalanya bukan hanya teknologinya. Marka jalan yang pudar, hujan deras, dan perilaku lalu lintas yang tidak terduga membuat sistem yang bekerja baik di jalan tol lurus jadi ragu di jalan kota kita. Belum lagi soal tanggung jawab hukum kalau terjadi kecelakaan — sampai hari ini masih belum jelas sepenuhnya.",
      },
      {
        heading: "4. Apa Artinya bagi Pembeli Mobil",
        body: "Jangan beli mobil karena embel-embel \"otonom\". Periksa fitur keselamatan yang benar-benar bekerja dan berguna setiap hari: rem darurat otomatis dan kamera. Perlengkapan yang tidak Anda gunakan tidak menaikkan nilai mobil Anda, dan fitur yang menganggur cenderung cepat usang.",
      },
    ],
    conclusion: {
      heading: "Kesimpulan",
      body: "Kendaraan yang sepenuhnya otonom masih jauh untuk jalanan Indonesia, dan itu tidak masalah. Yang layak Anda nantikan bukan mobil yang mengemudi sendiri, melainkan fitur keselamatan yang makin murah dan makin umum — dan itu sudah terjadi sekarang. Untuk beberapa tahun ke depan, pengemudi tetap yang paling canggih di dalam mobil.",
    },
    tags: ["Ulasan", "Tren"],
    comments: [],
  },
  {
    id: 11,
    slug: "how-to-choose-best-tires",
    title: "Cara Memilih Ban Terbaik untuk Mobil Anda",
    category: "TIPS",
    date: "Aug. 24, 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-27.jpg",
    bannerImage: "/assets/images/blog/post-27.jpg",
    bodyImage: "/assets/images/blog/post-16.jpg",
    intro:
      "Membeli ban sering dianggap soal merek. Padahal yang paling menentukan adalah ukuran, jenis, dan usia — tiga hal yang bisa Anda periksa sendiri dalam lima menit.",
    quote: {
      text: "“Ban termahal bukan ban terbaik. Ban terbaik adalah yang cocok dengan jalan yang Anda lalui setiap hari.”",
      author: "Admin MARF",
    },
    introContinued:
      "Panduan berikut disusun untuk pemakaian di Indonesia, di mana jalan campuran antara aspal halus, beton bergelombang, dan permukaan kasar adalah hal biasa. Empat langkah berikut menghemat uang Anda dan membuat mobil terasa lebih enak dikendarai.",
    sideImages: ["/assets/images/blog/post-17.jpg", "/assets/images/blog/post-20.jpg"],
    sections: [
      {
        heading: "1. Mulai dari Ukuran yang Tertulis di Ban",
        body: "Baca angka di dinding ban, misalnya 185/65 R15. Angka pertama adalah lebar dalam milimeter, angka kedua adalah rasio tinggi terhadap lebar, dan R15 adalah diameter pelek dalam inci. Jangan menyimpang dari ukuran ini tanpa alasan yang jelas — mengubahnya memengaruhi pembacaan speedometer dan bisa membuat ban bergesek dengan bodi.",
      },
      {
        heading: "2. Pilih Jenis Sesuai Pemakaian",
        body: "Untuk pemakaian harian di Indonesia, ban segala musim adalah pilihan paling seimbang karena lebih sering menghadapi hujan lebat daripada jalan kering sempurna. Ban berperforma tinggi hanya masuk akal kalau Anda memang sering melaju cepat di jalan tol dan siap menggantinya lebih sering.",
      },
      {
        heading: "3. Periksa Kode Tanggal Produksi",
        body: "Cari empat angka di dalam lingkaran oval pada dinding ban, misalnya 2325, yang berarti minggu ke-23 tahun 2025. Karet mengeras seiring usia meski bannya belum pernah dipakai. Hindari ban yang sudah berumur lebih dari tiga tahun saat dibeli, dan ganti setelah lima tahun pemakaian.",
      },
      {
        heading: "4. Perhatikan Beban dan Kecepatan",
        body: "Setiap ban mencantumkan indeks beban dan kecepatan. Jangan memasang ban dengan indeks lebih rendah daripada yang ditetapkan pabrikan, terutama kalau mobil sering dimuat penuh. Ban yang terlalu lemah untuk beban mobil akan cepat panas dan berisiko pecah di kecepatan tinggi.",
      },
      {
        heading: "5. Ganti Berpasangan dan Rutin Periksa Tekanan",
        body: "Ganti ban setidaknya sepasang untuk satu poros agar cengkeraman kiri dan kanan seimbang. Periksa tekanan angin setiap dua minggu saat ban masih dingin, dan lakukan rotasi setiap sepuluh ribu kilometer agar ausnya merata. Dua kebiasaan ini memperpanjang umur ban lebih banyak daripada memilih merek mahal.",
      },
    ],
    conclusion: {
      heading: "Kesimpulan",
      body: "Mulailah dari ukuran yang benar, pilih jenis sesuai jalan yang Anda lalui, dan periksa tanggal produksinya. Setelah itu barulah merek jadi pertimbangan. Ban yang tepat dengan tekanan angin yang benar akan selalu mengalahkan ban mahal yang tekanan anginnya salah.",
    },
    tags: ["Tips", "Perawatan"],
    comments: [],
  },
  {
    id: 12,
    slug: "hidden-costs-luxury-car",
    title: "Biaya Tersembunyi Memiliki Mobil Mewah",
    category: "TIPS",
    date: "Aug. 25, 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-28.jpg",
    bannerImage: "/assets/images/blog/post-28.jpg",
    bodyImage: "/assets/images/blog/post-21.jpg",
    intro:
      "Harga beli mobil mewah adalah biaya yang paling jelas — dan justru yang paling mudah direncanakan. Yang menggigit adalah biaya-biaya yang tidak muncul di iklan mana pun.",
    quote: {
      text: "“Mobil mewah bekas dengan harga terjangkau bukan kesempatan. Itu tagihan yang menunggu waktu.”",
      author: "Admin MARF",
    },
    introContinued:
      "Banyak orang mampu membeli mobil mewah bekas, tetapi tidak semua siap membiayainya. Lima pos berikut adalah yang paling sering mengejutkan pemilik baru — dan kelimanya jauh lebih mudah ditanggung kalau Anda sudah memperhitungkannya sejak awal.",
    sideImages: ["/assets/images/blog/post-22.jpg", "/assets/images/blog/post-24.jpg"],
    sections: [
      {
        heading: "1. Servis Berkala dan Suku Cadang",
        body: "Servis rutin mobil mewah bisa dua sampai tiga kali lipat mobil biasa, dan banyak komponennya hanya bisa dipesan dari luar negeri. Satu sensor yang rusak bisa berarti menunggu berminggu-minggu dan biaya yang setara servis lengkap mobil keluarga. Tanyakan harga tiga servis terakhir sebelum membeli.",
      },
      {
        heading: "2. Pajak dan Asuransi",
        body: "Pajak kendaraan dihitung dari nilai jual, jadi mobil mewah membayar jauh lebih besar setiap tahun — dan itu tidak berkurang secepat harga pasarnya. Premi asuransi juga naik karena nilai pertanggungan dan biaya perbaikan yang tinggi. Dua pos ini tetap harus dibayar walau mobilnya jarang dipakai.",
      },
      {
        heading: "3. Ban, Rem, dan Suku Cadang Habis Pakai",
        body: "Ban berukuran besar dan rem berperforma tinggi harganya jauh di atas ban mobil biasa, dan keduanya tetap aus pada laju yang sama. Beberapa mobil mewah memakai ban dengan ukuran yang tidak umum, sehingga pilihannya terbatas dan harganya tidak bisa ditawar dengan mencari merek lain.",
      },
      {
        heading: "4. Bahan Bakar dan Konsumsi",
        body: "Mesin besar dengan tenaga besar mengonsumsi bahan bakar jauh lebih banyak, dan banyak di antaranya menuntut bahan bakar beroktan tinggi. Kalau dipakai harian di dalam kota, biaya bahan bakarnya bisa melebihi cicilan mobil itu sendiri. Hitung dengan pemakaian nyata, bukan angka di brosur.",
      },
      {
        heading: "5. Penyusutan dan Proses Menjual",
        body: "Mobil mewah menyusut tajam di tahun-tahun pertama. Dan ketika Anda ingin menjual, pasarnya lebih sempit — calon pembeli lebih sedikit, lebih pemilih, dan lebih teliti memeriksa riwayat servis. Prosesnya bisa memakan waktu berbulan-bulan, sementara pajak dan asuransi tetap berjalan.",
      },
    ],
    conclusion: {
      heading: "Kesimpulan",
      body: "Mobil mewah bukan pilihan yang salah — selama Anda menghitung seluruh biayanya, bukan hanya harga belinya. Sebelum memutuskan, jumlahkan servis tahunan, pajak, asuransi, dan perkiraan penggantian komponen selama tiga tahun. Kalau angka itu masih nyaman, mobil mewah akan menyenangkan. Kalau pas-pasan di harga beli, biaya berikutnya yang akan menentukan.",
    },
    tags: ["Mewah", "Tips"],
    comments: [],
  },
  // id 13: `RelatedArticles`' (blog-details-1.html) 3 swiper slides all share this exact literal title in
  // source (confirmed via direct read) — a single repeated placeholder, not 3 distinct articles — so
  // unlike ids 9-12 this gets only ONE new entry, using the first slide's real image/category as the
  // canonical values; all 3 slides link to this same slug rather than 3 needlessly-identical ones.
  {
    id: 13,
    slug: "2025-bmw-5-series-priced",
    title: "BMW Seri 5 2025 Dibanderol Mulai Rp 950 Juta; i5 EV Mulai Rp 1,1 Miliar",
    category: "Ulasan Ahli",
    date: "5 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-4.jpg",
    bannerImage: "/assets/images/blog/post-4.jpg",
    bodyImage: "/assets/images/blog/post-29.jpg",
    intro:
      "BMW resmi membuka pemesanan Seri 5 generasi terbaru di Indonesia, dengan dua pilihan: versi mesin bensin dan versi listrik penuh yang diberi nama i5.",
    quote: {
      text: "“Selisih harganya sekitar Rp 150 juta. Pertanyaannya bukan mana yang lebih baik, tapi mana yang cocok dengan cara Anda mengisi energi.”",
      author: "Admin MARF",
    },
    introContinued:
      "Keduanya berbagi bodi, kabin, dan sebagian besar perlengkapan. Yang membedakan adalah sumber tenaganya — dan itu memengaruhi bukan hanya cara mengisi, tetapi juga biaya kepemilikan jangka panjang, terutama soal pajak dan perawatan.",
    sideImages: ["/assets/images/blog/post-30.jpg", "/assets/images/blog/post-31.jpg"],
    sections: [
      {
        heading: "1. Dua Pilihan, Satu Bodi",
        body: "Dari luar, Seri 5 bensin dan i5 hampir tidak bisa dibedakan selain dari detail kecil pada gril dan pelek. Kabin keduanya identik, termasuk layar melengkung besar dan sistem hiburan terbaru. Jadi pilihan ini murni soal mesin, bukan soal tampilan atau kenyamanan.",
      },
      {
        heading: "2. Tenaga dan Karakter Berkendara",
        body: "Versi bensin mengandalkan mesin empat silinder turbo dengan tenaga yang lebih dari cukup untuk ukuran mobil ini, dan suara mesinnya tetap terdengar halus. i5 mengandalkan motor listrik dengan tenaga penuh sejak putaran nol, sehingga terasa lebih responsif di dalam kota dan jauh lebih senyap di kecepatan rendah.",
      },
      {
        heading: "3. Jarak Tempuh dan Pengisian",
        body: "Ini pertimbangan paling menentukan. i5 menawarkan jarak tempuh yang cukup untuk pemakaian harian, tetapi menuntut Anda punya akses pengisian di rumah. Tanpa itu, memiliki i5 berarti Anda bergantung pada jaringan pengisian umum yang di luar kota masih jarang dan tidak selalu berfungsi baik.",
      },
      {
        heading: "4. Biaya Kepemilikan",
        body: "Harga beli i5 lebih tinggi sekitar Rp 150 juta, tetapi biaya pengisiannya jauh lebih murah per kilometer dan perawatannya lebih ringan karena tidak ada oli mesin, busi, maupun sabuk yang perlu diganti. Pajaknya juga lebih rendah karena ada insentif untuk kendaraan listrik. Selisih harga itu bisa tertutup dalam beberapa tahun kalau pemakaian Anda tinggi.",
      },
    ],
    conclusion: {
      heading: "Kesimpulan",
      body: "Kalau Anda punya garasi dengan pengisian listrik dan pemakaian harian Anda tinggi, i5 adalah pilihan yang lebih tenang dan lebih murah dijalankan dalam jangka panjang. Kalau Anda sering perjalanan jauh antar kota atau tidak punya tempat mengisi, versi bensin tetap pilihan yang lebih praktis — dan selisih Rp 150 juta itu bisa Anda gunakan untuk hal lain. Keduanya mobil yang sangat baik; yang menentukan adalah kebiasaan Anda, bukan spesifikasinya.",
    },
    tags: ["Ulasan", "Tren"],
    comments: [],
  },
  // id 14: blog-grid-style-1.html's own 9-card grid — 8 of its 9 titles already exactly match existing
  // entries (ids 1/2/3/4/5/6/7/8, confirmed via source read), further validating those as this site's
  // recurring set of "template" articles. Only this one title is genuinely new.
  {
    id: 14,
    slug: "electric-vs-ice-cars",
    title: "Mobil Listrik vs. Mesin Bensin (ICE)",
    category: "TREN",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-24.jpg",
    bannerImage: "/assets/images/blog/post-24.jpg",
    bodyImage: "/assets/images/blog/post-43.jpg",
    intro:
      "Perbandingan mobil listrik dan mobil bermesin bensin sering berhenti pada satu angka: biaya per kilometer. Padahal keputusan ini jauh lebih luas dari itu.",
    quote: {
      text: "“Mobil bensin menghemat waktu Anda. Mobil listrik menghemat uang Anda. Jarang ada yang bisa keduanya.”",
      author: "Admin MARF",
    },
    introContinued:
      "Keduanya sudah cukup matang untuk dipakai sehari-hari, dan keduanya punya kelemahan yang nyata. Memahami di mana masing-masing unggul membuat Anda tidak membeli mobil yang salah untuk kehidupan Anda sendiri.",
    sideImages: ["/assets/images/blog/post-40.jpg", "/assets/images/blog/post-41.jpg"],
    sections: [
      {
        heading: "1. Biaya Menjalankan",
        body: "Ini keunggulan terbesar mobil listrik. Mengisi baterai di rumah jauh lebih murah per kilometer daripada membeli bensin, dan karena komponen bergeraknya jauh lebih sedikit, perawatannya ringan: tidak ada oli mesin, filter, busi, maupun sabuk yang perlu diganti berkala. Mobil bensin menang di harga beli, yang masih lebih rendah untuk kelas yang setara.",
      },
      {
        heading: "2. Waktu dan Cara Mengisi",
        body: "Mobil bensin mengisi penuh dalam lima menit di mana saja. Mobil listrik mengisi berjam-jam di rumah, atau puluhan menit di pengisian cepat. Kalau Anda punya garasi dan mengisi setiap malam, perbedaan ini hampir tidak terasa. Kalau Anda bergantung pada pengisian umum, perbedaan ini akan terasa setiap minggu.",
      },
      {
        heading: "3. Perawatan dan Keandalan",
        body: "Mobil listrik punya jauh lebih sedikit bagian yang bergerak, sehingga lebih sedikit yang bisa rusak. Namun baterainya menua, dan penggantian baterai di luar masa garansi adalah biaya yang besar. Mobil bensin lebih rumit dan menuntut servis rutin, tetapi hampir semua bengkel bisa menanganinya dan suku cadangnya mudah didapat.",
      },
      {
        heading: "4. Perjalanan Jauh",
        body: "Di sini mobil bensin masih menang jauh. Anda bisa melaju tanpa memikirkan tempat pengisian, dan kalau kehabisan bahan bakar, satu jeriken sudah menyelesaikan masalah. Untuk mobil listrik, perjalanan jauh menuntut perencanaan: Anda harus tahu di mana pengisian cepat berada, apakah berfungsi, dan berapa lama Anda akan menunggu.",
      },
    ],
    conclusion: {
      heading: "Kesimpulan",
      body: "Kalau Anda punya tempat mengisi di rumah dan sebagian besar pemakaian Anda dalam kota, mobil listrik akan menghemat uang Anda setiap bulan dan terasa lebih nyaman. Kalau Anda sering menempuh perjalanan jauh, tinggal di daerah dengan jaringan pengisian terbatas, atau hanya punya satu mobil untuk segala keperluan, mesin bensin masih pilihan yang lebih tenang. Keduanya bukan pilihan yang salah — yang salah adalah memilih berdasarkan tren, bukan berdasarkan kebiasaan Anda sendiri.",
    },
    tags: ["Tren", "Ulasan"],
    comments: [],
  },
];

export type BlogPostWithDetail = BlogPost &
  Required<Pick<BlogPost, "bannerImage" | "bodyImage" | "intro" | "quote" | "introContinued" | "sideImages" | "sections" | "conclusion" | "tags" | "comments">>;

// Jaring pengaman saja — semua artikel sekarang punya badan sendiri, jadi cabang `?? template`
// tidak lagi terpakai dalam praktik. Tetap dipertahankan supaya artikel baru yang ditambahkan
// sebagai kartu tidak menghasilkan halaman kosong.
export function withBlogPostDetailFallback(post: BlogPost): BlogPostWithDetail {
  const template = allBlogPosts[0];
  return {
    ...post,
    bannerImage: post.bannerImage ?? post.cardImage,
    bodyImage: post.bodyImage ?? template.bodyImage!,
    intro: post.intro ?? template.intro!,
    quote: post.quote ?? template.quote!,
    introContinued: post.introContinued ?? template.introContinued!,
    sideImages: post.sideImages ?? template.sideImages!,
    sections: post.sections ?? template.sections!,
    conclusion: post.conclusion ?? template.conclusion!,
    tags: post.tags ?? template.tags!,
    comments: post.comments ?? template.comments!,
  };
}
