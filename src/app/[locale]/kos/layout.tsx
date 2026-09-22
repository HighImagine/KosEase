import NavbarWrapper from "@/components/NavbarWrapper";

export default function KosLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavbarWrapper />
            {children}
        </>
    );
}
