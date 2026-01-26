"use client";

import { useFontSizeContext, FontSize } from "@/context/FontSizeContext";

export type { FontSize };

export function useFontSize() {
  return useFontSizeContext();
}
