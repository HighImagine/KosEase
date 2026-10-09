"use client";
import { useState } from "react";
import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createPemesananAction } from "./actions";
import { formatHarga } from "@/lib/format";
import { Link } from "@/i18n/navigation";

type FormState = { error?: string; success?: string } | null;

type Props = {
    kos: {
        id: string;
        nama: string;
        kamar: { id: string; nama: string; ukuran: string | null; harga: number; ketersediaan: string; stok: number; deskripsi: string | null }[];
    } | null;
};

export default function PemesananForm({ kos }: Props) {
    const t = useTranslations("Booking");
    const locale = useLocale();
    const [state, formAction, pending] = useActionState(createPemesananAction as never, null as FormState);
    const availableKamar = kos?.kamar.filter((k) => k.ketersediaan === "Tersedia") ?? [];
    const [selectedKamar, setSelectedKamar] = useState<string>(availableKamar[0]?.nama ?? "");
    const [nama, setNama] = useState("");
    const [wa, setWa] = useState("");
    const [tanggal, setTanggal] = useState("");
    const [durasi, setDurasi] = useState(3);
    const [catatan, setCatatan] = useState("");

    const selected = kos?.kamar.find((k) => k.nama === selectedKamar);
    const hargaPerBulan = selected?.harga ?? 0;
    const total = hargaPerBulan * durasi;

    if (!kos) {
        return (
            <div className="rounded-2xl bg-surface p-8 text-center">
                <p className="text-text-secondary">{t("notFound")}</p>
                <Link href="/cari-kos" className="mt-4 inline-block text-primary font-semibold">{t("backToSearch")}</Link>
            </div>
        );
    }

    return (
        <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <input type="hidden" name="kosId" value={kos.id} />
            <input type="hidden" name="kamarId" value={selected?.id ?? ""} />
            <input type="hidden" name="locale" value={locale} />
            <div className="space-y-4">
                {state?.error && (
                    <p className="rounded-md bg-error/10 px-3 py-2 text-xs text-error">{state.error}</p>
                )}
                <div>
                    <label className="text-sm font-semibold text-text-primary">{t("roomType")}</label>
                    <select value={selectedKamar} onChange={(e) => setSelectedKamar(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary">
                        {kos.kamar.map((k) => (
                            <option key={k.nama} value={k.nama} disabled={k.ketersediaan !== "Tersedia"}>
                                {k.nama}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-semibold text-text-primary">{t("renterName")}</label>
                    <input name="nama" value={nama} onChange={(e) => setNama(e.target.value)} placeholder={t("renterPh")} className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-text-secondary focus:border-primary" />
                </div>
                <div>
                    <label className="text-sm font-semibold text-text-primary">{t("wa")}</label>
                    <input name="wa" value={wa} onChange={(e) => setWa(e.target.value)} placeholder={t("waPh")} className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-text-secondary focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-text-primary">{t("startDate")}</label>
                        <input name="tanggal" type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-text-primary">{t("duration")}</label>
                        <select name="durasi" value={durasi} onChange={(e) => setDurasi(Number(e.target.value))} className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary">
                            <option value={1}>{t("durationOption", { n: 1 })}</option>
                            <option value={3}>{t("durationOption", { n: 3 })}</option>
                            <option value={6}>{t("durationOption", { n: 6 })}</option>
                            <option value={12}>{t("durationOption", { n: 12 })}</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-semibold text-text-primary">{t("notes")}</label>
                    <textarea name="catatan" value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder={t("notesPh")} rows={3} className="mt-1.5 w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-text-secondary focus:border-primary" />
                </div>
            </div>

            <div className="self-start rounded-2xl bg-surface p-6 shadow-sm space-y-4">
                <h3 className="font-heading text-sm font-bold text-text-primary">{t("summary")}</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-text-secondary">{t("sumKos")}</span><span className="font-semibold text-text-primary">{kos.nama}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">{t("sumType")}</span><span className="font-semibold text-text-primary">{selected?.nama ?? t("dash")}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">{t("sumPrice")}</span><span className="font-semibold text-text-primary">{formatHarga(hargaPerBulan)}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">{t("sumLeft")}</span><span className="font-semibold text-text-primary">{selected ? t("sumLeftUnit", { n: selected.stok }) : t("dash")}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">{t("sumDuration")}</span><span className="font-semibold text-text-primary">{t("sumDurationUnit", { n: durasi })}</span></div>
                    <div className="flex justify-between border-t border-border pt-2"><span className="font-bold text-text-primary">{t("sumTotal")}</span><span className="font-bold text-accent">{formatHarga(total)}</span></div>
                </div>
                <div className="rounded-lg bg-blue-50 px-3 py-3 text-xs leading-5 text-blue-700 border border-blue-200">
                    <p>{t("info")}</p>
                </div>
                <button type="submit" disabled={pending} className="mt-2 w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-50">{pending ? t("submitting") : t("submit")}</button>
                <Link href="/" className="mt-2 block w-full rounded-lg border border-border bg-surface py-3 text-center text-xs font-semibold text-text-secondary hover:bg-background">{t("backHome")}</Link>
            </div>
        </form>
    );
}
