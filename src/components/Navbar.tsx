"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

type NavbarProps = {
  user: { email: string; displayName: string | null; role: string | null } | null;
};

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const role = user?.role ?? "penyewa";

  return (
    <nav className="relative z-50 h-[68px] bg-white border-b border-gray-200">
      <div className="max-w-7xl h-full mx-auto flex items-center justify-between px-6">
        <Link href="/"><Image src="/img/logo.png" alt="KosEase" width={120} height={36} /></Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={pathname === "/" ? "text-primary font-semibold" : "text-text-primary hover:text-primary"}>Beranda</Link>
          <Link href="/cari-kos" className={pathname === "/cari-kos" ? "text-primary font-semibold" : "text-text-primary hover:text-primary"}>Cari Kos</Link>
          <Link href="/tentang" className={pathname === "/tentang" ? "text-primary font-semibold" : "text-text-primary hover:text-primary"}>Tentang Kami</Link>
        </div>

        {!user ? (
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-primary font-semibold">Masuk</Link>
            <Link href="/register" className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark">Daftar</Link>
          </div>
        ) : (
          <div className="relative flex items-center gap-3">
            <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 hover:bg-background">
              <Image src="/img/user.jpg" alt={user.displayName ?? "User"} width={28} height={28} className="rounded-full object-cover" />
              <span className="hidden sm:block text-xs font-semibold text-text-primary">{user.displayName}</span>
            </button>
            {open && (
              <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-border bg-surface p-2 shadow-lg">
                <Link href="/dashboard" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-xs hover:bg-background">Dashboard</Link>
                {role === "pemilik" && <Link href="/dashboard/pemilik" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-xs hover:bg-background">Kelola Kos</Link>}
                <LogoutButton variant="dropdown" />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
