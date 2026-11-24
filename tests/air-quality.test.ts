import { describe, expect, it } from "vitest";
import {
  calculateHourlyAQI,
  calculateRequiredCADR,
  diurnalInversionFactor,
  getAQITier,
  getSafeVentilationWindows,
} from "@/lib/air-quality";

describe("getAQITier", () => {
  it("classifies numerical AQI values into the standard tiers", () => {
    expect(getAQITier(25)).toBe("good");
    expect(getAQITier(50)).toBe("good");
    expect(getAQITier(75)).toBe("moderate");
    expect(getAQITier(100)).toBe("moderate");
    expect(getAQITier(150)).toBe("poor");
    expect(getAQITier(250)).toBe("very_poor");
    expect(getAQITier(350)).toBe("severe");
    expect(getAQITier(450)).toBe("hazardous");
    expect(getAQITier(999)).toBe("hazardous");
  });
});

describe("diurnalInversionFactor", () => {
  it("reflects peak morning boundary layer compression between 06:00 and 08:00", () => {
    expect(diurnalInversionFactor(7)).toBe(1.45);
    expect(diurnalInversionFactor(6)).toBe(1.45);
    expect(diurnalInversionFactor(8)).toBe(1.45);
  });

  it("reflects midday convective solar boundary lifting between 12:00 and 15:00", () => {
    expect(diurnalInversionFactor(13)).toBe(0.68);
    expect(diurnalInversionFactor(14)).toBe(0.68);
    expect(diurnalInversionFactor(12)).toBe(0.75);
    expect(diurnalInversionFactor(15)).toBe(0.75);
  });

  it("handles negative and out-of-range hours gracefully by normalizing to 24h", () => {
    expect(diurnalInversionFactor(31)).toBe(diurnalInversionFactor(7));
    expect(diurnalInversionFactor(-17)).toBe(diurnalInversionFactor(7));
  });
});

describe("calculateHourlyAQI", () => {
  it("scales base AQI by the diurnal factor and returns an integer", () => {
    const baseAQI = 300;
    // Morning peak (300 * 1.45 = 435)
    expect(calculateHourlyAQI(baseAQI, 7)).toBe(435);
    // Midday clearing (300 * 0.68 = 204)
    expect(calculateHourlyAQI(baseAQI, 13)).toBe(204);
  });

  it("never returns less than 1", () => {
    expect(calculateHourlyAQI(0, 12)).toBe(1);
  });
});

describe("getSafeVentilationWindows", () => {
  it("permits rapid ventilation around 12:00-15:00 for manageable AQI", () => {
    const windows = getSafeVentilationWindows(250);
    const midday = windows.find((w) => w.hourStart === 12);
    expect(midday?.isSafeToVentilate).toBe(true);
    expect(midday?.recommendedDurationMins).toBe(20);
  });

  it("shortens recommended duration to 10 mins when AQI is very poor (251-449)", () => {
    const windows = getSafeVentilationWindows(350);
    const midday = windows.find((w) => w.hourStart === 12);
    expect(midday?.isSafeToVentilate).toBe(true);
    expect(midday?.recommendedDurationMins).toBe(10);
  });

  it("strictly prohibits ventilation when ambient AQI is hazardous (450+)", () => {
    const windows = getSafeVentilationWindows(480);
    expect(windows).toHaveLength(1);
    expect(windows[0]?.isSafeToVentilate).toBe(false);
    expect(windows[0]?.recommendedDurationMins).toBe(0);
  });
});

describe("calculateRequiredCADR", () => {
  it("multiplies room volume by target air changes per hour (ACH)", () => {
    // 50 m3 room (e.g., 5m x 4m x 2.5m) at 4.5 ACH = 225 m3/h
    expect(calculateRequiredCADR(50, 4.5)).toBe(225);
  });

  it("handles non-positive volumes by returning 0", () => {
    expect(calculateRequiredCADR(0)).toBe(0);
    expect(calculateRequiredCADR(-10)).toBe(0);
  });
});
