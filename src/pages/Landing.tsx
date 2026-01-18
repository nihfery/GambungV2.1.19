export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-500 to-green-700 text-white">
      {/* ================= NAVBAR ================= */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="h-9 w-9 rounded-lg bg-white text-green-600 grid place-items-center">
            G
          </div>
          Gamboeng Traceability
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#" className="opacity-90 hover:opacity-100">Publikasi</a>
          <a href="#" className="opacity-90 hover:opacity-100">Pelatihan</a>
          <a href="#" className="opacity-90 hover:opacity-100">Artikel</a>
          <a href="#" className="opacity-90 hover:opacity-100">Tentang</a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="px-4 py-2 rounded-full text-sm border border-white/40 hover:bg-white/10"
          >
            Masuk
          </a>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Gali Potensi Rantai Produksi Teh <br />
            <span className="text-green-100">
              dengan Gamboeng Traceability
            </span>
          </h1>

          <p className="text-green-100 max-w-xl mb-8">
            Sistem traceability berbasis blockchain untuk memastikan
            transparansi, kualitas, dan keaslian proses produksi teh
            dari hulu hingga hilir.
          </p>

          {/* INPUT */}
          <div className="bg-white rounded-full p-1 flex items-center max-w-md shadow-lg">
            <input
              placeholder="Masukkan email kamu"
              className="flex-1 px-4 py-3 text-sm text-gray-700 outline-none rounded-full"
            />
            <button className="px-5 py-3 rounded-full bg-green-600 hover:bg-green-700 text-sm font-medium">
              Mulai Sekarang
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex justify-center relative">
          <div className="bg-white/20 backdrop-blur rounded-3xl p-8 w-80">
            <h4 className="font-semibold mb-2">Lot Produksi</h4>
            <p className="text-sm text-green-100 mb-4">
              Lacak asal-usul daun teh dari petani hingga produk akhir.
            </p>

            <div className="space-y-3">
              <div className="bg-white/30 rounded-xl p-3 text-sm">
                Plucking → Withering
              </div>
              <div className="bg-white/30 rounded-xl p-3 text-sm">
                Transfer Ownership
              </div>
              <div className="bg-white/30 rounded-xl p-3 text-sm">
                Audit & Trace
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INFO SECTION ================= */}
      <section className="bg-white text-gray-800 rounded-t-[40px] mt-24">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Berbasis Blockchain
            </h3>
            <p className="text-sm text-gray-600">
              Setiap proses tercatat permanen dan tidak dapat dimanipulasi.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Multi Actor & Role
            </h3>
            <p className="text-sm text-gray-600">
              Petani, pabrik, auditor, dan owner memiliki peran masing-masing.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Transparansi Produksi
            </h3>
            <p className="text-sm text-gray-600">
              Memudahkan monitoring kualitas dan alur produksi secara real-time.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white text-gray-500 text-sm text-center py-6 border-t">
        © 2026 Gamboeng Traceability x SmartEV. All rights reserved.
      </footer>
    </div>
  );
}
