// Sumber kebenaran ketersediaan kamar: stok > 0. Kolom `ketersediaan`
// ditulis dari nilai ini saat kamar disimpan (stok > 0 ? "Tersedia" : "Penuh"),
// tetapi keputusan UI/validasi selalu dihitung dari `stok` aktual.
// Tipe longgar agar cocok dengan baris DB (Kamar) dan data fallback (TipeKamar).
export type KamarKetersediaan = {
    stok?: number | null;
    ketersediaan?: string | null;
};

export function isKamarTersedia(kamar: KamarKetersediaan | null | undefined): boolean {
    if (!kamar) return false;
    return (kamar.stok ?? 0) > 0;
}

export function isKamarPenuh(kamar: KamarKetersediaan | null | undefined): boolean {
    return !!kamar && (kamar.stok ?? 0) <= 0;
}

export function hasAvailableKamar(kamarList: KamarKetersediaan[]): boolean {
    return kamarList.some((k) => isKamarTersedia(k));
}

// Kos penuh = punya kamar, tapi semua kamar miliknya stok <= 0.
// Kos tanpa kamar tidak dianggap "penuh", melainkan "belum punya kamar".
export function isKosPenuh(kamarList: KamarKetersediaan[]): boolean {
    return kamarList.length > 0 && kamarList.every((k) => isKamarPenuh(k));
}
