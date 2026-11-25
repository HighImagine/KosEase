"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { IconBell } from "@tabler/icons-react";
import {
  getNotificationBellDataAction,
  markAllNotifikasiReadAction,
  markNotifikasiReadAction,
} from "@/lib/actions/notifikasi";
import type {
  NotificationBellData,
  NotificationBellItem,
  NotificationBellSummary,
} from "@/lib/db/notification-bell";

type NotificationBellProps = {
  summary: NotificationBellSummary;
  onOpen?: () => void;
};

export default function NotificationBell({ summary, onOpen }: NotificationBellProps) {
  const t = useTranslations("Navbar");
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingRef = useRef(false);

  const [render, setRender] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState<NotificationBellData | null>(null);
  const [loading, setLoading] = useState(false);

  // Ambil daftar lengkap hanya saat dropdown dibuka (lazy).
  const load = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const next = await getNotificationBellDataAction();
      if (next) setData(next);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  const openDropdown = useCallback(() => {
    onOpen?.();
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setRender(true);
    requestAnimationFrame(() => setShow(true));
    void load();
  }, [onOpen, load]);

  const closeDropdown = useCallback(() => {
    setShow(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setRender(false), 100);
  }, []);

  const toggleDropdown = useCallback(() => {
    if (render && show) closeDropdown();
    else openDropdown();
  }, [render, show, openDropdown, closeDropdown]);

  useEffect(() => {
    if (!render) return;
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDropdown();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [render, closeDropdown]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const markOne = (item: NotificationBellItem) => {
    if (!item.notifId || !item.unread) return;
    setData((prev) =>
      prev && prev.mode === "user"
        ? {
            ...prev,
            count: Math.max(0, prev.count - 1),
            items: prev.items.map((row) => (row.key === item.key ? { ...row, unread: false } : row)),
          }
        : prev,
    );
    void markNotifikasiReadAction(item.notifId).then((res) => {
      if (res?.error) void load();
    });
  };

  const markAll = () => {
    setData((prev) =>
      prev && prev.mode === "user"
        ? { ...prev, count: 0, items: prev.items.map((row) => ({ ...row, unread: false })) }
        : prev,
    );
    void markAllNotifikasiReadAction().then((res) => {
      if (res?.error) void load();
    });
  };

  const unreadCount = data?.count ?? summary.count;
  const mode = data?.mode ?? summary.mode;
  const isUnread = (item: NotificationBellItem) => Boolean(item.unread);

  const hasAny = !data
    ? false
    : data.mode === "admin"
      ? data.groups.some((group) => group.items.length > 0)
      : data.items.length > 0;

  const renderItem = (item: NotificationBellItem) => {
    const title =
      item.title ??
      (item.kind === "penarikan" ? t("adminWithdrawRequest") : t("adminNewOwnerRequest"));
    const body = item.body ?? (item.kind === "pengajuan" ? t("adminNewOwnerRequest") : null);

    const content = (
      <div className="flex gap-2">
        <span
          className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${isUnread(item) ? "bg-primary" : "bg-transparent"}`}
        />
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-text-primary">{title}</p>
          {body && <p className="mt-0.5 line-clamp-2 text-[10px] text-text-secondary">{body}</p>}
        </div>
      </div>
    );

    const rowClass = "block w-full rounded-lg px-2 py-2 text-left transition-colors hover:bg-background";

    if (!item.href) {
      return (
        <button
          key={item.key}
          type="button"
          onClick={() => {
            closeDropdown();
            markOne(item);
          }}
          className={rowClass}
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        key={item.key}
        href={item.href}
        onClick={() => {
          closeDropdown();
          markOne(item);
        }}
        className={rowClass}
      >
        {content}
      </Link>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        aria-label={t("notifications")}
        aria-haspopup="menu"
        aria-expanded={show}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-background"
      >
        <IconBell size={18} stroke={2} color="#4b5563" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {render && (
        <div
          role="menu"
          className={`absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] origin-top-right rounded-xl border border-border bg-surface p-2 shadow-lg transition-all duration-100 ease-out ${show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1"}`}
        >
          <div className="flex items-center justify-between gap-2 px-2 py-1.5">
            <p className="font-heading text-xs font-bold text-text-primary">{t("notifications")}</p>
            {mode === "user" && unreadCount > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="shrink-0 text-[10px] font-semibold text-primary hover:underline"
              >
                {t("markAllRead")}
              </button>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading && !data ? (
              <p className="px-2 py-6 text-center text-[10px] text-text-secondary">{t("loading")}</p>
            ) : (
              <>
                {!hasAny && (
                  <p className="px-2 py-6 text-center text-[10px] text-text-secondary">
                    {t("noNotifications")}
                  </p>
                )}

                {data?.mode === "user" && data.items.map(renderItem)}

                {data?.mode === "admin" &&
                  data.groups.map((group) =>
                    group.items.length === 0 ? null : (
                      <div key={group.key} className="mt-1">
                        <div className="flex items-center justify-between px-2 py-1">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-text-secondary">
                            {group.key === "pengajuan" ? t("groupPengajuan") : t("groupPenarikan")}
                          </p>
                          <Link
                            href={group.href}
                            onClick={closeDropdown}
                            className="text-[10px] font-semibold text-primary hover:underline"
                          >
                            {t("viewAll")}
                          </Link>
                        </div>
                        {group.items.map(renderItem)}
                      </div>
                    ),
                  )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
