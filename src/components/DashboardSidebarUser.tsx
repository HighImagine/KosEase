"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconLayoutDashboard, IconSearch } from '@tabler/icons-react';
import { logoutAction } from "@/app/(auth)/actions";



export default function DashboardSidebarUser() {
    const pathname = usePathname()
    return (
        <aside className="flex h-screen w-60 flex-col border-r border-border bg-surface">
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
                    href="/cari-kos"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-text-primary hover:bg-primary-light hover:text-primary"
                >
                    <IconSearch size={16} stroke={2} />
                    Cari Kos
                </Link>

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
                <div className="mb-4 flex items-center gap-3 px-3">
                    <Image
                        src="/img/user.jpg"
                        alt="Ahmad Syafi'i"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                    />

                    <p className="text-xs font-semibold text-text-primary">
                        Ahmad Syafi'i
                    </p>
                </div>

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

                <form action={logoutAction} className="mt-3">
                    <button
                        type="submit"
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-xs text-error hover:opacity-80"
                    >
                        <Image src="/img/log-out.svg" alt="" width={16} height={16} />
                        Keluar
                    </button>
                </form>
            </div>
        </aside>
    );
}