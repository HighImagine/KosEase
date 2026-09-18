import Image from "next/image";
import { IconBell } from '@tabler/icons-react';

type DashboardNavbarProps = {
    title: string;
    userName: string;
    userRole: string;
    userImage: string;
};

export default function DashboardNavbar({
    title,
    userName,
    userRole,
    userImage,
}: DashboardNavbarProps) {
    return (
        <nav className="h-17 border-b border-border bg-surface">
            <div className="flex h-full items-center justify-between px-6">
                {/* Page Title */}
                <h1 className="font-heading text-sm font-bold text-text-primary">
                    {title}
                </h1>

                {/* User */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:cursor-pointer"
                    >
                        <IconBell size={16} stroke={2} color="#4b5563" />
                    </button>

                    {/* Profile */}
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <p className="font-body text-xs font-semibold text-text-primary">
                                {userName}
                            </p>
                            <p className="font-body text-[10px] text-text-secondary">
                                {userRole}
                            </p>
                        </div>

                        <Image
                            src={userImage}
                            alt={userName}
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}