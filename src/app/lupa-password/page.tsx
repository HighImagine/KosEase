import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function LupaPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <NavbarWrapper />
      <section className="flex flex-1 justify-center px-6 py-8">
        <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-sm">
          <h1 className="font-heading text-xl font-bold text-text-primary">Lupa Kata Sandi</h1>
          <p className="mt-1 text-xs text-text-secondary">Masukkan email Anda, kami akan kirim link reset.</p>
          <ForgotPasswordForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}

