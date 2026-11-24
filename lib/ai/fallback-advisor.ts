import type { CopilotPlan, HackItem, RoutineTimeSlot, SustainableAlternative } from "./copilot-schema";

export interface AdvisorContext {
  city: string;
  baseAQI: number;
  dwellingType: string;
  vulnerabilities: string[];
  commuteMode: string;
  hasPurifier: boolean;
}

/**
 * Standard Science-Backed IAQ Hack Library.
 * Curated from EPA, WHO, and peer-reviewed aerosol mitigation literature.
 */
export const STANDARD_HACKS: HackItem[] = [
  {
    id: "corsi_rosenthal_box",
    title: "DIY Corsi-Rosenthal Cube Air Purifier",
    category: "diy_filtration",
    difficulty: "moderate",
    estimatedCostINR: 2800,
    summary:
      "Construct a 4-filter high-CADR air filtration box delivering ~400 m³/h clean air at 1/5th commercial purifier cost.",
    whyItWorks:
      "Four MERV-13 filters arranged in a cube drastically lower air resistance, allowing a standard box fan to move massive air volume through low face-velocity filters.",
    steps: [
      "Obtain a 20-inch box fan and four 20x20x2 MERV-13 furnace filters (or HEPA grade).",
      "Tape the four filters together into an open cube, ensuring arrows point INWARD toward the center.",
      "Cut a cardboard square to seal the bottom of the cube with duct tape.",
      "Mount the box fan on top facing UPWARDS (exhausting clean air out of the cube).",
      "Seal all edges with duct tape to prevent air leaks and plug into AC power.",
    ],
    safetyWarning: "Ensure fan motor is rated for continuous duty and do not block the exhaust.",
  },
  {
    id: "wet_microfiber_mopping",
    title: "Electrostatic Wet-Mopping Protocol",
    category: "wet_mopping_cleaning",
    difficulty: "easy",
    estimatedCostINR: 350,
    summary:
      "Eliminate dry sweeping to stop re-suspending toxic settled PM10 and heavy metal particulate dust.",
    whyItWorks:
      "Dry brooms aerate settled particulate back into breathing zones for 4–6 hours. Damp microfiber traps particulate electrostatically via capillary action.",
    steps: [
      "Ban all dry sweeping during severe smog periods.",
      "Use warm water mixed with a drop of neutral dish soap on a microfiber flat mop.",
      "Mop in a single S-pattern dragging inward towards the door.",
      "Rinse microfiber mop heads thoroughly in a separate rinse bucket.",
    ],
  },
  {
    id: "positive_pressure_window_seal",
    title: "Positive-Pressure Aperture Sealing",
    category: "airtight_sealing",
    difficulty: "easy",
    estimatedCostINR: 600,
    summary: "Seal drafts around windows with high-density EPDM foam and draft stoppers.",
    whyItWorks:
      "Smog infiltrates microscopic window and door perimeter gaps through thermal stack effects. Sealing forces all incoming air through filtered paths.",
    steps: [
      "Inspect window sashes with a lit candle or tissue paper on windy evenings to spot drafts.",
      "Apply self-adhesive EPDM weatherstrip tape along all window and exterior door jambs.",
      "Install weighted door sweep draft snakes at the base of balcony and entrance doors.",
    ],
  },
  {
    id: "kitchen_exhaust_containment",
    title: "Kitchen Micro-Containment & Cross-Draft Exhaust",
    category: "kitchen_ventilation",
    difficulty: "easy",
    estimatedCostINR: 0,
    summary:
      "Prevent high-heat cooking spices and aerosolized oil droplets from polluting bedroom breathing zones.",
    whyItWorks:
      "Indian tempering (tadka) produces indoor PM2.5 spikes exceeding 800 µg/m³. Closing kitchen doors and creating localized exhaust stops whole-home dispersion.",
    steps: [
      "Close interior kitchen doors and sliding dividers before lighting the stove.",
      "Crack open the single nearest kitchen exterior window by 2 inches and turn exhaust fan on HIGH.",
      "Keep exhaust fan running for 10 minutes post-cooking before opening internal kitchen doors.",
    ],
  },
  {
    id: "botanical_microclimate_barrier",
    title: "NASA Clean Air Botanical Barrier",
    category: "botanical_flora",
    difficulty: "easy",
    estimatedCostINR: 1200,
    summary:
      "Deploy high-leaf surface plants on balconies and bedroom corners to regulate humidity and dust capture.",
    whyItWorks:
      "Snake plants (Sansevieria) emit nighttime oxygen while Areca palms boost indoor humidity to 45%, causing airborne smog particles to agglomerate and settle.",
    steps: [
      "Place 2 Sansevieria plants in the primary bedroom for nighttime oxygenation.",
      "Position 2 Areca Palms near entryway thresholds as a natural electrostatic particulate buffer.",
      "Wipe plant leaves weekly with a damp cloth to clear accumulated dust and maintain transpiration.",
    ],
  },
];

