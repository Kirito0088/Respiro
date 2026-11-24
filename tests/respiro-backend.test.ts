/// <reference types="vite/client" />
import rateLimiter from "@convex-dev/rate-limiter/test";
import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "../convex/_generated/api";
import schema from "../convex/schema";

const modules = import.meta.glob("../convex/**/*.ts");

function setup() {
  const t = convexTest(schema, modules);
  rateLimiter.register(t);
  return t;
}

async function createUser(
  t: ReturnType<typeof setup>,
  fields: { isAnonymous?: boolean; email?: string } = {},
) {
  const userId = await t.run((ctx) => ctx.db.insert("users", fields));
  return { userId, as: t.withIdentity({ subject: `${userId}|session-${userId}` }) };
}

describe("Respiro Convex Backend", () => {
  it("creates a household profile and retrieves it for the owner", async () => {
    const t = setup();
    const user = await createUser(t);

    const profileId = await user.as.mutation(api.profiles.create, {
      name: "Gupta Household",
      city: "Noida Sector 62",
      dwellingType: "apartment_high_rise",
      vulnerabilities: ["infants", "asthmatics_respiratory"],
      purifierSetup: "single_room_hepa",
      commuteMode: "metro_ev",
      baseAQI: 340,
      roomVolumeM3: 70,
    });

    expect(profileId).toBeDefined();

    const fetched = await user.as.query(api.profiles.get, { profileId });
    expect(fetched.name).toBe("Gupta Household");
    expect(fetched.city).toBe("Noida Sector 62");
    expect(fetched.baseAQI).toBe(340);
  });

  it("strictly enforces multi-tenant ownership: foreign users cannot read another profile", async () => {
    const t = setup();
    const userA = await createUser(t);
    const userB = await createUser(t);

    const profileIdA = await userA.as.mutation(api.profiles.create, {
      name: "User A Family",
      city: "Delhi",
      dwellingType: "apartment_high_rise",
      vulnerabilities: [],
      purifierSetup: "none",
      commuteMode: "bus_public",
      baseAQI: 280,
      roomVolumeM3: 50,
    });

    // User B tries to read User A's profile
    await expect(userB.as.query(api.profiles.get, { profileId: profileIdA })).rejects.toThrow();
  });

  it("toggles indoor air quality hack completions", async () => {
    const t = setup();
    const user = await createUser(t);

    const profileId = await user.as.mutation(api.profiles.create, {
      name: "Testing Hacks",
      city: "Gurgaon",
      dwellingType: "ground_floor_independent",
      vulnerabilities: ["elderly"],
      purifierSetup: "none",
      commuteMode: "car_sealed",
      baseAQI: 310,
      roomVolumeM3: 80,
    });

    // Mark Corsi-Rosenthal box as complete
    const res1 = await user.as.mutation(api.hacks.toggleCompletion, {
      profileId,
      hackId: "corsi_rosenthal_box",
      notes: "Built with 4 MERV-13 filters",
    });
    expect(res1.completed).toBe(true);

    const completions = await user.as.query(api.hacks.listCompletions, { profileId });
    expect(completions).toHaveLength(1);
    expect(completions[0]?.hackId).toBe("corsi_rosenthal_box");

    // Toggle off
    const res2 = await user.as.mutation(api.hacks.toggleCompletion, {
      profileId,
      hackId: "corsi_rosenthal_box",
    });
    expect(res2.completed).toBe(false);

    const empty = await user.as.query(api.hacks.listCompletions, { profileId });
    expect(empty).toHaveLength(0);
  });

  it("records neighborhood community pledges and aggregates statistics", async () => {
    const t = setup();
    const user = await createUser(t);

    await user.as.mutation(api.community.createPledge, {
      neighborhoodZone: "Indirapuram Sector 4",
      pledgeType: "carpool",
      pledgeTitle: "Shared EV morning commute",
      userName: "Rahul",
    });

    await user.as.mutation(api.community.createPledge, {
      neighborhoodZone: "Indirapuram Sector 4",
      pledgeType: "zero_burn",
      pledgeTitle: "Zero leaf burning watch in RWA",
      userName: "Priya",
    });

    const pledges = await user.as.query(api.community.listPledges, {
      neighborhoodZone: "Indirapuram Sector 4",
    });
    expect(pledges).toHaveLength(2);

    const stats = await user.as.query(api.community.getCommunityStats, {
      neighborhoodZone: "Indirapuram Sector 4",
    });
    expect(stats.totalPledges).toBe(2);
    expect(stats.carpoolCount).toBe(1);
    expect(stats.zeroBurnCount).toBe(1);
  });

  it("seeds a realistic demo profile for zero-friction evaluator onboarding", async () => {
    const t = setup();
    const demoUser = await createUser(t, { isAnonymous: true });

    const demoProfileId = await demoUser.as.mutation(api.demo.seedDemoProfile, {});
    expect(demoProfileId).toBeDefined();

    const profile = await demoUser.as.query(api.profiles.get, { profileId: demoProfileId });
    expect(profile.isDemo).toBe(true);
    expect(profile.city).toContain("Delhi");

    const plan = await demoUser.as.query(api.copilot.getPlan, { profileId: demoProfileId });
    expect(plan).toBeDefined();
    expect(plan?.dailyRoutines.length).toBeGreaterThanOrEqual(4);

    const completions = await demoUser.as.query(api.hacks.listCompletions, { profileId: demoProfileId });
    expect(completions.length).toBeGreaterThanOrEqual(2);
  });
});
