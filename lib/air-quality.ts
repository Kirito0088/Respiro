/**
 * Deterministic Environmental & Air Quality Inversion Arithmetic.
 * All mathematical formulas are evaluated in code per ADR 1.
 */

export const AQI_TIERS = ["good", "moderate", "poor", "very_poor", "severe", "hazardous"] as const;

export type AQITier = (typeof AQI_TIERS)[number];

export interface AQITierInfo {
  tier: AQITier;
  label: string;
  min: number;
  max: number;
  color: string;
  healthAdvisory: string;
}

export const AQI_TIER_TABLE: Record<AQITier, AQITierInfo> = {
  good: {
    tier: "good",
    label: "Good (0–50)",
    min: 0,
    max: 50,
    color: "#22c55e",
    healthAdvisory: "Air quality is satisfactory and poses little to no health risk.",
  },
  moderate: {
    tier: "moderate",
    label: "Moderate (51–100)",
    min: 51,
    max: 100,
    color: "#eab308",
    healthAdvisory: "Acceptable quality; unusually sensitive individuals should observe symptoms.",
  },
  poor: {
    tier: "poor",
    label: "Poor (101–200)",
    min: 101,
    max: 200,
    color: "#f97316",
    healthAdvisory: "Breathing discomfort to sensitive groups; reduce prolonged outdoor exertion.",
  },
  very_poor: {
    tier: "very_poor",
    label: "Very Poor (201–300)",
    min: 201,
    max: 300,
    color: "#ef4444",
    healthAdvisory: "Respiratory illness warning on prolonged exposure; keep windows sealed.",
  },
  severe: {
    tier: "severe",
    label: "Severe (301–400)",
    min: 301,
    max: 400,
    color: "#a855f7",
    healthAdvisory: "Affects healthy people and seriously impacts vulnerable groups; wear N95 outdoors.",
  },
  hazardous: {
    tier: "hazardous",
    label: "Hazardous (401+)",
    min: 401,
    max: 999,
    color: "#881337",
    healthAdvisory:
      "Emergency condition; severe inversion trapping; avoid all non-essential outdoor transit.",
  },
};

/**
 * Categorizes a numeric AQI value into its standardized tier.
 */
export function getAQITier(aqi: number): AQITier {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  if (aqi <= 200) return "poor";
  if (aqi <= 300) return "very_poor";
  if (aqi <= 400) return "severe";
  return "hazardous";
}

/**
 * Diurnal Thermal Inversion Multiplier.
 * In winter urban smog basins, nocturnal radiational ground cooling creates a stable
 * thermal inversion cap trapping pollutants near the surface in early mornings (05:00-09:30).
 * Solar heating expands the planetary boundary layer at midday (12:00-15:30), dispersing pollutants.
 *
 * @param hour - Hour of the day (0 to 23).
 * @returns Diurnal multiplier relative to daily mean (0.65 to 1.45).
 */
export function diurnalInversionFactor(hour: number): number {
  const normalizedHour = ((hour % 24) + 24) % 24;

  // Peak morning inversion trap (05:00 - 09:30)
  if (normalizedHour >= 5 && normalizedHour < 10) {
    if (normalizedHour >= 6 && normalizedHour <= 8) return 1.45;
    return 1.3;
  }

  // Midday convective boundary layer lifting (12:00 - 15:30)
  if (normalizedHour >= 12 && normalizedHour < 16) {
    if (normalizedHour >= 13 && normalizedHour <= 14) return 0.68;
    return 0.75;
  }

  // Evening radiative cooling and rush-hour emission trapping (18:00 - 22:00)
  if (normalizedHour >= 18 && normalizedHour < 23) {
    if (normalizedHour >= 19 && normalizedHour <= 21) return 1.35;
    return 1.2;
  }

  // Late night stagnant dispersion (23:00 - 05:00)
  if (normalizedHour >= 23 || normalizedHour < 3) return 1.1;
  return 1.25; // 03:00 - 05:00
}

/**
 * Calculates hourly localized AQI estimate from daily baseline AQI.
 */
export function calculateHourlyAQI(baseAQI: number, hour: number): number {
  const factor = diurnalInversionFactor(hour);
  return Math.max(1, Math.round(baseAQI * factor));
}

export interface VentilationWindow {
  hourStart: number;
  hourEnd: number;
  isSafeToVentilate: boolean;
  recommendedDurationMins: number;
  guidance: string;
}

/**
 * Evaluates the optimal window for indoor cross-ventilation based on ambient AQI and diurnal curves.
 */
export function getSafeVentilationWindows(baseAQI: number): VentilationWindow[] {
  // If outdoor AQI is beyond 450, no natural ventilation is safe; mechanical filtration only.
  if (baseAQI >= 450) {
    return [
      {
        hourStart: 12,
        hourEnd: 15,
        isSafeToVentilate: false,
        recommendedDurationMins: 0,
        guidance:
          "Outdoor air is Hazardous (450+). Keep all external apertures sealed; rely strictly on indoor filtration.",
      },
    ];
  }

  return [
    {
      hourStart: 6,
      hourEnd: 9,
      isSafeToVentilate: false,
      recommendedDurationMins: 0,
      guidance: "Morning thermal inversion trap. Keep all windows and balcony doors tightly sealed.",
    },
    {
      hourStart: 12,
      hourEnd: 15,
      isSafeToVentilate: true,
      recommendedDurationMins: baseAQI > 250 ? 10 : 20,
      guidance:
        "Solar boundary layer expansion window. Safe for rapid 10–20 min cross-ventilation to flush indoor CO2.",
    },
    {
      hourStart: 18,
      hourEnd: 22,
      isSafeToVentilate: false,
      recommendedDurationMins: 0,
      guidance: "Evening cooling and traffic compression. Seal home apertures and set purifiers to medium.",
    },
  ];
}

/**
 * Required Clean Air Delivery Rate (CADR in m3/h) to maintain target Air Changes per Hour (ACH).
 * Standard minimum clean-air threshold is 4.0 to 5.0 ACH during severe pollution.
 *
 * @param roomVolumeM3 - Room volume in cubic meters (Length x Width x Height).
 * @param targetACH - Desired air changes per hour (default 4.5).
 */
export function calculateRequiredCADR(roomVolumeM3: number, targetACH = 4.5): number {
  if (roomVolumeM3 <= 0 || targetACH <= 0) return 0;
  return Math.round(roomVolumeM3 * targetACH);
}
