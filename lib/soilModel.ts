type SoilInput = {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
};

type CropRule = {
  crop: string;
  conditions: (input: SoilInput) => number; // scoring
};

const cropRules: CropRule[] = [
  {
    crop: "Wheat 🌾",
    conditions: (i) =>
      (i.ph >= 6 && i.ph <= 7.5 ? 1 : 0) +
      (i.temperature < 25 ? 1 : 0) +
      (i.rainfall < 100 ? 1 : 0),
  },
  {
    crop: "Rice 🌾",
    conditions: (i) =>
      (i.rainfall > 150 ? 1 : 0) +
      (i.temperature > 25 ? 1 : 0) +
      (i.ph >= 5.5 && i.ph <= 7 ? 1 : 0),
  },
  {
    crop: "Maize 🌽",
    conditions: (i) =>
    (i.rainfall > 50 && i.rainfall < 150 ? 1 : 0) +
      (i.temperature > 20 ? 1 : 0) +
      (i.ph >= 5.5 && i.ph <= 7.5 ? 1 : 0),
  },
];

export function predictSoil(input: SoilInput) {
  let bestCrop = "";
  let bestScore = -1;

  cropRules.forEach((rule) => {
    const score = rule.conditions(input);
    if (score > bestScore) {
      bestScore = score;
      bestCrop = rule.crop;
    }
  });

  const confidence = Math.round((bestScore / 3) * 100);

  let health = "Good 🌱";
  if (input.ph < 5.5) health = "Acidic Soil ⚠️";
  if (input.ph > 7.5) health = "Alkaline Soil ⚠️";

  return {
    crop: bestCrop,
    confidence,
    health,
  };
}