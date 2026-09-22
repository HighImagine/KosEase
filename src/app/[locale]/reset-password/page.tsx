import Image from "next/image";
import ResetPasswordForm from "./ResetPasswordForm";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function ResetPasswordPage() {
  const t = await getTranslations("Reset");
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
        <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-sm">
          <h1 className="font-heading text-xl font-bold text-text-primary">{t("title")}</h1>
          <p className="mt-1 text-xs text-text-secondary">{t("subtitle")}</p>
          <ResetPasswordForm />
        </div>
      </section>
      <p className="pb-6 text-center text-[10px] text-text-secondary">{tc("copyright")}</p>
    </main>
  );
}
