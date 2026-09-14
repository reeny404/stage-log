export type EventDrop = {
  id: string;
  opensAt: string;
  title: string;
  description: string;
  availability: string;
};

export type FanEvent = {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  edition: string;
  description: string;
  opensAt: string;
  peakWindow: string;
  audienceRegions: string[];
  drops: EventDrop[];
};

export const featuredEvent: FanEvent = {
  id: "event-stage-wave-2026",
  slug: "global-stage-drop",
  eyebrow: "Timed global fan event",
  title: "Stage Wave",
  edition: "Seoul 2026",
  description:
    "One event room for the moment every fan arrives at once: protected entry, timed audience drops, and a resilient path back when a dependency slows down.",
  opensAt: "2026-09-20T11:00:00.000Z",
  peakWindow: "First 90 seconds after doors open",
  audienceRegions: ["Seoul", "Los Angeles", "London"],
  drops: [
    {
      id: "drop-vote",
      opensAt: "2026-09-20T11:05:00.000Z",
      title: "Opening stage vote",
      description: "One verified vote per pass, with duplicate submissions rejected safely.",
      availability: "5 min",
    },
    {
      id: "drop-clip",
      opensAt: "2026-09-20T11:18:00.000Z",
      title: "Backstage clip drop",
      description: "A cacheable premiere asset that remains available if personalization is degraded.",
      availability: "12 min",
    },
    {
      id: "drop-encore",
      opensAt: "2026-09-20T11:42:00.000Z",
      title: "Encore mission",
      description: "A time-boxed audience mission with a final, server-confirmed result.",
      availability: "8 min",
    },
  ],
};

export function getEvent(slug: string) {
  return slug === featuredEvent.slug ? featuredEvent : undefined;
}
