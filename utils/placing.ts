import { Coord } from "@/types/ship";

export const isValidPlacement = (coords: Coord[]): boolean => {
  if (coords.length <= 1) return true;

  const xs = coords.map((c) => c.x);
  const ys = coords.map((c) => c.y);

  const allSameX = xs.every((x) => x === xs[0]);
  const allSameY = ys.every((y) => y === ys[0]);

  // They need to be in the same row or column
  if (!allSameX && !allSameY) return false;

  // and consecutive
  const sorted = allSameX ? ys.sort((a, b) => a - b) : xs.sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) return false;
  }

  return true;
};
