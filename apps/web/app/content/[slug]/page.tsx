import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@stagelog/ui";
import { FavoriteButton } from "@/components/favorite-button";
import { ArrowIcon, PlayIcon, RadioIcon } from "@/components/icons";
import { LiveStagePlayer } from "@/components/live-stage-player";
import { LocalTime } from "@/components/local-time";
import { ReactionBar } from "@/components/reaction-bar";
import { contents, getContent } from "@/lib/data";

type ContentPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return contents.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const content = await getContent((await params).slug);
  return content ? { title: content.title, description: content.description } : {};
}

export default async function ContentPage({ params }: ContentPageProps) {
  const content = await getContent((await params).slug);
  if (!content) notFound();

  return (
    <main className="detail-page">
      <Link className="back-link" href="/">← Back to discover</Link>
      {content.isLive && (
        <LiveStagePlayer
          artist={content.artist}
          contentId={content.id}
          episode={content.episode}
          title={content.title}
          viewers={content.viewers}
        />
      )}
      <section className={`detail-hero detail-hero--${content.accent}`}>
        {!content.isLive && (
          <div className="detail-visual">
            <span className="detail-visual__ring" />
            <span className="detail-visual__letter">{content.artist.slice(0, 1)}</span>
            <button className="detail-play" aria-label={`Play ${content.title}`}><PlayIcon /></button>
          </div>
        )}
        <div className="detail-copy">
          <div className="detail-copy__eyebrow">{content.isLive ? <Badge tone="live">LIVE NOW</Badge> : <Badge>{content.category}</Badge>}<span>{content.eyebrow}</span></div>
          <p className="detail-artist">{content.artist}</p>
          <h1>{content.title}</h1>
          <p className="detail-description">{content.description}</p>
          <dl className="detail-meta">
            <div><dt>Schedule</dt><dd><LocalTime startsAt={content.startsAt} /></dd></div>
            <div><dt>Runtime</dt><dd>{content.duration}</dd></div>
            <div><dt>Signal</dt><dd>{content.isLive ? content.viewers.replace("waiting", "watching") : content.viewers}</dd></div>
          </dl>
          <div className="detail-actions">
            {content.isLive ? (
              <a className="hero-button hero-button--primary" href="#live-stage"><RadioIcon />Demo live is on</a>
            ) : (
              <button className="hero-button hero-button--primary"><PlayIcon />Play episode</button>
            )}
            <FavoriteButton contentId={content.id} source="detail" />
          </div>
        </div>
      </section>
      {content.isLive && <ReactionBar contentId={content.id} />}
      <section className="detail-notes">
        <span className="kicker">ABOUT THIS SIGNAL</span>
        <h2>Made for the moment between<br />waiting and being there.</h2>
        <p>This fictional title demonstrates the product boundary between server-rendered editorial content and client-side participation. No real artist, schedule, audience count, or stream is represented.</p>
        <Link className="text-link" href="/#discover">Find another signal <ArrowIcon /></Link>
      </section>
    </main>
  );
}
