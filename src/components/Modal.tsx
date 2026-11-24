"use client";

type ModalProps = {
    open: boolean;
    message: string;
    onClose: () => void;
};

export default function Modal({ open, message, onClose }: ModalProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Notifikasi"
        >
            <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-sm">
                <h3 className="font-heading text-base font-bold text-text-primary">Notifikasi</h3>
                <p className="mt-2 text-sm text-text-secondary">{message}</p>
                <div className="mt-5 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-primary-dark"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
