"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { IconLayoutDashboard, IconHome, IconBuildingStore, IconBed, IconCalendarEvent } from "@tabler/icons-react";
import type { ComponentType } from "react";
import LogoutButton from "./LogoutButton";

type Props = {
    userName?: string | null;
    userAvatar?: string | null;
    userEmail?: string | null;
    reservasiCount?: number;
};

type MenuItem = {
    href: string;
    label: string;
    icon: ComponentType<{ size?: number | string; stroke?: number | string }>;
    exact: boolean;
    badge?: number;
};

export default function PemilikSidebar({ userName, userAvatar, userEmail, reservasiCount = 0 }: Props) {
    const pathname = usePathname();
    const t = useTranslations("SidebarOwner");
    const displayName = userName ?? t("fallbackName");

    const MENU: MenuItem[] = [
        { href: "/dashboard", label: t("home"), icon: IconLayoutDashboard, exact: true },
        { href: "/dashboard/pemilik/reservasi", label: t("reservasi"), icon: IconCalendarEvent, exact: false, badge: reservasiCount },
        { href: "/dashboard/pemilik/kos", label: t("kos"), icon: IconBuildingStore, exact: false },
        { href: "/dashboard/pemilik/kamar", label: t("kamar"), icon: IconBed, exact: false },
    ];

    return (
        <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface">
            <div className="px-6 py-6">
                <Link href="/dashboard" title="Beranda pemilik">
                    <Image
                        src="/img/logo.png"
                        alt="KosEase"
                        width={100}
                        height={30}
                    />
                </Link>
            </div>

            <nav className="flex flex-col gap-1 px-4">
                {MENU.map(({ href, label, icon: Icon, exact, badge = 0 }) => {
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
                            {badge > 0 && (
                                <span className="ml-auto rounded-full bg-warning px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                    {badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <Link
                    href="/"
                    title={t("website")}
                    className={`mx-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${pathname === "/" ? "bg-primary-light font-semibold text-primary" : "text-text-primary hover:bg-primary-light hover:text-primary"}`}
                >
                    <IconHome size={18} stroke={2} />
                    {t("website")}
                </Link>
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
