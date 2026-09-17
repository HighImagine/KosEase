import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KosCard from "@/components/KosCard";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { kosList } from "@/data/kos";

export default function CariKosPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <section className="mx-auto max-w-7xl px-10 py-10">
                {/* Header */}
                <div>
                    <h1 className="font-heading text-2xl font-bold text-text-primary">
                        Cari Kos
                    </h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        Temukan kos yang sesuai dengan kebutuhanmu.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="mt-6 rounded-2xl bg-surface p-5 shadow-sm">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama atau lokasi..."
                            className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-primary"
                        />

                        <button
                            type="button"
                            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                        >
                            Cari
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <select className="rounded-lg border border-border bg-background px-4 py-2.5 text-xs text-text-secondary outline-none focus:border-primary">
                            <option>Lokasi</option>
                            <option>Yogyakarta</option>
                            <option>Bandung</option>
                            <option>Malang</option>
                        </select>

                        <select className="rounded-lg border border-border bg-background px-4 py-2.5 text-xs text-text-secondary outline-none focus:border-primary">
                            <option>Rentang Harga</option>
                            <option>&lt; Rp800.000</option>
                            <option>Rp800.000 - Rp1.000.000</option>
                            <option>&gt; Rp1.000.000</option>
                        </select>

                        <select className="rounded-lg border border-border bg-background px-4 py-2.5 text-xs text-text-secondary outline-none focus:border-primary">
                            <option>Tipe Kos</option>
                            <option>Campur</option>
                            <option>Laki-laki</option>
                            <option>Perempuan</option>
                        </select>

                        <select className="rounded-lg border border-border bg-background px-4 py-2.5 text-xs text-text-secondary outline-none focus:border-primary">
                            <option>Fasilitas</option>
                            <option>WiFi</option>
                            <option>Kamar Mandi Dalam</option>
                            <option>Parkir</option>
                        </select>
                    </div>
                </div>

                {/* Daftar Kos */}
                <div className="mt-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-heading text-xl font-bold text-text-primary">
                                Semua Kos
                            </h2>
                            <p className="mt-1 text-xs text-text-secondary">
                                Menampilkan kos yang tersedia.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {kosList.map((kos) => (
                            <KosCard
                                key={kos.id}
                                id={kos.id}
                                nama={kos.nama}
                                lokasi={kos.lokasi}
                                harga={kos.harga}
                                gambar={kos.gambar}
                                tipe={kos.tipe}
                                status={kos.status}
                            />
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-10 flex items-center justify-center gap-3">
                    {/* Kembali */}
                    <Link
                        href="/cari-kos"
                        className="flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-text-primary transition-colors hover:text-primary"
                    >
                        <IconArrowLeft size={16} stroke={2} color="#0f9d91" />
                        Kembali
                    </Link>

                    {/* Halaman 1 */}
                    <Link
                        href="/cari-kos?page=1"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-base font-semibold text-white"
                    >
                        1
                    </Link>

                    {/* Halaman 2 */}
                    <Link
                        href="/cari-kos?page=2"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-base text-text-secondary transition-colors hover:text-primary"
                    >
                        2
                    </Link>

                    {/* Halaman 3 */}
                    <Link
                        href="/cari-kos?page=3"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-base text-text-secondary transition-colors hover:text-primary"
                    >
                        3
                    </Link>

                    {/* Halaman 4 */}
                    <Link
                        href="/cari-kos?page=4"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-base text-text-secondary transition-colors hover:text-primary"
                    >
                        4
                    </Link>

                    {/* Ellipsis, kalau sudah jalan database bisa dibikin seperti ini jga*/}
                    <span className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-text-secondary">
                        ...
                    </span>

                    {/* Halaman 10 */}
                    <Link
                        href="/cari-kos?page=10"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-base text-text-secondary transition-colors hover:text-primary"
                    >
                        10
                    </Link>

                    <Link
                        href="/cari-kos?page=2"
                        className="flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-text-primary transition-colors hover:text-primary"
                    >
                        Lanjut
                        <IconArrowRight size={16} stroke={2} color="#0f9d91" />
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}