import Link from "next/link";
import Image from "next/image";
export default function Navbar() {
  return (
    <nav className="h-17 bg-white border-b border-gray-200">
      <div className="max-w-300 h-full mx-auto flex items-center justify-between px-6">

        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/img/logo.png"
            alt="KosEase"
            width={120}
            height={36}
          />
        </div>

        {/* Menu */}
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="text-primary font-semibold"
          >
            Beranda
          </a>

          <a
            href="/cari-kos"
            className="text-text-primary hover:text-primary"
          >
            Cari Kos
          </a>

          <a
            href="/tentang"
            className="text-text-primary hover:text-primary"
          >
            Tentang Kami
          </a>
        </div>

        {/* Authentication */}
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-primary font-semibold"
          >
            Masuk
          </Link>

          <Link
            href="/register"
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark"
          >
            Daftar
          </Link>
        </div>

      </div>
    </nav>
  );
}