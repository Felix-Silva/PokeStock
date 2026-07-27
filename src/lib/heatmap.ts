export type HeatmapCell = {
  day: number; // 0 = Sunday ... 6 = Saturday
  hour: number; // 0-23
  count: number;
  avgScore: number | null; // null when there's no data for this cell yet
  hitRate: number | null; // fraction of checks with score > 0
};

export function buildHeatmap(checks: { checked_at: string; score: number }[]): HeatmapCell[][] {
  const buckets = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => ({ count: 0, scoreSum: 0, hits: 0 })),
  );

  for (const check of checks) {
    const date = new Date(check.checked_at);
    const day = date.getDay();
    const hour = date.getHours();
    const bucket = buckets[day][hour];
    bucket.count += 1;
    bucket.scoreSum += check.score;
    if (check.score > 0) bucket.hits += 1;
  }

  return buckets.map((row, day) =>
    row.map((bucket, hour) => ({
      day,
      hour,
      count: bucket.count,
      avgScore: bucket.count === 0 ? null : bucket.scoreSum / bucket.count,
      hitRate: bucket.count === 0 ? null : bucket.hits / bucket.count,
    })),
  );
}
