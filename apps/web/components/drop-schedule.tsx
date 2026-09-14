import type { EventDrop } from "@/lib/events";
import { LocalTime } from "./local-time";

export function DropSchedule({ drops }: { drops: EventDrop[] }) {
  return (
    <section className="drop-section" aria-labelledby="drop-title">
      <div className="drop-section__heading">
        <span className="event-kicker">EVENT RUN OF SHOW</span>
        <h2 id="drop-title">Timed drops,<br />isolated by design.</h2>
      </div>
      <ol className="drop-list">
        {drops.map((drop, index) => (
          <li key={drop.id}>
            <span className="drop-list__number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <time><LocalTime startsAt={drop.opensAt} compact /></time>
              <h3>{drop.title}</h3>
              <p>{drop.description}</p>
            </div>
            <small>{drop.availability}</small>
          </li>
        ))}
      </ol>
    </section>
  );
}
