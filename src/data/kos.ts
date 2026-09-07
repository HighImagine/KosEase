export type TipeKos = "Campur" | "Laki-laki" | "Perempuan";


type Kos = {
    id: number;
    nama: string;
    lokasi: string;
    harga: string;
    gambar: string;
    tipe: TipeKos;
    status: string;
};

export const kosList: Kos[] = [
    {
        id: 1,
        nama: "Kos Melati",
        lokasi: "Yogyakarta",
        harga: "Rp800.000",
        gambar: "/img/kos-placeholder.png",
        tipe: "Perempuan",
        status: "Tersedia",
    },
    {
        id: 2,
        nama: "Kos Mawar",
        lokasi: "Bandung",
        harga: "Rp1.000.000",
        gambar: "/img/kos-placeholder.png",
        tipe: "Campur",
        status: "Tersedia",
    },
    {
        id: 3,
        nama: "Kos Dahlia",
        lokasi: "Malang",
        harga: "Rp750.000",
        gambar: "/img/kos-placeholder.png",
        tipe: "Laki-laki",
        status: "Tersedia 2 Kamar",
    },
];