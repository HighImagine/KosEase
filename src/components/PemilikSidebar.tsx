"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconLayoutDashboard, IconHome, IconBuildingStore, IconBed } from "@tabler/icons-react";
import LogoutButton from "./LogoutButton";

type Props = {
    userName?: string | null;
    userAvatar?: string | null;
    userEmail?: string | null;
};

const MENU = [
    { href: "/dashboard", label: "Beranda", icon: IconLayoutDashboard, exact: true },
    { href: "/", label: "Kembali ke Website", icon: IconHome, exact: true },
    { href: "/dashboard/pemilik/kos", label: "Kelola Kos", icon: IconBuildingStore, exact: false },
    { href: "/dashboard/pemilik/kamar", label: "Kelola Kamar", icon: IconBed, exact: false },
];

export default function PemilikSidebar({ userName, userAvatar, userEmail }: Props) {
    const pathname = usePathname();
    const displayName = userName ?? "Pemilik";

    return (
        <aside className="flex h-screen w-60 flex-col border-r border-border bg-surface">
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

            {/* Bottom */}
            <div className="mt-auto px-4 pb-6">
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
