export type AnalyticsEvents = {
  content_impression: { contentId: string; position: number; surface: "home" | "search" };
  content_view: { contentId: string; contentType: "live" | "vod" };
  favorite_added: { contentId: string; source: "card" | "detail" };
  favorite_removed: { contentId: string; source: "card" | "detail" | "saved" };
  live_entered: { contentId: string; entryPoint: "home" | "detail" };
  reaction_sent: { contentId: string; reaction: string };
  filter_changed: { category: string };
  search_submitted: { queryLength: number; resultCount: number };
};

export type AnalyticsEventName = keyof AnalyticsEvents;

export function track<EventName extends AnalyticsEventName>(
  name: EventName,
  properties: AnalyticsEvents[EventName],
) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("stagelog:analytics", {
      detail: { name, properties, occurredAt: new Date().toISOString() },
    }),
  );

  if (process.env.NODE_ENV === "development") {
    console.info(`[analytics] ${name}`, properties);
  }
}
