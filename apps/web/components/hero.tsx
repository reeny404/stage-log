import Link from "next/link";
import { Badge } from "@stagelog/ui";
import type { StageContent } from "@/lib/types";
import { ArrowIcon, PlayIcon } from "./icons";
import { LocalTime } from "./local-time";

export function Hero({ content }: { content: StageContent }) {
  return (
    <section className="hero" id="live">
      <div className="hero__content">
        <div className="hero__eyebrow"><Badge tone="live">LIVE</Badge><span>{content.viewers}</span></div>
        <p className="hero__artist">{content.artist} PRESENTS</p>
        <h1>Your front row.<br /><em>Everywhere.</em></h1>
        <p className="hero__copy">{content.description}</p>
        <div className="hero__schedule"><span>Starts in your time</span><LocalTime startsAt={content.startsAt} /></div>
        <div className="hero__actions">
          <Link className="hero-button hero-button--primary" href={`/content/${content.slug}`}><PlayIcon />Enter the room</Link>
          <Link className="hero-button hero-button--ghost" href="#discover">Explore shows <ArrowIcon /></Link>
        </div>
      </div>
      <Link className="hero__visual" href={`/content/${content.slug}`} aria-label={`Open ${content.title}`}>
        <div className="stage-figure stage-figure--one" />
        <div className="stage-figure stage-figure--two" />
        <div className="stage-light stage-light--one" />
        <div className="stage-light stage-light--two" />
        <div className="hero__stamp"><span>20</span><small>SEP<br />2026</small></div>
        <div className="hero__caption"><span>{content.episode}</span><strong>{content.title}</strong></div>
      </Link>
    </section>
  );
}
