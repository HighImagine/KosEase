export default function Hero() {
    return (
        <section className="relative min-h-120 flex items-center justify-center">

            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/img/hero-kos.png')",
                }}
            ></div>

            <div className="absolute inset-0 bg-[#064E3B]/80"></div>

            <div className="relative z-10 w-full max-w-4xl px-6 text-center text-white">

                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                    Temukan Kos Nyaman Tanpa
                    <br />
                    Ribet dengan{" "}
                    <span className="text-accent">
                        KosEase
                    </span>
                </h1>

                <p className="mt-5 font-body text-lg text-white/90">
                    Pencarian kos terpercaya, proses cepat, harga transparan,
                    dan sesuai dengan kebutuhanmu.
                </p>

                <div className="mt-10 rounded-2xl bg-surface p-5 text-left shadow-lg">

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            type="text"
                            placeholder="Cari kos di kota mana? (e.g. Jakarta, Yogyakarta, Malang)"
                            className="flex-1 rounded-lg bg-background px-4 py-3 text-text-primary outline-none"
                        />

                        <button className="rounded-lg bg-primary px-7 py-3 font-semibold text-white hover:bg-primary-dark">
                            Cari
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">

                        <button className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-primary-light">
                            Lokasi
                        </button>

                        <button className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-primary-light">
                            Rentang Harga
                        </button>

                        <button className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-primary-light">
                            Tipe Kos
                        </button>

                        <button className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-primary-light">
                            Fasilitas
                        </button>

                        <button className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-primary-light">
                            Kamar Tersedia
                        </button>

                    </div>

                </div>
            </div>
        </section>
    );
}