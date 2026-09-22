import Link from "next/link";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebarUserWrapper from "@/components/DashboardSidebarUserWrapper";
import { getFasilitasMaster, getOwnedKosDetail } from "@/lib/db/queries";
import { updateKosAction } from "@/app/kos/actions";
import KosForm from "../KosForm";
import { DeleteKosButton, PublikasiToggle } from "../KosListActions";
import KamarManager from "./KamarManager";
import GaleriManager from "./GaleriManager";
import FasilitasPicker from "./FasilitasPicker";

type PageProps = {
  params: Promise<{ id: string }>;
};

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-surface p-6 shadow-sm">
      <h2 className="font-heading text-base font-bold text-text-primary">{title}</h2>
      <p className="mt-1 text-xs text-text-secondary">{desc}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function KelolaKosDetailPage({ params }: PageProps) {
  const { id } = await params;
  const detail = await getOwnedKosDetail(id);

  if (!detail) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebarUserWrapper />
        <div className="flex flex-1 flex-col">
          <DashboardNavbar title="Kelola Kos" />
          <main className="flex-1 p-6">
            <div className="rounded-xl bg-surface p-8 text-center">
              <p className="text-sm text-text-secondary">Kos tidak ditemukan atau Anda tidak berhak mengelolanya.</p>
              <Link href="/dashboard/pemilik/kos" className="mt-3 inline-block text-xs font-semibold text-primary hover:text-primary-dark">← Kembali ke daftar</Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { kos, kamar, galeri, fasilitas } = detail;
  const master = await getFasilitasMaster();

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebarUserWrapper />

      <div className="flex flex-1 flex-col">
        <DashboardNavbar title={`Kelola: ${kos.nama}`} />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-2xl space-y-4">
            <Link href="/dashboard/pemilik/kos" className="text-xs font-semibold text-primary hover:text-primary-dark">← Kembali ke daftar</Link>

            <Section title="Data Kos" desc="Informasi dasar yang tampil di pencarian dan halaman detail.">
              <KosForm kos={kos} action={updateKosAction} />
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                <span className="text-[11px] text-text-secondary">
                  Status: <strong className="text-text-primary">{kos.status_publikasi === "tayang" ? "Tayang" : "Draft"}</strong>
                </span>
                <PublikasiToggle kosId={kos.id_kos} status={kos.status_publikasi} />
                <DeleteKosButton kosId={kos.id_kos} />
              </div>
            </Section>

            <Section title="Tipe Kamar" desc="Harga termurah kos otomatis mengikuti kamar termurah. Stok 0 = Penuh.">
              <KamarManager kosId={kos.id_kos} kamar={kamar} />
            </Section>

            <Section title="Galeri Foto" desc="Foto pertama menjadi sampul kos di pencarian.">
              <GaleriManager kosId={kos.id_kos} galeri={galeri} />
            </Section>

            <Section title="Fasilitas" desc="Pilih fasilitas yang tersedia di kos ini.">
              <FasilitasPicker kosId={kos.id_kos} master={master} selected={fasilitas} />
            </Section>
          </div>
        </main>
      </div>
    </div>
  );
}
