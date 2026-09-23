import Image from "next/image";
import LoginForm from "./LoginForm";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LoginPage() {
    const t = await getTranslations("Login");
    const tc = await getTranslations("Common");
    return (
        <main className="flex min-h-screen flex-col bg-background">
            <div className="mx-auto flex w-full max-w-md items-center justify-between px-6 pt-6">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/img/logo.png" alt="KosEase" width={90} height={28} />
                </Link>
                <Link href="/" className="text-xs text-text-secondary hover:text-primary">
                    {tc("backToHome")}
                </Link>
            </div>

            <section className="flex flex-1 justify-center px-6 py-8">
                <div className="w-full max-w-md self-start rounded-2xl bg-surface p-6 shadow-sm">

                    <div className="text-center">
                        <div className="flex justify-center">
                            <Image
                                src="/img/logo.png"
                                alt="KosEase"
                                width={100}
                                height={30}
                            />
                        </div>

                        <h1 className="mt-2 font-heading text-xl font-bold text-text-primary">
                            {t("title")}
                        </h1>

                        <p className="mt-1 text-xs text-text-secondary">
                            {t("subtitle")}
                        </p>
                    </div>

                    <Suspense><LoginForm /></Suspense>

                    <p className="mt-3 text-center text-[10px] text-text-secondary">
                        {t("noAccount")}{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-primary hover:text-primary-dark"
                        >
                            {t("registerNow")}
                        </Link>
                    </p>

                    <p className="mt-2 text-center text-[10px] text-text-secondary">
                        <Link
                            href="/admin"
                            className="hover:text-primary"
                        >
                            {t("adminAlt")} →
                        </Link>
                    </p>

                </div>
            </section>

            <p className="pb-6 text-center text-[10px] text-text-secondary">{tc("copyright")}</p>
        </main>
    );
}
