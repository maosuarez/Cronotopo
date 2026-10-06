import type { Coordinates } from "@/domain/types";

/** "29.98° N · 31.13° E" */
export function formatCoordinates({ lat, lon }: Coordinates): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "O";
  return `${Math.abs(lat).toFixed(2)}° ${ns} · ${Math.abs(lon).toFixed(2)}° ${ew}`;
}

/** Spoken form with Spanish decimal comma. */
export function spokenCoordinates({ lat, lon }: Coordinates): string {
  const ns = lat >= 0 ? "norte" : "sur";
  const ew = lon >= 0 ? "este" : "oeste";
  const n = (v: number) => Math.abs(v).toFixed(2).replace(".", ",");
  return `${n(lat)} grados ${ns}, ${n(lon)} grados ${ew}`;
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
