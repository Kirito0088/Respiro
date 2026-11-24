import { describe, expect, it } from "vitest";
import {
  calculateAirProtectionScore,
  calculateCarbonSavingsKg,
  calculateCigarettesAvoided,
  calculatePM25AvoidedUg,
} from "@/lib/impact";

describe("calculatePM25AvoidedUg", () => {
  it("calculates exact mass avoided based on delta concentration and ventilation rate", () => {
    // Outdoor 350 ug/m3, Indoor 50 ug/m3 (delta 300 ug/m3), 8 hours, resting (0.45 m3/h)
    // 300 * 0.45 * 8 = 1080 ug
    const avoided = calculatePM25AvoidedUg({
      outdoorPM25: 350,
      indoorPM25: 50,
      hoursIndoors: 8,
      activityLevel: "resting",
    });
    expect(avoided).toBe(1080);
  });

  it("scales with higher activity ventilation rates", () => {
    // 300 delta * 1.8 m3/h * 1 hour = 540 ug
    const avoided = calculatePM25AvoidedUg({
      outdoorPM25: 350,
      indoorPM25: 50,
      hoursIndoors: 1,
      activityLevel: "moderate_exercise",
    });
    expect(avoided).toBe(540);
  });

  it("accounts for mask efficiency", () => {
    // Outdoor 300, Indoor 100 with 95% mask -> effective indoor = 100 * (1 - 0.95) = 5 ug/m3
    // delta = 295 ug/m3 * 0.45 * 2h = 265.5 ug
    const avoided = calculatePM25AvoidedUg({
      outdoorPM25: 300,
      indoorPM25: 100,
      hoursIndoors: 2,
      activityLevel: "resting",
      maskEfficiency: 0.95,
    });
    expect(avoided).toBe(265.5);
  });

  it("returns 0 for negative or zero duration or ambient levels", () => {
    expect(calculatePM25AvoidedUg({ outdoorPM25: 0, indoorPM25: 0, hoursIndoors: 8 })).toBe(0);
    expect(calculatePM25AvoidedUg({ outdoorPM25: 300, indoorPM25: 50, hoursIndoors: 0 })).toBe(0);
  });
});

describe("calculateCigarettesAvoided", () => {
  it("converts inhaled mass into epidemiological cigarette equivalents (237.6 ug per cig)", () => {
    expect(calculateCigarettesAvoided(237.6)).toBe(1.0);
    expect(calculateCigarettesAvoided(1188)).toBe(5.0);
  });

  it("returns 0 for zero or negative values", () => {
    expect(calculateCigarettesAvoided(0)).toBe(0);
    expect(calculateCigarettesAvoided(-100)).toBe(0);
  });
});

describe("calculateCarbonSavingsKg", () => {
  it("calculates emissions delta for switching from solo ICE car to Metro rail", () => {
    // 25 km round-trip
    // Solo ICE: 0.192 kg/km, Metro: 0.016 kg/km -> delta = 0.176 kg/km * 25 = 4.4 kg CO2
    const savings = calculateCarbonSavingsKg(25, "solo_car_ice", "metro_rail");
    expect(savings).toBe(4.4);
  });

  it("calculates savings for cycling (0 emissions)", () => {
    // 10 km * 0.192 = 1.92 kg CO2
    expect(calculateCarbonSavingsKg(10, "solo_car_ice", "bicycle_walk")).toBe(1.92);
  });

  it("returns 0 for zero distance", () => {
    expect(calculateCarbonSavingsKg(0)).toBe(0);
  });
});

describe("calculateAirProtectionScore", () => {
  it("awards 100 points for comprehensive household protection", () => {
    const score = calculateAirProtectionScore({
      hasAirPurifierOrCRBox: true, // 35
      hasPositivePressureOrSealedWindows: true, // 20
      wearsN95DuringCommute: true, // 20
      usesWetMopping: true, // 10
      followsDiurnalVentilationHours: true, // 10
      hasAirPurifyingPlants: true, // 5
    });
    expect(score).toBe(100);
  });

  it("calculates accurate partial scores", () => {
    const score = calculateAirProtectionScore({
      hasAirPurifierOrCRBox: true, // 35
      hasPositivePressureOrSealedWindows: false,
      wearsN95DuringCommute: true, // 20
      usesWetMopping: true, // 10
      followsDiurnalVentilationHours: false,
      hasAirPurifyingPlants: false,
    });
    expect(score).toBe(65);
  });

  it("returns 0 for zero active mitigations", () => {
    const score = calculateAirProtectionScore({
      hasAirPurifierOrCRBox: false,
      hasPositivePressureOrSealedWindows: false,
      wearsN95DuringCommute: false,
      usesWetMopping: false,
      followsDiurnalVentilationHours: false,
      hasAirPurifyingPlants: false,
    });
    expect(score).toBe(0);
  });
});
