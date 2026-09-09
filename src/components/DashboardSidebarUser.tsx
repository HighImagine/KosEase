import Image from "next/image";
import Link from "next/link";

export default function DashboardSidebarUser() {
    return (
        <aside className="flex h-screen w-60 flex-col border-r border-border bg-surface">
            <div className="px-6 py-6">
                <Image
                    src="/img/logo.png"
                    alt="KosEase"
                    width={100}
                    height={30}
                />
            </div>

            <nav className="flex flex-col gap-1 px-4">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-text-primary hover:bg-primary-light hover:text-primary"
                >
                    <Image
                        src="/img/home.svg"
                        alt=""
                        width={16}
                        height={16}
                    />
                    Beranda
                </Link>

                <Link
                    href="/cari-kos"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-text-primary hover:bg-primary-light hover:text-primary"
                >
                    <Image
                        src="/img/search.svg"
                        alt=""
                        width={16}
                        height={16}
                    />
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

                <button
                    type="button"
                    className="mt-3 flex items-center gap-3 px-3 py-2.5 text-xs text-error hover:opacity-80"
                >
                    <Image
                        src="/img/log-out.svg"
                        alt=""
                        width={16}
                        height={16}
                    />
                    Keluar
                </button>
            </div>
        </aside>
    );
}