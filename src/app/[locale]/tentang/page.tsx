import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function TentangPage() {
  const t = await getTranslations("Tentang");

  const values = [
    { title: t("value1Title"), desc: t("value1Desc") },
    { title: t("value2Title"), desc: t("value2Desc") },
    { title: t("value3Title"), desc: t("value3Desc") },
  ];
  const steps = [
    { n: "1", title: t("step1Title"), desc: t("step1Desc") },
    { n: "2", title: t("step2Title"), desc: t("step2Desc") },
    { n: "3", title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <main className="min-h-screen bg-background">
      <NavbarWrapper />

      {/* Hero strip */}
      <section className="bg-primary-light px-6 py-14 text-center">
        <h1 className="font-heading text-3xl font-bold text-text-primary">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-2xl font-body text-sm leading-relaxed text-text-secondary">
          {t("tagline")}
        </p>
      </section>

      {/* Nilai */}
      <section className="mx-auto grid max-w-5xl gap-4 px-6 py-10 sm:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="rounded-2xl bg-surface p-6 shadow-sm">
            <h2 className="font-heading text-base font-bold text-primary">{v.title}</h2>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">{v.desc}</p>
          </div>
        ))}
      </section>

      {/* Cara kerja */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <h2 className="font-heading text-xl font-bold text-text-primary">{t("howTitle")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl bg-surface p-6 shadow-sm">
              <p className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-white">
                {s.n}
              </p>
              <h3 className="mt-3 font-heading text-sm font-bold text-text-primary">{s.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-14 text-center">
        <h2 className="font-heading text-xl font-bold text-text-primary">{t("ctaTitle")}</h2>
        <Link
          href="/cari-kos"
          className="mt-4 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          {t("ctaButton")}
        </Link>
        <p className="mt-3 text-[11px] text-text-secondary">{t("contactHint")}</p>
      </section>

      <Footer />
    </main>
  );
}
