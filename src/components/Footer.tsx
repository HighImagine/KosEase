import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default async function Footer() {
    const t = await getTranslations("Footer");
    const tc = await getTranslations("Common");
    return (
        <footer className="bg-surface px-10 py-8">
            <div className="mx-auto grid max-w-7xl grid-cols-4 gap-8">

                <div>
                    <div>
                        <Image
                            src="/img/logo.png"
                            alt="KosEase"
                            width={100}
                            height={30}
                        />
                    </div>

                    <p className="mt-3 max-w-sm text-xs leading-5 text-text-secondary">
                        {t("tagline")}
                    </p>
                </div>

                <div>
                    <h4 className="font-heading text-sm font-bold text-text-primary">
                        {t("brandCol")}
                    </h4>

                    <div className="mt-3 space-y-2 text-xs text-text-secondary hover:text-primary">
                        <Link href="/tentang">{t("about")}
                        </Link>
                    </div>
                </div>

                <div>
                    <h4 className="font-heading text-sm font-bold text-text-primary">
                        {t("services")}
                    </h4>

                    <div className="mt-3 flex flex-col gap-2 text-xs text-text-secondary">
                        <Link href="/cari-kos"
                            className="hover:text-primary"
                        >{t("search")}</Link>
                        <Link href="/"
                            className="hover:text-primary"
                        >{t("terms")}</Link>
                        <Link href="/"
                            className="hover:text-primary"
                        >{t("privacy")}</Link>
                    </div>
                </div>

                <div>
                    <h4 className="font-heading text-sm font-bold text-text-primary">
                        {t("contact")}
                    </h4>

                    <div className="mt-3 space-y-2 text-xs text-text-secondary">
                        <p>support@kosease.com</p>
                        <p>+62 812-3456-7890</p>
                    </div>
                </div>

            </div>

            <div className="mx-auto mt-8 flex max-w-7xl items-center justify-between border-t border-border pt-4">
                <p className="text-[10px] text-text-secondary">
                    {tc("copyright")}
                </p>

                <LanguageSwitcher />
            </div>
        </footer>
    );
}
