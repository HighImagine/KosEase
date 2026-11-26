import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import EmptyStateCard from "@/components/EmptyStateCard";
import StatusPemesananPill, { statusPemesananKey } from "@/components/StatusPemesananPill";
import { Link } from "@/i18n/navigation";
import { formatHarga } from "@/lib/format";
import type { PemilikDashboardData } from "@/lib/db/queries";

function formatTanggal(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale === "en" ? "en-GB" : "id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// Beranda pemilik versi action-first: kerjaan dulu, angka jadi pelengkap.
// Server component — konfirmasi/tolak reservasi tetap di halaman Reservasi Masuk.
export default async function OwnerHome({ data, name }: { data: PemilikDashboardData; name: string }) {
  const t = await getTranslations("PemilikDashboard");
  const tr = await getTranslations("Reservasi");
  const tk = await getTranslations("KelolaKos");
  const to = await getTranslations("OwnerOnboarding");
  const locale = await getLocale();

  if (data.ringkas.length === 0) {
    return (
      <div className="mx-auto max-w-5xl">
        <EmptyStateCard
          badge={to("badge")}
          title={to("title")}
          description={to("desc")}
          ctaLabel={to("cta")}
          ctaHref="/dashboard/pemilik/kos/tambah"
          steps={[
            { title: to("step1Title"), description: to("step1Desc") },
            { title: to("step2Title"), description: to("step2Desc") },
            { title: to("step3Title"), description: to("step3Desc") },
          ]}
        />
      </div>
    );
  }

  const firstName = name.trim().split(/\s+/)[0] || t("fallbackName");
  const pending = data.masuk.filter((p) => p.status === "menunggu");

  const statusParts: string[] = [];
  if (pending.length > 0) statusParts.push(t("statusReservasi", { n: pending.length }));
  if (data.stats.stokTersedia > 0) statusParts.push(t("statusKamar", { n: data.stats.stokTersedia }));
  if (data.stats.tayang > 0) statusParts.push(t("statusKosTayang", { n: data.stats.tayang }));
  if (data.stats.draft > 0) statusParts.push(t("statusDraft", { n: data.stats.draft }));

  const tanpaKamar = data.ringkas.filter((r) => r.kamarTipe === 0).length;
  const tanpaFoto = data.ringkas.filter((r) => !r.adaFoto).length;

  const actions: { key: string; label: string; href?: string }[] = [];
  if (pending.length > 0) {
    actions.push({
      key: "reservasi",
      label: t("actionReservasi", { n: pending.length }),
      href: "/dashboard/pemilik/reservasi",
    });
  }
  if (data.perpanjangan.length > 0) {
    actions.push({
      key: "perpanjangan",
      label: t("actionPerpanjangan", { n: data.perpanjangan.length }),
      href: "/dashboard/pemilik/reservasi",
    });
  }
  if (data.stats.draft > 0) {
    actions.push({
      key: "draft",
      label: t("actionDraft", { n: data.stats.draft }),
      href: "/dashboard/pemilik/kos",
    });
  }
  if (tanpaKamar > 0) {
    actions.push({
      key: "kamar",
      label: t("actionNoKamar", { n: tanpaKamar }),
      href: "/dashboard/pemilik/kamar",
    });
  }
  if (tanpaFoto > 0) {
    actions.push({
      key: "foto",
      label: t("actionNoFoto", { n: tanpaFoto }),
      href: "/dashboard/pemilik/kos",
    });
  }
  if (data.penarikan.length > 0) {
    actions.push({
      key: "penarikan",
      label: t("actionPenarikan", { n: data.penarikan.length }),
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {/* Greeting + status ringkas */}
      <section className="rounded-2xl bg-surface p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-heading text-lg font-bold text-text-primary">
              {t("greeting", { name: firstName })}
            </h2>
            {statusParts.length > 0 && (
              <p className="mt-1 text-xs text-text-secondary">{statusParts.join(" · ")}</p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href="/dashboard/pemilik/kos/tambah"
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              {t("addKos")}
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Reservasi Masuk — pekerjaan utama */}
        <section className="rounded-2xl bg-surface p-6 shadow-sm lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-base font-bold text-text-primary">
                {t("reservasiTitle")}
                {pending.length > 0 && (
                  <span className="ml-2 rounded-full bg-warning px-2 py-0.5 align-middle text-[10px] font-semibold text-white">
                    {t("reservasiBadge", { n: pending.length })}
                  </span>
                )}
              </h2>
              <p className="mt-1 text-xs text-text-secondary">{t("reservasiDesc")}</p>
            </div>
            <Link
              href="/dashboard/pemilik/reservasi"
              className="shrink-0 text-[11px] font-semibold text-primary hover:text-primary-dark"
            >
              {t("viewAll")} →
            </Link>
          </div>

          {pending.length === 0 ? (
            <p className="mt-4 rounded-xl bg-background px-4 py-6 text-center text-xs text-text-secondary">
              {t("reservasiEmpty")}
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {pending.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border px-4 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-text-primary">
                      {p.kos_nama} — {p.kamar_nama}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-text-secondary">
                      {p.nama_pemesan} ·{" "}
                      {t("reservasiMoveIn", {
                        date: formatTanggal(p.tanggal_mulai, locale),
                        n: p.durasi,
                      })}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-bold text-primary">{formatHarga(p.total_harga)}</p>
                    <StatusPemesananPill
                      status={p.status}
                      label={tr(statusPemesananKey[p.status])}
                      size="sm"
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Perlu Tindakan */}
        <section className="rounded-2xl bg-surface p-6 shadow-sm">
          <h2 className="font-heading text-base font-bold text-text-primary">{t("actionsTitle")}</h2>
          <p className="mt-1 text-xs text-text-secondary">{t("actionsDesc")}</p>

          {actions.length === 0 ? (
            <p className="mt-4 rounded-xl bg-success/10 px-4 py-3 text-xs font-medium text-success">
              {t("actionsClean")}
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {actions.map((a) => {
                const content = (
                  <>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                    <span className="flex-1">{a.label}</span>
                    {a.href && <span className="text-text-secondary">›</span>}
                  </>
                );
                return (
                  <li key={a.key}>
                    {a.href ? (
                      <Link
                        href={a.href}
                        className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-[11px] font-medium text-text-primary transition-colors hover:border-primary"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-[11px] font-medium text-text-secondary">
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Kos Saya + meter stok */}
      <section className="rounded-2xl bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-base font-bold text-text-primary">{t("kosTitle")}</h2>
          <Link
            href="/dashboard/pemilik/kos"
            className="shrink-0 text-[11px] font-semibold text-primary hover:text-primary-dark"
          >
            {t("viewAll")} →
          </Link>
        </div>

        <div className="mt-4 space-y-2">
          {data.ringkas.slice(0, 5).map((r) => {
            const needsRooms = r.kamarTipe === 0;
            const penuh = r.totalStok > 0 && r.sisaStok === 0;
            const pct = r.totalStok > 0 ? Math.round((r.sisaStok / r.totalStok) * 100) : 0;
            return (
              <div
                key={r.kos.id_kos}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3"
              >
                <Image
                  src={r.cover ?? "/img/kos-placeholder.png"}
                  alt={r.kos.nama}
                  width={56}
                  height={56}
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-text-primary">{r.kos.nama}</p>
                  <p className="mt-0.5 truncate text-[10px] text-text-secondary">
                    {r.kos.lokasi} · {r.kos.tipe}
                  </p>
                </div>

                <div className="w-full sm:w-44">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] text-text-secondary">
                      {r.totalStok > 0
                        ? t("kosStock", { sisa: r.sisaStok, total: r.totalStok })
                        : t("kosNoRooms")}
                    </p>
                    {penuh && (
                      <span className="shrink-0 rounded-full bg-warning px-2 py-0.5 text-[10px] font-semibold text-white">
                        {t("kosFull")}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div className="h-1.5 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white ${
                    r.kos.status_publikasi === "tayang" ? "bg-success" : "bg-warning"
                  }`}
                >
                  {r.kos.status_publikasi === "tayang" ? tk("tayang") : tk("draft")}
                </span>

                <Link
                  href={
                    needsRooms
                      ? "/dashboard/pemilik/kamar"
                      : `/dashboard/pemilik/kos/${r.kos.id_kos}`
                  }
                  className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  {needsRooms ? t("kosComplete") : t("kosManage")}
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
