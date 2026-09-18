import Link from "next/link";
import Image from "next/image";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function LupaPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-md items-center justify-between px-6 pt-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/img/logo.png" alt="KosEase" width={90} height={28} />
        </Link>
        <Link href="/" className="text-xs text-text-secondary hover:text-primary">
          ← Kembali ke Beranda
        </Link>
      </div>
      <section className="flex flex-1 justify-center px-6 py-8">
        <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-sm">
          <h1 className="font-heading text-xl font-bold text-text-primary">Lupa Kata Sandi</h1>
          <p className="mt-1 text-xs text-text-secondary">Masukkan email Anda, kami akan kirim link reset.</p>
          <ForgotPasswordForm />
        </div>
      </section>
      <p className="pb-6 text-center text-[10px] text-text-secondary">© 2026 KosEase. Seluruh hak cipta dilindungi undang-undang.</p>
    </main>
  );
}