/**
 * Deterministic Fallback Smog Advisor.
 * Guarantees zero downtime and instant answers matching the Zod schema even without API keys.
 */
export function generateDeterministicPlan(context: AdvisorContext): CopilotPlan {
  const { city, baseAQI, vulnerabilities, commuteMode, hasPurifier } = context;

  const isHighRisk = vulnerabilities.some((v) =>
    ["infants", "elderly", "asthmatics_respiratory", "cardiovascular"].includes(v),
  );

  const headline =
    baseAQI >= 300
      ? `Emergency Smog Defense Strategy for ${city}`
      : `Adaptive Clean-Air Living Plan for ${city}`;

  const summary = `Tailored protection plan for your household at AQI ${baseAQI}. Focuses on keeping indoor air below 40 µg/m³ while timing commutes and ventilation with the daily thermal inversion lifting window.`;

  const primaryVulnerabilityAlert = isHighRisk
    ? "High-Vulnerability Alert: Household contains vulnerable respiratory profiles. Strictly enforce indoor HEPA filtration and ban all outdoor exertion during morning inversion hours (06:00–09:30)."
    : undefined;

  const dailyRoutines: RoutineTimeSlot[] = [
    {
      timeSlot: "06:00 - 08:30",
      activity: "Morning Wake-Up & Indoor Exercise",
      airSafetyTier: "hazardous",
      indoorPurifierSetting: hasPurifier ? "boost_clean" : "eco_silent",
      maskRecommendation: "n95_ffp2",
      actionTip:
        "Severe thermal inversion trap. Keep all balcony doors sealed. Exercise strictly indoors with air cleaner on high.",
    },
    {
      timeSlot: "08:30 - 10:00",
      activity: "Morning Commute",
      airSafetyTier: baseAQI >= 250 ? "hazardous" : "caution",
      indoorPurifierSetting: "eco_silent",
      maskRecommendation: commuteMode === "two_wheeler_unprotected" ? "n95_ffp2" : "surgical_dust",
      actionTip:
        commuteMode === "two_wheeler_unprotected"
          ? "Crucial: Wear dual-strap N95 mask with nose clip sealed. Consider switching to Metro or EV carpool."
          : "Keep vehicle AC in recirculate mode (closed air flap) to avoid drawing toxic road-level exhaust.",
    },
    {
      timeSlot: "12:00 - 15:30",
      activity: "Midday Solar Expansion & Rapid Flush",
      airSafetyTier: "safe",
      indoorPurifierSetting: "eco_silent",
      maskRecommendation: "none",
      actionTip:
        "Best air window of the day. Perform a quick 10–15 minute cross-ventilation flush to clear indoor CO2 buildup, then reseal.",
    },
    {
      timeSlot: "18:00 - 20:30",
      activity: "Evening Return Commute & Dinner Prep",
      airSafetyTier: "caution",
      indoorPurifierSetting: "eco_silent",
      maskRecommendation: "n95_ffp2",
      actionTip:
        "Evening traffic inversion compression starts. Close kitchen doors and run exhaust on high while cooking.",
    },
    {
      timeSlot: "21:30 - 06:00",
      activity: "Night Rest & Bedroom Sealing",
      airSafetyTier: "safe",
      indoorPurifierSetting: hasPurifier ? "eco_silent" : "eco_silent",
      maskRecommendation: "none",
      actionTip:
        "Bedroom door and windows sealed. Keep purifier running on whisper/eco mode directly beside headboards.",
    },
  ];

  const sustainableAlternatives: SustainableAlternative[] = [
    {
      title: "Switch to Electric Metro / Shared EV Transit",
      category: "transport",
      description:
        "Shift daily solo ICE commutes to metro rail or shared EV shuttles to reduce road-level vehicular particulate emissions.",
      directImpactNote:
        "Reduces ~3.8 kg of CO2 and avoids inhaling 450 µg of roadside tailpipe particulate daily.",
    },
    {
      title: "Induction Cooking & Micro-Ventilation",
      category: "heating_cooking",
      description:
        "Replace unvented biomass or gas burner high-heat frying with electric induction and targeted localized extraction.",
      directImpactNote:
        "Eliminates indoor nitrogen dioxide (NO2) spikes and cuts indoor PM2.5 spikes by up to 75%.",
    },
    {
      title: "Neighborhood Organic Waste Composting",
      category: "waste_management",
      description:
        "Pledge to compost garden clippings and leaves instead of open burning in society compounds.",
      directImpactNote: "Prevents toxic dioxin, VOC, and black carbon release in local breathing zones.",
    },
  ];

  return {
    headline,
    summary,
    primaryVulnerabilityAlert,
    dailyRoutines,
    topHacks: STANDARD_HACKS.slice(0, 4),
    sustainableAlternatives,
  };
}
