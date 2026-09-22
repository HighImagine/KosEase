import Link from "next/link";
import Image from "next/image";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminPage() {
    return (
        <main className="flex min-h-screen flex-col bg-background">
            <div className="mx-auto flex w-full max-w-md items-center justify-between px-6 pt-6">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/img/logo.png" alt="KosEase" width={90} height={28} />
                </Link>
                <Link href="/login" className="text-xs text-text-secondary hover:text-primary">
                    ← Login Sebagai User
                </Link>
            </div>

            <section className="flex flex-1 justify-center px-6 py-8">
                <div className="w-full max-w-md self-start rounded-2xl bg-surface p-6 shadow-sm">
                    <div className="text-center">
                        <div className="flex justify-center">
                            <Image src="/img/logo.png" alt="KosEase" width={100} height={30} />
                        </div>
                        <h1 className="mt-2 font-heading text-xl font-bold text-text-primary">
                            Masuk sebagai Admin
                        </h1>
                        <p className="mt-1 text-xs text-text-secondary">
                            Akses dashboard admin untuk memverifikasi pengajuan.
                        </p>
                    </div>

                    <AdminLoginForm />

                    <p className="mt-3 text-center text-[10px] text-text-secondary">
                        Hanya untuk admin. Jika Anda pengguna biasa,{" "}
                        <Link href="/login" className="font-semibold text-primary hover:text-primary-dark">
                            login di sini
                        </Link>.
                    </p>
                </div>
            </section>

            <p className="pb-6 text-center text-[10px] text-text-secondary">© 2026 KosEase. Seluruh hak cipta dilindungi undang-undang.</p>
        </main>
    );
}
