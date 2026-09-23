type DashboardNavbarProps = {
    title: string;
};

export default function DashboardNavbar({ title }: DashboardNavbarProps) {
    return (
        <nav className="sticky top-0 z-40 h-17 border-b border-border bg-surface">
            <div className="flex h-full items-center px-6">
                <h1 className="font-heading text-sm font-bold text-text-primary">
                    {title}
                </h1>
            </div>
        </nav>
    );
}
