export const whoStandards = {
  // M = Nilai Rata-rata (Median), S = Standar Deviasi (Simpangan Baku)
  boys: [
    { month: 0, weight: { m: 3.3, s: 0.4 }, height: { m: 50.5, s: 1.9 } },
    { month: 1, weight: { m: 4.5, s: 0.5 }, height: { m: 54.7, s: 2.0 } },
    { month: 2, weight: { m: 5.6, s: 0.6 }, height: { m: 58.4, s: 2.1 } },
    { month: 3, weight: { m: 6.4, s: 0.7 }, height: { m: 61.4, s: 2.2 } },
    { month: 4, weight: { m: 7.0, s: 0.8 }, height: { m: 63.9, s: 2.2 } },
    { month: 5, weight: { m: 7.5, s: 0.8 }, height: { m: 65.9, s: 2.2 } },
    { month: 6, weight: { m: 7.9, s: 0.9 }, height: { m: 67.6, s: 2.3 } },
    { month: 7, weight: { m: 8.3, s: 0.9 }, height: { m: 69.2, s: 2.4 } },
    { month: 8, weight: { m: 8.6, s: 0.9 }, height: { m: 70.6, s: 2.4 } },
    { month: 9, weight: { m: 8.9, s: 1.0 }, height: { m: 72.0, s: 2.5 } },
    { month: 10, weight: { m: 9.2, s: 1.0 }, height: { m: 73.3, s: 2.6 } },
    { month: 11, weight: { m: 9.4, s: 1.0 }, height: { m: 74.5, s: 2.6 } },
    { month: 12, weight: { m: 9.6, s: 1.1 }, height: { m: 75.7, s: 2.7 } },
    { month: 18, weight: { m: 10.9, s: 1.2 }, height: { m: 82.3, s: 3.0 } },
    { month: 24, weight: { m: 12.2, s: 1.3 }, height: { m: 87.1, s: 3.3 } },
  ],
  girls: [
    { month: 0, weight: { m: 3.2, s: 0.4 }, height: { m: 49.1, s: 1.9 } },
    { month: 1, weight: { m: 4.2, s: 0.5 }, height: { m: 53.7, s: 2.0 } },
    { month: 2, weight: { m: 5.1, s: 0.6 }, height: { m: 57.1, s: 2.1 } },
    { month: 3, weight: { m: 5.8, s: 0.6 }, height: { m: 59.8, s: 2.1 } },
    { month: 4, weight: { m: 6.4, s: 0.7 }, height: { m: 62.1, s: 2.2 } },
    { month: 5, weight: { m: 6.9, s: 0.8 }, height: { m: 64.0, s: 2.2 } },
    { month: 6, weight: { m: 7.3, s: 0.8 }, height: { m: 65.7, s: 2.3 } },
    { month: 7, weight: { m: 7.6, s: 0.9 }, height: { m: 67.3, s: 2.3 } },
    { month: 8, weight: { m: 7.9, s: 0.9 }, height: { m: 68.7, s: 2.4 } },
    { month: 9, weight: { m: 8.2, s: 0.9 }, height: { m: 70.1, s: 2.5 } },
    { month: 10, weight: { m: 8.5, s: 1.0 }, height: { m: 71.5, s: 2.6 } },
    { month: 11, weight: { m: 8.7, s: 1.0 }, height: { m: 72.8, s: 2.6 } },
    { month: 12, weight: { m: 8.9, s: 1.0 }, height: { m: 74.0, s: 2.7 } },
    { month: 18, weight: { m: 10.2, s: 1.2 }, height: { m: 80.7, s: 3.0 } },
    { month: 24, weight: { m: 11.5, s: 1.3 }, height: { m: 85.5, s: 3.3 } },
  ]
};

export function calculateZScore(gender: 'L' | 'P', ageInMonths: number, value: number, type: 'weight' | 'height') {
  const dataSet = gender === 'L' ? whoStandards.boys : whoStandards.girls;
  
  // Cari data standar di bulan yang terdekat dengan umur anak
  let closest = dataSet[0];
  let minDiff = Math.abs(ageInMonths - closest.month);
  
  for (const record of dataSet) {
    const diff = Math.abs(ageInMonths - record.month);
    if (diff < minDiff) {
      minDiff = diff;
      closest = record;
    }
  }

  const M = closest[type].m;
  const S = closest[type].s;
  
  // Rumus Z-Score = (Nilai Aktual - Nilai Median) / Standar Deviasi
  const zScore = (value - M) / S;
  return parseFloat(zScore.toFixed(2));
}

export function determineStuntingStatus(heightZScore: number) {
  if (heightZScore < -3) return { label: "Sangat Pendek (Severe Stunting)", color: "bg-red-100 text-red-800 border-red-300" };
  if (heightZScore < -2) return { label: "Pendek (Stunting)", color: "bg-red-100 text-red-800 border-red-300" };
  if (heightZScore > 3) return { label: "Tinggi", color: "bg-blue-100 text-blue-800 border-blue-300" };
  return { label: "Normal", color: "bg-green-100 text-green-800 border-green-300" };
}

export function determineWeightStatus(weightZScore: number) {
  if (weightZScore < -3) return { label: "Gizi Buruk", color: "bg-red-100 text-red-800 border-red-300" };
  if (weightZScore < -2) return { label: "Gizi Kurang", color: "bg-yellow-100 text-yellow-800 border-yellow-300" };
  if (weightZScore > 1) return { label: "Risiko BB Lebih", color: "bg-yellow-100 text-yellow-800 border-yellow-300" };
  return { label: "Normal", color: "bg-green-100 text-green-800 border-green-300" };
}

export function formatAge(months: number) {
  if (months < 12) return `${months} Bulan`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} Tahun`;
  return `${years} Tahun ${remainingMonths} Bulan`;
}

export function formatAgeShort(months: number) {
  if (months < 12) return `${months}bln`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years}thn`;
  return `${years}thn ${remainingMonths}bln`;
}
