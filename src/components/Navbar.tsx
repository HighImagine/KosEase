"use client";
import Image from "next/image";
import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LogoutButton from "./LogoutButton";
import NotificationBell from "./NotificationBell";
import LanguageSwitcher from "./LanguageSwitcher";
import type { NotificationBellSummary } from "@/lib/db/notification-bell";

type NavbarProps = {
  user: { email: string; displayName: string | null; role: string | null } | null;
  avatarUrl?: string | null;
  notification?: NotificationBellSummary | null;
};

export default function Navbar({ user, avatarUrl, notification }: NavbarProps) {
  const pathname = usePathname();
  const t = useTranslations("Navbar");
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
    <nav className="sticky top-0 z-50 h-17 bg-white border-b border-gray-200">
      <div className="max-w-7xl h-full mx-auto flex items-center justify-between px-6">
        <Link href="/"><Image src="/img/logo.png" alt="KosEase" width={120} height={36} /></Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/beranda" className={pathname === "/beranda" ? "text-primary font-semibold" : "text-text-primary hover:text-primary"}>{t("home")}</Link>
          <Link href="/" className={pathname === "/" ? "text-primary font-semibold" : "text-text-primary hover:text-primary"}>{t("search")}</Link>
          <Link href="/tentang" className={pathname === "/tentang" ? "text-primary font-semibold" : "text-text-primary hover:text-primary"}>{t("about")}</Link>
        </div>

        {!user ? (
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <Link href="/login" className="text-primary font-semibold">{t("login")}</Link>
            <Link href="/register" className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark">{t("register")}</Link>
          </div>
        ) : (
          <div className="relative flex items-center gap-3">
            {notification && <NotificationBell summary={notification} onOpen={closeDropdown} />}
            <LanguageSwitcher />
            <button onClick={toggleDropdown} className="flex items-center gap-2 rounded-full px-0 hover:bg-background">
              <Image src={avatarUrl ?? "/img/avatar-default.png"} alt={user.displayName ?? "User"} width={28} height={28} className="rounded-full object-cover" />
               <span className="hidden sm:block text-xs font-semibold text-text-primary">{user.displayName}</span>
            </button>
            {render && (
              <div
                className={`absolute right-0 top-12 z-50 w-48 origin-top-right rounded-xl border border-border bg-surface p-2 shadow-lg transition-all duration-75 ease-out ${show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1"}`}
              >
                <Link href="/dashboard" onClick={closeDropdown} className="block rounded-lg px-3 py-2 text-xs hover:bg-background">{t("dashboard")}</Link>
                {(role === "pemilik" || role === "pemilik_kos") && <Link href="/dashboard/pemilik" onClick={closeDropdown} className="block rounded-lg px-3 py-2 text-xs hover:bg-background">{t("manageKos")}</Link>}
                {role === "admin" && <Link href="/dashboard/admin/pengajuan" onClick={closeDropdown} className="block rounded-lg px-3 py-2 text-xs hover:bg-background">{t("pengajuan")}</Link>}
                <LogoutButton variant="dropdown" onClose={closeDropdown} />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
