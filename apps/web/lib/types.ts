export type ContentCategory = "Live" | "Performance" | "Documentary" | "Behind";

export type StageContent = {
  id: string;
  slug: string;
  title: string;
  artist: string;
  eyebrow: string;
  description: string;
  category: ContentCategory;
  kind: "live" | "vod";
  startsAt: string;
  duration: string;
  viewers: string;
  accent: "coral" | "violet" | "lime" | "blue" | "amber" | "rose";
  episode: string;
  isLive?: boolean;
};
