/**
 * Deterministic Health Inhalation & Carbon Emissions Arithmetic.
 * All formulas are derived from epidemiological standards (Berkeley Earth, WHO)
 * and transport emission factors per ADR 1.
 */

export interface InhalationParams {
  /** Ambient outdoor PM2.5 in ug/m3 */
  outdoorPM25: number;
  /** Effective indoor PM2.5 in ug/m3 with filtration or sealing */
  indoorPM25: number;
  /** Duration in hours spent indoors under active protection */
  hoursIndoors: number;
  /** Activity level impacting minute ventilation volume */
  activityLevel?: "resting" | "light_active" | "moderate_exercise";
  /** Mask filtration efficiency (0.0 for none, 0.95 for N95, 0.70 for surgical) */
  maskEfficiency?: number;
}

/**
 * Minute ventilation volume in cubic meters per hour:
 * - Resting adult: ~0.45 m3/h (~7.5 L/min)
 * - Light indoor activity: ~0.80 m3/h (~13.3 L/min)
 * - Moderate exercise: ~1.80 m3/h (~30 L/min)
 */
export const VENTILATION_RATES_M3_PER_HOUR = {
  resting: 0.45,
  light_active: 0.8,
  moderate_exercise: 1.8,
} as const;

/**
 * Calculates micrograms (ug) of PM2.5 prevented from deep lung deposition.
 *
 * Formula:
 * Delta PM2.5 = (Outdoor Concentration - Indoor Concentration * (1 - MaskEfficiency)) * VentilationRate * Hours
 */
export function calculatePM25AvoidedUg(params: InhalationParams): number {
  const { outdoorPM25, indoorPM25, hoursIndoors, activityLevel = "resting", maskEfficiency = 0 } = params;

  if (outdoorPM25 <= 0 || hoursIndoors <= 0) return 0;

  const rate = VENTILATION_RATES_M3_PER_HOUR[activityLevel];
  const effectiveInhaledIndoor = Math.max(0, indoorPM25 * (1 - Math.min(1, Math.max(0, maskEfficiency))));
  const deltaConcentration = Math.max(0, outdoorPM25 - effectiveInhaledIndoor);

  const massAvoidedUg = deltaConcentration * rate * hoursIndoors;
  return Math.round(massAvoidedUg * 10) / 10;
}

/**
 * Cigarette Equivalents Avoided.
 * Epidemiological rule-of-thumb (Berkeley Earth / Muller et al.):
 * 22 ug/m3 of PM2.5 exposure over 24 hours corresponds roughly to 1 cigarette in lung mortality hazard.
 * A 24h intake at 22 ug/m3 = 22 ug/m3 * 10.8 m3/day = 237.6 ug of inhaled PM2.5 per cigarette.
 *
 * @param pm25AvoidedUg - Total micrograms of PM2.5 prevented from entering the lungs.
 */
export function calculateCigarettesAvoided(pm25AvoidedUg: number): number {
  if (pm25AvoidedUg <= 0) return 0;
  const CIGARETTE_PM25_UG = 237.6;
  const cigarettes = pm25AvoidedUg / CIGARETTE_PM25_UG;
  return Math.round(cigarettes * 10) / 10;
}

export type CommuteMode =
  "solo_car_ice" | "carpool_ice" | "two_wheeler" | "metro_rail" | "ev_transit" | "bicycle_walk";

/**
 * Average CO2 emissions in kg per passenger-kilometer (kg CO2 / pkm).
 * Source: IPCC / Central Pollution Control Board (CPCB) urban emission factors.
 */
export const EMISSION_FACTORS_KG_CO2_PER_KM: Record<CommuteMode, number> = {
  solo_car_ice: 0.192,
  carpool_ice: 0.064,
  two_wheeler: 0.045,
  metro_rail: 0.016,
  ev_transit: 0.018,
  bicycle_walk: 0.0,
};

/**
 * Calculates CO2 equivalent emission savings in kilograms when switching from baseline transit.
 *
 * @param distanceKm - Round-trip commute distance in kilometers.
 * @param baselineMode - Default travel mode (typically solo ICE car).
 * @param adoptedMode - Low-emission alternative chosen.
 */
export function calculateCarbonSavingsKg(
  distanceKm: number,
  baselineMode: CommuteMode = "solo_car_ice",
  adoptedMode: CommuteMode = "metro_rail",
): number {
  if (distanceKm <= 0) return 0;
  const baselineFactor = EMISSION_FACTORS_KG_CO2_PER_KM[baselineMode];
  const adoptedFactor = EMISSION_FACTORS_KG_CO2_PER_KM[adoptedMode];

  const savingsKg = Math.max(0, (baselineFactor - adoptedFactor) * distanceKm);
  return Math.round(savingsKg * 100) / 100;
}

export interface ProtectionScoreParams {
  hasAirPurifierOrCRBox: boolean;
  hasPositivePressureOrSealedWindows: boolean;
  usesWetMopping: boolean;
  wearsN95DuringCommute: boolean;
  followsDiurnalVentilationHours: boolean;
  hasAirPurifyingPlants: boolean;
}

/**
 * Computes the Household Air Protection Score (0 to 100).
 * Weighted according to empirical exposure reduction efficacy:
 * - Active Filtration (HEPA / CR Box): 35 points
 * - Aperture Sealing / Positive Pressure: 20 points
 * - Outdoor N95 mask adherence: 20 points
 * - Wet Mopping protocol: 10 points
 * - Diurnal Ventilation timing: 10 points
 * - Botanical microclimate: 5 points
 */
export function calculateAirProtectionScore(params: ProtectionScoreParams): number {
  let score = 0;
  if (params.hasAirPurifierOrCRBox) score += 35;
  if (params.hasPositivePressureOrSealedWindows) score += 20;
  if (params.wearsN95DuringCommute) score += 20;
  if (params.usesWetMopping) score += 10;
  if (params.followsDiurnalVentilationHours) score += 10;
  if (params.hasAirPurifyingPlants) score += 5;

  return Math.min(100, Math.max(0, score));
}
