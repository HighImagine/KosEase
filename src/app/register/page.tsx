import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import RegisterForm from "./RegisterForm";

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

                    <RegisterForm />

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