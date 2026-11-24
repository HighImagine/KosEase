"use client";
import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { IconLogout, IconAlertCircle } from "@tabler/icons-react";

type Props = {
  variant?: "sidebar" | "dropdown";
  onClose?: () => void;
};

export default function LogoutButton({ variant = "sidebar", onClose }: Props) {
  const t = useTranslations("Logout");
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const openConfirm = () => {
    setConfirm(true);
  };

  const handleCancel = () => {
    setConfirm(false);
    onClose?.();
  };

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
          onClick={openConfirm}
          className="w-full text-left rounded-lg px-3 py-2 text-xs text-error hover:bg-background"
        >
          {t("logout")}
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={openConfirm}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-xs text-error hover:opacity-80"
      >
        <IconLogout size={16} stroke={2} />
        {t("logout")}
      </button>
    );
  }

  // confirm state — centered modal popup (tengah halaman + backdrop blur)
  const modal = (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={handleCancel}
      style={{ animation: "modal-overlay-in 0.2s ease-out" }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="flex w-full max-w-sm flex-col items-center justify-center rounded-2xl bg-surface p-6 text-center shadow-xl"
        style={{ animation: "modal-card-in 0.25s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center">
          <IconAlertCircle size={64} stroke={1.5} className="text-error" />
          <p className="mt-3 text-xs font-semibold text-text-primary">{t("confirm")}</p>
        </div>
        <div className="mt-8 flex w-full justify-center gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={handleLogout}
            className="flex-1 rounded-lg bg-error px-3 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            {isPending ? "..." : t("yes")}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleCancel}
            className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-primary hover:bg-background disabled:opacity-50 transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );

  // Portal ke document.body agar positioning fixed mengacu viewport (bukan induk bertransform)
  return createPortal(modal, document.body);
}
