export function linearRegression(data: unknown[]) {
  const n = data.length;

  const x = data.map((_, i) => i);
  const y = data.map((d) => (d as { price: number }).price);

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope =
    (n * sumXY - sumX * sumY) /
    (n * sumXX - sumX * sumX);

  const intercept = (sumY - slope * sumX) / n;

  const nextX = n;
  const prediction = slope * nextX + intercept;

  let suggestion = "Hold";
  if (slope > 5) suggestion = "Sell Now";
  if (slope < -5) suggestion = "Wait";

  return {
    predictedPrice: Math.round(prediction),
    slope,
    suggestion,
  };
}