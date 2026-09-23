"use client";
import { useEffect, useRef, type RefObject } from "react";

type FormState = { error?: string; success?: string } | null | undefined;

// Gulir halus ke banner pesan (sukses/error) setiap action selesai.
// Dipakai semua form kelola agar pesan "berhasil disimpan" terlihat
// tanpa user harus scroll manual. Aman dari aturan lint (tanpa setState).
export function useScrollToMessage(state: FormState, ref: RefObject<HTMLElement | null>) {
  const prev = useRef<FormState>(null);
  useEffect(() => {
    if (state && (state.error || state.success) && state !== prev.current) {
      prev.current = state;
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state, ref]);
}
