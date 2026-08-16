export interface HeartPosition {
  x: number;
  y: number;
}

/** Heart-shaped row pattern (photo count per row, y offset in photo-size units) */
const HEART_ROWS = [
  { count: 1, y: -2.4 },
  { count: 2, y: -1.65 },
  { count: 4, y: -0.85 },
  { count: 5, y: 0 },
  { count: 4, y: 0.85 },
  { count: 3, y: 1.65 },
  { count: 1, y: 2.4 },
] as const;

export function getHeartSlotCount(): number {
  return HEART_ROWS.reduce((sum, row) => sum + row.count, 0);
}

export function computeHeartLayout(
  containerWidth: number,
  containerHeight: number,
  photoSize: number,
): HeartPosition[] {
  const gap = photoSize * 0.18;
  const cell = photoSize + gap;
  const positions: HeartPosition[] = [];

  const maxRowWidth = Math.max(...HEART_ROWS.map((r) => r.count)) * cell;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  for (const row of HEART_ROWS) {
    const rowWidth = row.count * cell - gap;
    const startX = centerX - rowWidth / 2;
    const y = centerY + row.y * cell;

    for (let i = 0; i < row.count; i++) {
      positions.push({
        x: startX + i * cell + photoSize / 2,
        y,
      });
    }
  }

  const totalHeight = (HEART_ROWS[HEART_ROWS.length - 1].y - HEART_ROWS[0].y) * cell + photoSize;
  const scale = Math.min(
    1,
    (containerWidth * 0.92) / maxRowWidth,
    (containerHeight * 0.85) / totalHeight,
  );

  if (scale < 1) {
    return positions.map((p) => ({
      x: centerX + (p.x - centerX) * scale,
      y: centerY + (p.y - centerY) * scale,
    }));
  }

  return positions;
}

export function computePhotoSize(containerWidth: number, containerHeight: number): number {
  const base = Math.min(containerWidth * 0.19, containerHeight * 0.11, 72);
  return Math.max(44, base);
}

export function randomScatterPosition(
  containerWidth: number,
  containerHeight: number,
): HeartPosition {
  return {
    x: Math.random() * containerWidth,
    y: Math.random() * containerHeight,
  };
}
