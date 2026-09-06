export default function Hero() {
  return (
    <section className="relative min-h-120 flex items-center justify-center">
      
      {/* Background */}
      <div className="absolute inset-0 bg-teal-800">
        {/* Nanti gambar background kos ditaruh di sini */}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-6 text-center text-white">
        
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Temukan Kos Nyaman Tanpa
          <br />
          Ribet dengan{" "}
          <span className="text-orange-500">
            KosEase
          </span>
        </h1>

        <p className="mt-5 text-lg text-white/90">
          Pencarian kos terpercaya, proses cepat, harga transparan,
          dan sesuai dengan kebutuhanmu.
        </p>

        {/* Search Box */}
        <div className="mt-10 rounded-2xl bg-white p-5 text-left shadow-lg">
          
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Cari kos di kota mana? (e.g. Jakarta, Yogyakarta, Malang)"
              className="flex-1 rounded-lg bg-gray-100 px-4 py-3 text-gray-700 outline-none"
            />

            <button className="rounded-lg bg-teal-600 px-7 py-3 font-semibold text-white hover:bg-teal-700">
              Cari
            </button>
          </div>

          {/* Filter */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="rounded-lg border px-4 py-2 text-sm text-gray-600">
              Lokasi
            </button>

            <button className="rounded-lg border px-4 py-2 text-sm text-gray-600">
              Rentang Harga
            </button>

            <button className="rounded-lg border px-4 py-2 text-sm text-gray-600">
              Tipe Kos
            </button>

            <button className="rounded-lg border px-4 py-2 text-sm text-gray-600">
              Fasilitas
            </button>

            <button className="rounded-lg border px-4 py-2 text-sm text-gray-600">
              Kamar Tersedia
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}