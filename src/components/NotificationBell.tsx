"use client";
import { Link } from "@/i18n/navigation";
import { IconBell } from "@tabler/icons-react";

type NotificationBellProps = {
  count: number;
  href?: string;
};

export default function NotificationBell({ count, href = "/dashboard/notifikasi" }: NotificationBellProps) {
  return (
    <Link href={href} className="relative flex items-center justify-center h-10 w-10 rounded-full border border-border hover:bg-background transition-colors">
      <IconBell size={18} stroke={2} color="#4b5563" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
