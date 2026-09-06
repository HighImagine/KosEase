import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="h-17 bg-white border-b border-gray-200">
      <div className="max-w-300 h-full mx-auto flex items-center justify-between px-6">

        {/* Logo */}
        <div className="text-2xl font-bold">
          <span className="text-[#0F9D91]">Kos</span>
          <span className="text-[#FF6B1A]">Ease</span>
        </div>

        {/* Menu */}
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="text-[#0F9D91] font-semibold"
          >
            Beranda
          </a>

          <a
            href="/cari-kos"
            className="text-[#263342] hover:text-[#0F9D91]"
          >
            Cari Kos
          </a>

          <a
            href="/tentang"
            className="text-[#263342] hover:text-[#0F9D91]"
          >
            Tentang Kami
          </a>
        </div>

        {/* Authentication */}
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-[#0F9D91] font-semibold"
          >
            Masuk
          </Link>

          <Link
            href="/register"
            className="bg-[#0F9D91] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#087F75]"
          >
            Daftar
          </Link>
        </div>

      </div>
    </nav>
  );
}