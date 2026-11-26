// Katalog aturan kos. Satu sumber kebenaran untuk form pemilik (checkbox)
// dan tampilan publik (icon). Key disimpan di kolom kos.aturan (text[]).
import {
  IconBabyCarriage,
  IconBed,
  IconClock24,
  IconHeartHandshake,
  IconMoon,
  IconPaw,
  IconPawOff,
  IconSmoking,
  IconSmokingNo,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";
import type { AturanKos } from "@/lib/db/types";

export type AturanItem = {
  key: AturanKos;
  labelKey: string; // key di namespace i18n "AturanKos"
  icon: TablerIcon;
  conflictsWith?: AturanKos;
};

export const ATURAN_LIST: AturanItem[] = [
  { key: "belum_menikah", labelKey: "belum_menikah", icon: IconUserCheck },
  { key: "pasutri", labelKey: "pasutri", icon: IconHeartHandshake },
  { key: "boleh_anak", labelKey: "boleh_anak", icon: IconBabyCarriage },
  { key: "bawa_tamu", labelKey: "bawa_tamu", icon: IconUsers },
  { key: "tamu_menginap", labelKey: "tamu_menginap", icon: IconBed },
  {
    key: "merokok",
    labelKey: "merokok",
    icon: IconSmoking,
    conflictsWith: "dilarang_merokok",
  },
  {
    key: "dilarang_merokok",
    labelKey: "dilarang_merokok",
    icon: IconSmokingNo,
    conflictsWith: "merokok",
  },
  {
    key: "boleh_hewan",
    labelKey: "boleh_hewan",
    icon: IconPaw,
    conflictsWith: "dilarang_hewan",
  },
  {
    key: "dilarang_hewan",
    labelKey: "dilarang_hewan",
    icon: IconPawOff,
    conflictsWith: "boleh_hewan",
  },
  { key: "akses_24_jam", labelKey: "akses_24_jam", icon: IconClock24 },
  { key: "jam_malam_tamu", labelKey: "jam_malam_tamu", icon: IconMoon },
];

export const ATURAN_KEYS = ATURAN_LIST.map((item) => item.key);

export const MAKS_PENGHUNI_MIN = 1;
export const MAKS_PENGHUNI_MAX = 20;

export function isAturanKos(value: string): value is AturanKos {
  return (ATURAN_KEYS as string[]).includes(value);
}
