import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-surface px-10 py-8">
            <div className="mx-auto grid max-w-7xl grid-cols-4 gap-8">

                <div>
                    <h3 className="font-heading text-lg font-bold text-primary">
                        KosEase
                    </h3>

                    <p className="mt-3 max-w-sm text-xs leading-5 text-text-secondary">
                        Platform pencarian kos modern di Indonesia yang
                        mengutamakan kemudahan, kenyamanan, dan transparansi
                        harga untuk para pelajar dan pekerja muda.
                    </p>
                </div>

                <div>
                    <h4 className="font-heading text-sm font-bold text-text-primary">
                        KosEase
                    </h4>

                    <div className="mt-3 space-y-2 text-xs text-text-secondary hover:text-primary">
                        <p>Tentang Kami</p>
                    </div>
                </div>

                <div>
                    <h4 className="font-heading text-sm font-bold text-text-primary">
                        Layanan
                    </h4>

                    <div className="mt-3 flex flex-col gap-2 text-xs text-text-secondary">
                        <Link href="/cari-kos"
                            className="hover:text-primary"
                        >Cari Kos</Link>
                        <Link href="/"
                            className="hover:text-primary"
                        >Syarat & Ketentuan</Link>
                        <Link href="/"
                            className="hover:text-primary"
                        >Kebijakan Privasi</Link>
                    </div>
                </div>

                <div>
                    <h4 className="font-heading text-sm font-bold text-text-primary">
                        Hubungi Kami
                    </h4>

                    <div className="mt-3 space-y-2 text-xs text-text-secondary">
                        <p>support@kosease.com</p>
                        <p>+62 812-3456-7890</p>
                    </div>
                </div>

            </div>

            <div className="mx-auto mt-8 flex max-w-7xl items-center justify-between border-t border-border pt-4">
                <p className="text-[10px] text-text-secondary">
                    © 2026 KosEase. Seluruh hak cipta dilindungi undang-undang.
                </p>

                <div className="flex gap-4 text-xs text-text-secondary">
                    <span>◎</span>
                    <span>f</span>
                    <span>𝕏</span>
                </div>
            </div>
        </footer>
    );
}