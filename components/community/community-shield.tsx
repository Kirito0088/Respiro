"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car, Flame, HeartHandshake, Leaf, ShoppingCart, Users } from "lucide-react";
import { toast } from "sonner";

interface Pledge {
  id: string;
  userName: string;
  neighborhoodZone: string;
  pledgeType: string;
  pledgeTitle: string;
  createdAt: number;
}

const SAMPLE_PLEDGES: Pledge[] = [
  {
    id: "p1",
    userName: "Sharma Family",
    neighborhoodZone: "East Delhi (Anand Vihar)",
    pledgeType: "carpool",
    pledgeTitle: "Shared EV School Run & Metro Commute",
    createdAt: Date.now() - 3600000,
  },
  {
    id: "p2",
    userName: "RWA Green Committee",
    neighborhoodZone: "East Delhi (Anand Vihar)",
    pledgeType: "zero_burn",
    pledgeTitle: "24/7 Zero Garden Waste Burning Patrol",
    createdAt: Date.now() - 7200000,
  },
  {
    id: "p3",
    userName: "Aarav M.",
    neighborhoodZone: "East Delhi (Anand Vihar)",
    pledgeType: "bulk_filter",
    pledgeTitle: "Coordinated 50-Pack MERV-13 Filter Group Order",
    createdAt: Date.now() - 14400000,
  },
];

interface CommunityShieldProps {
  neighborhoodZone: string;
}

export function CommunityShield({ neighborhoodZone }: CommunityShieldProps) {
  const [pledges, setPledges] = useState<Pledge[]>(SAMPLE_PLEDGES);
  const [userName, setUserName] = useState("");
  const [pledgeTitle, setPledgeTitle] = useState("");
  const [pledgeType, setPledgeType] = useState<string>("carpool");

  const handleAddPledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeTitle.trim()) {
      toast.error("Please enter what you are pledging.");
      return;
    }

    const newPledge: Pledge = {
      id: `p-${Date.now()}`,
      userName: userName.trim() || "Anonymous Neighbor",
      neighborhoodZone,
      pledgeType,
      pledgeTitle: pledgeTitle.trim(),
      createdAt: Date.now(),
    };

    setPledges([newPledge, ...pledges]);
    setPledgeTitle("");
    toast.success("Thank you for your community clean-air pledge!");
  };

  const getPledgeIcon = (type: string) => {
    switch (type) {
      case "carpool":
        return <Car className="size-4 text-primary" />;
      case "zero_burn":
        return <Flame className="size-4 text-rose-500" />;
      case "bulk_filter":
        return <ShoppingCart className="size-4 text-emerald-500" />;
      default:
        return <Leaf className="size-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Community Smog Shield</h2>
              <Badge variant="outline" className="gap-1 border-primary/30 text-xs">
                <Users className="size-3 text-primary" />
                <span>Collective Neighborhood Action</span>
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Air pollution knows no boundary walls. Communities in{" "}
              <span className="font-semibold text-foreground">{neighborhoodZone}</span> uniting to reduce
              local emissions.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 border border-primary/20">
            <HeartHandshake className="size-5 text-primary" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold">
                Total Neighborhood Pledges
              </div>
              <div className="text-base font-black text-primary">{pledges.length} Households</div>
            </div>
          </div>
        </div>

        {/* Create Pledge Form */}
        <form
          onSubmit={handleAddPledge}
          className="mt-6 rounded-xl border border-border/50 bg-background/60 p-4 space-y-3"
        >
          <div className="font-semibold text-sm text-foreground">Make a Clean-Air Action Pledge</div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Your Name or Household</label>
              <Input
                placeholder="e.g. Verma Family / Flat 402"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Pledge Category</label>
              <select
                value={pledgeType}
                onChange={(e) => setPledgeType(e.target.value)}
                className="w-full h-8 rounded-md border border-input bg-transparent px-2 text-xs mt-1 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="carpool">Shared EV / Carpooling</option>
                <option value="zero_burn">Zero Biomass / Leaf Burning</option>
                <option value="bulk_filter">Bulk Filter Group Buy</option>
                <option value="clean_heat">No Open Coal / Biomass Heating</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">What will you do?</label>
              <Input
                placeholder="e.g. Offering 2 school carpool seats"
                value={pledgeTitle}
                onChange={(e) => setPledgeTitle(e.target.value)}
                className="h-8 text-xs mt-1"
              />
            </div>
          </div>
          <Button type="submit" size="sm" className="h-8 text-xs font-semibold gap-1.5 mt-2">
            <span>Commit Pledge</span>
          </Button>
        </form>
      </div>

      {/* Pledges Wall */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Live Community Feed ({pledges.length} Pledges)
        </h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pledges.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-border/60 bg-card p-4 space-y-2 hover:border-primary/40 transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  {getPledgeIcon(p.pledgeType)}
                  <span>{p.userName}</span>
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(p.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-xs text-foreground font-medium">{p.pledgeTitle}</p>
              <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                {p.pledgeType.replace(/_/g, " ")}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
