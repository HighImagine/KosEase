import type { StatusPemesanan } from "@/lib/db/queries";

// Kunci terjemahan label status (namespace "Reservasi") agar pemanggil tinggal
// memakai t(statusPemesananKey[status]).
export const statusPemesananKey: Record<StatusPemesanan, string> = {
  menunggu: "statusMenunggu",
  dikonfirmasi: "statusDikonfirmasi",
  ditolak: "statusDitolak",
  dibatalkan: "statusDibatalkan",
};

const styleByStatus: Record<StatusPemesanan, string> = {
  menunggu: "bg-warning text-white",
  dikonfirmasi: "bg-success text-white",
  ditolak: "bg-error text-white",
  dibatalkan: "bg-gray-300 text-gray-600",
};

type Props = {
  status: StatusPemesanan;
  label: string;
  size?: "sm" | "md";
  className?: string;
};

// Pill status pesanan bersama (dashboard pemilik, reservasi pemilik & penyewa).
// Label tetap dikirim dari server component agar terjemahan tidak butuh client JS.
export default function StatusPemesananPill({ status, label, size = "md", className }: Props) {
  const sizeClass = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  return (
    <span
      className={`inline-block shrink-0 rounded-full text-[10px] font-semibold ${sizeClass} ${styleByStatus[status]} ${className ?? ""}`}
    >
      {label}
    </span>
  );
}
