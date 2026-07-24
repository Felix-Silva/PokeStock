export type StoreColor = "red" | "blue" | "sky" | "yellow" | "green" | "gray";

export const STORE_COLORS: { value: StoreColor; label: string; hex: string }[] = [
  { value: "red", label: "Red", hex: "#ef4444" },
  { value: "blue", label: "Blue", hex: "#3b82f6" },
  { value: "sky", label: "Light Blue", hex: "#38bdf8" },
  { value: "yellow", label: "Yellow", hex: "#facc15" },
  { value: "green", label: "Green", hex: "#22c55e" },
  { value: "gray", label: "Light Grey", hex: "#d4d4d8" },
];

export function storeColorHex(color: StoreColor): string {
  return STORE_COLORS.find((c) => c.value === color)?.hex ?? "#d4d4d8";
}

// Translucent tint of a store's color, for use as a card/row background
// (same idea as the score-row tint on the store detail page).
export function storeColorBackground(color: StoreColor, alpha = 0.15): string {
  const hex = storeColorHex(color);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export type Store = {
  id: string;
  name: string;
  address: string;
  color: StoreColor;
  created_at: string;
};
