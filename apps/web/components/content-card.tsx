import Link from "next/link";
import { Badge } from "@stagelog/ui";
import type { StageContent } from "@/lib/types";
import { FavoriteButton } from "./favorite-button";
import { PlayIcon } from "./icons";
import { LocalTime } from "./local-time";

export function ContentCard({ content, priority = false }: { content: StageContent; priority?: boolean }) {
  return (
    <article className="content-card">
      <Link
        className={`artwork artwork--${content.accent}`}
        href={`/content/${content.slug}`}
        aria-label={`${content.title} by ${content.artist}`}
        data-priority={priority || undefined}
      >
        <span className="artwork__orb" />
        <span className="artwork__initial">{content.artist.slice(0, 1)}</span>
        <span className="play-chip"><PlayIcon /> {content.kind === "live" ? "Enter live" : content.duration}</span>
      </Link>
      <div className="content-card__body">
        <div className="content-card__topline">
          {content.isLive ? <Badge tone="live">LIVE</Badge> : <span>{content.category}</span>}
          <FavoriteButton contentId={content.id} source="card" compact />
        </div>
        <Link href={`/content/${content.slug}`}>
          <h3>{content.title}</h3>
          <p>{content.artist} · {content.episode}</p>
        </Link>
        {content.kind === "live" && <div className="content-card__time"><LocalTime startsAt={content.startsAt} compact /></div>}
      </div>
    </article>
  );
}
