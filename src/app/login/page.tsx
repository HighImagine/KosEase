import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col bg-background">
            <Navbar />

            <section className="flex flex-1 justify-center px-6 py-8">
                <div className="w-full max-w-md self-start rounded-2xl bg-surface p-6 shadow-sm">

                    <div className="text-center">
                        <div className="flex justify-center">
                            <Image
                                src="/img/logo.png"
                                alt="KosEase"
                                width={100}
                                height={30}
                            />
                        </div>

                        <h1 className="mt-2 font-heading text-xl font-bold text-text-primary">
                            Masuk ke Akun Anda
                        </h1>

                        <p className="mt-1 text-xs text-text-secondary">
                            Selamat datang kembali! Yuk cari kos idamanmu.
                        </p>
                    </div>

                    <form className="mt-5 space-y-3">

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

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-[10px] font-semibold text-text-primary"
                                >
                                    Kata Sandi
                                </label>

                                <Link
                                    href="/"
                                    className="text-[10px] font-semibold text-primary hover:text-primary-dark"
                                >
                                    Lupa Kata Sandi?
                                </Link>
                            </div>

                            <input
                                id="password"
                                type="password"
                                placeholder="Masukkan kata sandi Anda"
                                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-secondary focus:border-primary"
                            />
                        </div>

                        <Link
                            href="/"
                            className="mt-5 flex w-full items-center justify-center rounded-md bg-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
                        >
                            Masuk
                        </Link>

                    </form>

                    <p className="mt-3 text-center text-[10px] text-text-secondary">
                        Belum punya akun?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-primary hover:text-primary-dark"
                        >
                            Daftar Sekarang!
                        </Link>
                    </p>

                </div>
            </section>

            <Footer />
        </main>
    );
}