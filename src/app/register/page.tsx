import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen flex-col bg-background">
            <Navbar />

            <section className=" flex flex-1 justify-center px-6 py-8">
                <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-sm">

                    {/* Logo & Judul */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex justify-center">
                                <Image
                                    src="/img/logo.png"
                                    alt="KosEase"
                                    width={100}
                                    height={30}
                                />
                            </div>
                        </div>

                        <h1 className="mt-2 font-heading text-xl font-bold text-text-primary">
                            Buat Akun Baru
                        </h1>

                        <p className="mt-1 text-xs text-text-secondary">
                            Gabung sekarang dan mulai cari kos impianmu.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="mt-5 space-y-3">

                        {/* Nama */}
                        <div>
                            <label
                                htmlFor="nama"
                                className="block text-[10px] font-semibold text-text-primary"
                            >
                                Nama Lengkap
                            </label>

                            <input
                                id="nama"
                                type="text"
                                placeholder="Masukkan nama lengkap Anda"
                                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-[10px] font-semibold text-text-primary"
                            >
                                Alamat Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="contoh@mahasiswa.ac.id"
                                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-[10px] font-semibold text-text-primary"
                            >
                                Kata Sandi
                            </label>

                            <input
                                id="password"
                                type="password"
                                placeholder="Minimal 8 karakter"
                                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary"
                            />
                        </div>

                        {/* Konfirmasi Password */}
                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="block text-[10px] font-semibold text-text-primary"
                            >
                                Konfirmasi Kata Sandi
                            </label>

                            <input
                                id="password_confirmation"
                                type="password"
                                placeholder="Ulangi kata sandi Anda"
                                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary"
                            />
                        </div>

                        {/* Syarat */}
                        <div className="flex items-start gap-2 pt-2">
                            <input
                                id="terms"
                                type="checkbox"
                                className="mt-0.5 accent-primary"
                            />

                            <label
                                htmlFor="terms"
                                className="text-[10px] leading-4 text-text-secondary"
                            >
                                Saya setuju dengan{" "}
                                <Link href="/" className="text-primary hover:underline">
                                    Syarat & Ketentuan
                                </Link>{" "}
                                dan{" "}
                                <Link href="/" className="text-primary hover:underline">
                                    Kebijakan Privasi
                                </Link>
                                .
                            </label>
                        </div>

                        <Link
                            href="/"
                            className="mt-3 flex w-full items-center justify-center rounded-md bg-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
                        >
                            Daftar
                        </Link>

                    </form>

                    {/* Login */}
                    <p className="mt-3 text-center text-[10px] text-text-secondary">
                        Sudah punya akun?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-primary hover:text-primary-dark"
                        >
                            Masuk Disini
                        </Link>
                    </p>

                </div>
            </section>

            <Footer />
        </main>
    );
}