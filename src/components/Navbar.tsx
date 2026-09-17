"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="h-17 bg-white border-b border-gray-200">
      <div className="max-w-300 h-full mx-auto flex items-center justify-between px-6">

        <div className="flex justify-center">
          <Link href="/">
          <Image
            src="/img/logo.png"
            alt="KosEase"
            width={120}
            height={36}
          />
          </Link>
        </div>

        <div className="flex items-center gap-8">
          <Link
            href="/"
            className={
              pathname === "/"
                ? "text-primary font-semibold"
                : "text-text-primary hover:text-primary"
            }
          >
            Beranda
          </Link>

          <Link
            href="/cari-kos"
            className={
              pathname === "/cari-kos"
                ? "text-primary font-semibold"
                : "text-text-primary hover:text-primary"
            }
          >
            Cari Kos
          </Link>

          <Link
            href="/tentang"
            className={
              pathname === "/tentang"
                ? "text-primary font-semibold"
                : "text-text-primary hover:text-primary"
            }
          >
            Tentang Kami
          </Link>
        </div>

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