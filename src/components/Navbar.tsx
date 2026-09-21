"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import LogoutButton from "./LogoutButton";

type NavbarProps = {
  user: { email: string; displayName: string | null; role: string | null } | null;
  avatarUrl?: string | null;
};

export default function Navbar({ user, avatarUrl }: NavbarProps) {
  const pathname = usePathname();
  const role = user?.role ?? "penyewa";
  const [render, setRender] = useState(false);
  const [show, setShow] = useState(false);

  const openDropdown = useCallback(() => {
    setRender(true);
    requestAnimationFrame(() => setShow(true));
  }, []);

  const closeDropdown = useCallback(() => {
    setShow(false);
    setTimeout(() => setRender(false), 75);
  }, []);

  const toggleDropdown = useCallback(() => {
    if (render && show) closeDropdown(); else openDropdown();
  }, [render, show, openDropdown, closeDropdown]);

  return (
    <nav className="relative z-50 h-17 bg-white border-b border-gray-200">
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
            <button onClick={toggleDropdown} className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 hover:bg-background">
              <Image src={avatarUrl ?? "/img/avatar-default.png"} alt={user.displayName ?? "User"} width={28} height={28} className="rounded-full object-cover" />
               <span className="hidden sm:block text-xs font-semibold text-text-primary">{user.displayName}</span>
            </button>
            {render && (
              <div
                className={`absolute right-0 top-12 z-50 w-48 origin-top-right rounded-xl border border-border bg-surface p-2 shadow-lg transition-all duration-75 ease-out ${show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1"}`}
              >
                <Link href="/dashboard" onClick={closeDropdown} className="block rounded-lg px-3 py-2 text-xs hover:bg-background">Dashboard</Link>
                {role === "pemilik" && <Link href="/dashboard/pemilik" onClick={closeDropdown} className="block rounded-lg px-3 py-2 text-xs hover:bg-background">Kelola Kos</Link>}
                <LogoutButton variant="dropdown" />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
