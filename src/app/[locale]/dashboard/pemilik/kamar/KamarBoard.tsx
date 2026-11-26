"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatHarga } from "@/lib/format";
import type { KamarMilik } from "@/lib/db/queries";
import type { Kos } from "@/lib/db/types";
import KamarFormModal from "./KamarFormModal";
import DeleteKamarDialog from "./DeleteKamarDialog";
import StokStepper from "./StokStepper";

type KamarGroup = { kos: Kos; kamar: KamarMilik[] };

type ModalState =
  | { mode: "create"; kosId?: string }
  | { mode: "edit"; kamar: KamarMilik }
  | null;

type Props = {
  groups: KamarGroup[];
  kosList: Kos[];
};

export default function KamarBoard({ groups, kosList }: Props) {
  const t = useTranslations("KamarList");
  const tm = useTranslations("KamarManager");
  const tc = useTranslations("Common");
  const [modal, setModal] = useState<ModalState>(null);
  const [deleting, setDeleting] = useState<KamarMilik | null>(null);
  const closeModal = useCallback(() => setModal(null), []);
  const closeDelete = useCallback(() => setDeleting(null), []);
  const totalRooms = groups.reduce((sum, g) => sum + g.kamar.length, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-base font-bold text-text-primary">
          {t("filteredHeading", { n: totalRooms })}
        </h3>
        <button
          type="button"
          onClick={() => setModal({ mode: "create" })}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark"
        >
          {t("addKamar")}
        </button>
      </div>

      {groups.map(({ kos, kamar }) => {
        const totalStok = kamar.reduce((sum, k) => sum + k.stok, 0);
        return (
          <section key={kos.id_kos} className="rounded-2xl bg-surface p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-heading text-base font-bold text-text-primary">{kos.nama}</h4>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white ${
                      kos.status_publikasi === "tayang" ? "bg-success" : "bg-warning"
                    }`}
                  >
                    {kos.status_publikasi === "tayang" ? t("statusTayang") : t("statusDraft")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-text-secondary">
                  {kos.lokasi} · {kos.tipe} · {t("groupMeta", { tipe: kamar.length, stok: totalStok })}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/dashboard/pemilik/kos/${kos.id_kos}`}
                  className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary"
                >
                  {t("manageKos")}
                </Link>
                <button
                  type="button"
                  onClick={() => setModal({ mode: "create", kosId: kos.id_kos })}
                  className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary-dark"
                >
                  {t("addKamar")}
                </button>
              </div>
            </div>

            {kamar.length === 0 ? (
              <p className="mt-4 rounded-lg border border-dashed border-border px-4 py-5 text-center text-xs text-text-secondary">
                {t("emptyGroup")}
              </p>
            ) : (
              <div className="divide-y divide-border">
                {kamar.map((k) => (
                  <div key={k.id} className="flex flex-wrap items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text-primary">{k.nama}</p>
                      <p className="mt-0.5 text-[11px] text-text-secondary">
                        {k.ukuran ?? "-"} · {formatHarga(k.harga)}
                        {tc("perMonthShort")}
                      </p>
                    </div>

                    <StokStepper kosId={k.kos_id} kamarId={k.id} stok={k.stok} />

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white ${
                        k.stok > 0 ? "bg-success" : "bg-error"
                      }`}
                    >
                      {k.stok > 0 ? t("available") : t("unavailable")}
                    </span>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => setModal({ mode: "edit", kamar: k })}
                        className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary"
                      >
                        {tm("edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(k)}
                        className="rounded-lg bg-error/10 px-3 py-1.5 text-[10px] font-semibold text-error hover:bg-error hover:text-white"
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}

      {modal && (
        <KamarFormModal
          kosList={kosList}
          kamar={modal.mode === "edit" ? modal.kamar : null}
          defaultKosId={modal.mode === "create" ? modal.kosId : undefined}
          onClose={closeModal}
        />
      )}

      {deleting && <DeleteKamarDialog kamar={deleting} onClose={closeDelete} />}
    </div>
  );
}
