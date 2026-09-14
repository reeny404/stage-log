import type { StageContent } from "@/lib/types";
import { LocalTime } from "./local-time";

export function UpcomingRail({ contents }: { contents: StageContent[] }) {
  return (
    <section className="signal-strip" aria-label="Upcoming signals">
      <span className="signal-strip__label">UP NEXT</span>
      <div className="signal-strip__items">
        {contents.slice(0, 3).map((content) => (
          <div className="signal-item" key={content.id}>
            <span className={`signal-item__dot signal-item__dot--${content.accent}`} />
            <div><strong>{content.title}</strong><span><LocalTime startsAt={content.startsAt} compact /></span></div>
          </div>
        ))}
      </div>
    </section>
  );
}
