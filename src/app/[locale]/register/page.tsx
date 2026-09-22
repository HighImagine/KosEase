import Image from "next/image";
import RegisterForm from "./RegisterForm";
import { IconArrowLeft } from '@tabler/icons-react';
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function RegisterPage() {
    const t = await getTranslations("Register");
    const tc = await getTranslations("Common");
    return (
        <main className="flex min-h-screen flex-col bg-background">
            <div className="mx-auto flex w-full max-w-md items-center justify-between px-6 pt-6">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/img/logo.png" alt="KosEase" width={90} height={28} />
                </Link>
                <Link href="/" className="flex items-center gap-2 text-xs text-text-secondary hover:text-primary">
                    <IconArrowLeft size={16} stroke={2} color="#4b5563" />
                    {tc("backHome")}
                </Link>
            </div>

            <section className=" flex flex-1 justify-center px-6 py-8">
                <div className="self-start w-full max-w-md rounded-2xl bg-surface p-6 shadow-sm">

                    {/* Logo & Judul */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                        </div>

                        <h1 className="mt-2 font-heading text-xl font-bold text-text-primary">
                            {t("title")}
                        </h1>

                        <p className="mt-1 text-xs text-text-secondary">
                            {t("subtitle")}
                        </p>
                    </div>

                    <RegisterForm />

                    {/* Login */}
                    <p className="mt-3 text-center text-[10px] text-text-secondary">
                        {t("hasAccount")}{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-primary hover:text-primary-dark"
                        >
                            {t("loginHere")}
                        </Link>
                    </p>

                </div>
            </section>

            <p className="pb-6 text-center text-[10px] text-text-secondary">{tc("copyright")}</p>
        </main>
    );
}
