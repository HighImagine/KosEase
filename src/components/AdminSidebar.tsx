"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { IconLayoutDashboard, IconHome, IconUsers, IconShieldCheck, IconFileCheck } from "@tabler/icons-react";
import LogoutButton from "./LogoutButton";
import SidebarLanguageSwitcher from "./SidebarLanguageSwitcher";

type Props = {
    userName?: string | null;
    userAvatar?: string | null;
    userEmail?: string | null;
};

export default function AdminSidebar({ userName, userAvatar, userEmail }: Props) {
    const pathname = usePathname();
    const t = useTranslations("SidebarAdmin");
    const displayName = userName ?? t("fallbackName");

    const MENU = [
        { href: "/dashboard/admin", label: t("home"), icon: IconLayoutDashboard, exact: true },
        { href: "/", label: t("website"), icon: IconHome, exact: true },
        { href: "/dashboard/admin/pengguna", label: t("users"), icon: IconUsers, exact: false },
        { href: "/dashboard/admin/pengajuan", label: t("verifyOwner"), icon: IconShieldCheck, exact: false },
        { href: "/dashboard/admin/kos", label: t("verifyPub"), icon: IconFileCheck, exact: false },
    ];

    return (
        <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface">
            <div className="px-6 py-6">
                <Link href="/dashboard/admin" title="Beranda admin">
                    <Image
                        src="/img/logo.png"
                        alt="KosEase"
                        width={100}
                        height={30}
                    />
                </Link>
            </div>

            <nav className="flex flex-col gap-1 px-4">
                {MENU.map(({ href, label, icon: Icon, exact }) => {
                    const active = exact ? pathname === href : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            title={label}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${active ? "bg-primary-light font-semibold text-primary" : "text-text-primary hover:bg-primary-light hover:text-primary"}`}
                        >
                            <Icon size={18} stroke={2} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <SidebarLanguageSwitcher />
            </div>

            {/* Bottom */}
            <div className="px-4 pb-6">
                <div className="border-t border-border pt-4">
                    <Link href="/dashboard/profil" title="Profil saya" className="flex items-center gap-3 rounded-lg px-3 py-1 hover:bg-primary-light">
                        {userAvatar ? (
                            <Image src={userAvatar} alt={displayName} width={36} height={36} className="rounded-full object-cover" />
                        ) : (
                            <Image src="/img/avatar-default.png" alt={displayName} width={36} height={36} className="rounded-full object-cover" />
                        )}
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-text-primary">
                                {displayName}
                            </p>
                            {userEmail && (
                                <p className="truncate text-[10px] text-text-secondary">{userEmail}</p>
                            )}
                        </div>
                    </Link>

                    <div className="mt-2">
                        <LogoutButton variant="sidebar" />
                    </div>
                </div>
            </div>
        </aside>
    );
}
