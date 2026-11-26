import { getTranslations } from "next-intl/server";
import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";

export default async function Hero() {
    const t = await getTranslations("Hero");
    return (
        <section className="relative min-h-120 flex items-center justify-center">

            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/img/hero-kos.png')",
                }}
            ></div>

            <div className="absolute inset-0 bg-[#064E3B]/80"></div>

            <div className="relative z-10 w-full max-w-4xl px-6 text-center text-white">

                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                    {t("titleA")}
                    <br />
                    {t("titleB")}{" "}
                    <span className="text-accent">
                        KosEase
                    </span>
                </h1>

                <p className="mt-5 font-body text-lg text-white/90">
                    {t("subtitle")}
                </p>

                <div className="mt-8 flex justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
                    >
                        {t("cta")}
                        <IconArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
