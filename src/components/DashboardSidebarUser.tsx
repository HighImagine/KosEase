"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconLayoutDashboard, IconSearch, IconHome, IconBuildingStore, IconShieldCheck } from '@tabler/icons-react';
import LogoutButton from "./LogoutButton";



type Props = {
    userName?: string | null;
    userAvatar?: string | null;
    userEmail?: string | null;
    userRole?: string | null;
};

export default function DashboardSidebarUser({ userName, userAvatar, userEmail, userRole }: Props) {
    const pathname = usePathname()
    const displayName = userName ?? "Tamu";
    const hasAvatar = !!userAvatar;
    const role = (userRole ?? "").toLowerCase();
    const isPemilik = role === "pemilik" || role === "pemilik_kos";
    const isAdmin = role === "admin";
    const linkCls = (active: boolean) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs ${active ? "bg-primary-light font-semibold text-primary" : "text-text-primary hover:bg-primary-light hover:text-primary"}`;
    return (
        <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface">
            <div className="px-6 py-6">
                <Link href="/" title="Kembali ke homepage">
                    <Image
                        src="/img/logo.png"
                        alt="KosEase"
                        width={100}
                        height={30}
                    />
                </Link>
            </div>

            <nav className="flex flex-col gap-1 px-4">

                <Link
                    href="/dashboard"
                    title="Halaman utama dashboard"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs ${pathname === "/dashboard" ? "bg-primary-light font-semibold text-primary" : "text-text-primary hover:bg-primary-light hover:text-primary"}`}
                >
                    <IconLayoutDashboard size={16} stroke={2} />
                    Beranda
                </Link>

                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-text-primary hover:bg-primary-light hover:text-primary"
                >
                    <IconHome size={16} stroke={2} />
                    Lihat Website
                </Link>

                <Link
                    href="/cari-kos"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-text-primary hover:bg-primary-light hover:text-primary"
                >
                    <IconSearch size={16} stroke={2} />
                    Cari Kos
                </Link>

                {(isPemilik || isAdmin) && (
                    <Link
                        href="/dashboard/pemilik/kos"
                        title="Kelola kos milik Anda"
                        className={linkCls(pathname.startsWith("/dashboard/pemilik/kos"))}
                    >
                        <IconBuildingStore size={16} stroke={2} />
                        Kelola Kos
                    </Link>
                )}

                {isAdmin && (
                    <Link
                        href="/dashboard/admin/kos"
                        title="Moderasi semua kos"
                        className={linkCls(pathname.startsWith("/dashboard/admin/kos"))}
                    >
                        <IconShieldCheck size={16} stroke={2} />
                        Moderasi Kos
                    </Link>
                )}

                <Link
                    href="/dashboard/reservasi"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-text-primary hover:bg-primary-light hover:text-primary"
                >
                    <Image
                        src="/img/calendar.svg"
                        alt=""
                        width={16}
                        height={16}
                    />
                    Reservasi Saya
                </Link>

                <Link
                    href="/dashboard/status"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-text-primary hover:bg-primary-light hover:text-primary"
                >
                    <Image
                        src="/img/clock.svg"
                        alt=""
                        width={16}
                        height={16}
                    />
                    Status
                </Link>

                <Link
                    href="/dashboard/riwayat"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-text-primary hover:bg-primary-light hover:text-primary"
                >
                    <Image
                        src="/img/bed.svg"
                        alt=""
                        width={16}
                        height={16}
                    />
                    Riwayat
                </Link>
            </nav>

            {/* Bottom */}
            <div className="mt-auto px-4 pb-6">
                <Link href="/dashboard/profil" className="flex items-center gap-3 px-3">
                    <div className="mb-4 flex items-center gap-3">
                        {hasAvatar ? (
                            <Image src={userAvatar} alt={displayName} width={32} height={32} className="rounded-full object-cover" />
                        ) : (
                            <Image src="/img/avatar-default.png" alt={displayName} width={32} height={32} className="rounded-full object-cover" />
                        )}
                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-text-primary">
                                {displayName}
                            </p>
                            {userEmail && (
                                <p className="truncate text-[10px] text-text-secondary">{userEmail}</p>
                            )}
                            {userRole && (
                                <p className="truncate text-[10px] font-semibold text-primary">{userRole}</p>
                            )}
                        </div>
                    </div>
                </Link>

                <Link
                    href="/dashboard/pengajuan-pemilik"
                    className="flex items-center gap-3 rounded-lg bg-primary-light px-3 py-2.5 text-xs font-semibold text-primary"
                >
                    <Image
                        src="/img/briefcase.svg"
                        alt=""
                        width={16}
                        height={16}
                    />
                    Ajukan Jadi Pemilik Kos
                </Link>

                <div className="mt-3">
                    <LogoutButton variant="sidebar" />
                </div>
            </div>
        </aside>
    );
}