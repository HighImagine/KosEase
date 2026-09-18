"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { IconLogout } from "@tabler/icons-react";

type Props = {
  variant?: "sidebar" | "dropdown";
};

export default function LogoutButton({ variant = "sidebar" }: Props) {
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut(); // clear sb-* cookies via @supabase/ssr
      router.replace("/login");
      router.refresh(); // re-validate NavbarWrapper / SidebarWrapper (user -> null)
    });
  };

  if (!confirm) {
    if (variant === "dropdown") {
      return (
        <button
          type="button"
          onClick={() => setConfirm(true)}
          className="w-full text-left rounded-lg px-3 py-2 text-xs text-error hover:bg-background"
        >
          Keluar
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => setConfirm(true)}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-xs text-error hover:opacity-80"
      >
        <IconLogout size={16} stroke={2} />
        Keluar
      </button>
    );
  }

  // confirm state
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-xs font-semibold text-text-primary">Yakin ingin keluar?</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={handleLogout}
          className="flex-1 rounded-lg bg-error px-3 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "..." : "Ya, Keluar"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setConfirm(false)}
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-primary hover:bg-background"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
