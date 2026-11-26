import Image from "next/image";
import { IconArrowRight, IconBuildingStore } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";

type Step = {
  title: string;
  description: string;
};

type Props = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  badge?: string;
  steps?: Step[];
  illustration?: string;
  variant?: "hero" | "compact";
  className?: string;
};

export default function EmptyStateCard({
  title,
  description,
  ctaLabel,
  ctaHref,
  badge,
  steps,
  illustration = "/img/empty-kos.png",
  variant = "hero",
  className,
}: Props) {
  if (variant === "compact") {
    return (
      <div className={`flex flex-col items-start gap-4 rounded-xl bg-primary-light p-5 sm:flex-row sm:items-center sm:justify-between ${className ?? ""}`}>
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-primary">
            <IconBuildingStore size={20} stroke={1.8} />
          </span>
          <div>
            <p className="font-heading text-sm font-bold text-text-primary">{title}</p>
            <p className="mt-1 max-w-md font-body text-xs leading-relaxed text-text-secondary">{description}</p>
          </div>
        </div>
        <Link
          href={ctaHref}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 font-body text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          {ctaLabel}
          <IconArrowRight size={14} stroke={2} color="#ffffff" />
        </Link>
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-primary-light p-6 sm:p-8 ${className ?? ""}`}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-lg">
          {badge && (
            <span className="inline-block rounded-full bg-surface px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-wide text-primary">
              {badge}
            </span>
          )}
          <h2 className="mt-3 font-heading text-lg font-bold text-text-primary sm:text-xl">{title}</h2>
          <p className="mt-2 font-body text-xs leading-relaxed text-text-secondary sm:text-sm">{description}</p>
          <Link
            href={ctaHref}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-body text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {ctaLabel}
            <IconArrowRight size={16} stroke={2} color="#ffffff" />
          </Link>
        </div>

        <div className="hidden shrink-0 self-center sm:block">
          <Image
            src={illustration}
            alt=""
            width={180}
            height={150}
            className="object-contain"
          />
        </div>
      </div>

      {steps && steps.length > 0 && (
        <ol className="mt-6 grid gap-3 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-lg bg-surface/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary font-body text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="font-body text-xs font-semibold text-text-primary">{step.title}</p>
              </div>
              <p className="mt-1 font-body text-[10px] leading-relaxed text-text-secondary">{step.description}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
