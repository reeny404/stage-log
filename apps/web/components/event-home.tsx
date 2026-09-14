import Link from "next/link";
import type { FanEvent } from "@/lib/events";
import { ArrowIcon } from "./icons";
import { LocalTime } from "./local-time";

export function EventHome({ event }: { event: FanEvent }) {
  return (
    <>
      <section className="event-hero" id="active-event">
        <div className="event-hero__topline">
          <span>01 / FEATURED EVENT</span>
          <span>SEOUL · LA · LONDON</span>
        </div>
        <div className="event-hero__copy">
          <span className="event-kicker">{event.eyebrow}</span>
          <h1>When everyone<br />arrives <em>at once.</em></h1>
          <p>{event.description}</p>
          <div className="event-hero__actions">
            <Link className="event-action event-action--primary" href={`/event/${event.slug}`}>
              Enter the traffic lab <ArrowIcon />
            </Link>
            <a className="event-action" href="#case-study">See the system boundary</a>
          </div>
        </div>
        <div className="event-hero__signal" aria-hidden="true">
          <span className="event-orbit event-orbit--one" />
          <span className="event-orbit event-orbit--two" />
          <span className="event-orbit event-orbit--three" />
          <strong>90</strong>
          <small>SECOND<br />PEAK</small>
        </div>
        <div className="event-hero__footer">
          <div><span>Doors open</span><strong><LocalTime startsAt={event.opensAt} /></strong></div>
          <div><span>Pressure window</span><strong>{event.peakWindow}</strong></div>
          <div><span>Product promise</span><strong>A stable path in and back</strong></div>
        </div>
      </section>

      <section className="boundary-section" id="case-study" aria-labelledby="boundary-title">
        <div className="boundary-heading">
          <span className="event-kicker">THE PRODUCT IS THE FAILURE BOUNDARY</span>
          <h2 id="boundary-title">One event.<br />Three different loads.</h2>
          <p>
            The event shell, personal admission, and live participation do not need to fail together.
            StageLog keeps each path independently operable.
          </p>
        </div>
        <ol className="boundary-list">
          <li>
            <span>01</span>
            <div><strong>Cacheable event shell</strong><p>Schedule, rules, and public drops remain readable at the edge.</p></div>
            <small>High read volume</small>
          </li>
          <li>
            <span>02</span>
            <div><strong>Protected admission</strong><p>Personalized entry is isolated behind an idempotent queue contract.</p></div>
            <small>Write spike</small>
          </li>
          <li>
            <span>03</span>
            <div><strong>Optional live layer</strong><p>Rankings and reactions can slow down without taking the event offline.</p></div>
            <small>Graceful degradation</small>
          </li>
        </ol>
      </section>
    </>
  );
}
