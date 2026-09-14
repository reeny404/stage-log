import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DropSchedule } from "@/components/drop-schedule";
import { EventGateway } from "@/components/event-gateway";
import { LocalTime } from "@/components/local-time";
import { featuredEvent, getEvent } from "@/lib/events";

type EventPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [{ slug: featuredEvent.slug }];
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const event = getEvent((await params).slug);
  return event
    ? { title: `${event.title} ${event.edition}`, description: event.description }
    : {};
}

export default async function EventPage({ params }: EventPageProps) {
  const event = getEvent((await params).slug);
  if (!event) notFound();

  return (
    <main className="event-page">
      <Link className="event-back" href="/">← StageLog events</Link>
      <header className="event-masthead">
        <div>
          <span className="event-kicker">{event.eyebrow}</span>
          <h1>{event.title}<br /><em>{event.edition}</em></h1>
          <p>{event.description}</p>
        </div>
        <dl>
          <div><dt>Doors</dt><dd><LocalTime startsAt={event.opensAt} /></dd></div>
          <div><dt>Peak model</dt><dd>{event.peakWindow}</dd></div>
          <div><dt>Regions</dt><dd>{event.audienceRegions.join(" · ")}</dd></div>
        </dl>
      </header>
      <EventGateway eventId={event.id} />
      <DropSchedule drops={event.drops} />
    </main>
  );
}
