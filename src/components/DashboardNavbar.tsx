import { createClient } from "@/lib/supabase/server";
import { getNotificationBellSummary } from "@/lib/db/notification-bell";
import type { NotificationBellSummary } from "@/lib/db/notification-bell";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationBell from "./NotificationBell";

type DashboardNavbarProps = {
    title: string;
};

export default async function DashboardNavbar({ title }: DashboardNavbarProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let notification: NotificationBellSummary | null = null;
    if (user) {
        const { data: profileData } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .limit(1);
        const role = (profileData?.[0] as { role?: string } | undefined)?.role ?? null;
        notification = await getNotificationBellSummary(role, user.id);
    }

    return (
        <nav className="sticky top-0 z-40 h-17 border-b border-border bg-surface">
            <div className="flex h-full items-center justify-between px-6">
                <h1 className="font-heading text-sm font-bold text-text-primary">
                    {title}
                </h1>
                <div className="flex items-center gap-2">
                    {notification && <NotificationBell summary={notification} />}
                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    );
}
