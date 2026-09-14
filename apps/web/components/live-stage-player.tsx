"use client";

import { track } from "@stagelog/analytics";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { ExpandIcon, PauseIcon, PlayIcon, RadioIcon } from "./icons";
import {
  DEMO_BROADCAST_DURATION_SECONDS,
  formatLivePosition,
  getDemoLivePosition,
} from "@/lib/live";

type LiveStagePlayerProps = {
  artist: string;
  contentId: string;
  episode: string;
  title: string;
  viewers: string;
};

const waveBars = [42, 72, 54, 88, 63, 96, 58, 78, 48, 83, 65, 91, 51, 76, 45, 69];

function currentPosition() {
  return getDemoLivePosition(Date.now(), DEMO_BROADCAST_DURATION_SECONDS);
}

export function LiveStagePlayer({ artist, contentId, episode, title, viewers }: LiveStagePlayerProps) {
  const playerRef = useRef<HTMLElement>(null);
  const hasTrackedEntry = useRef(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState(0);
  const [syncOffset, setSyncOffset] = useState(0);
  const [feedback, setFeedback] = useState("Demo live connected");

  useEffect(() => {
    const initialSync = window.setTimeout(() => {
      const nextPosition = currentPosition();
      setPosition(nextPosition);
      setSyncOffset(nextPosition % 36);
    }, 0);

    if (!hasTrackedEntry.current) {
      track("live_entered", { contentId, entryPoint: "detail" });
      hasTrackedEntry.current = true;
    }

    return () => window.clearTimeout(initialSync);
  }, [contentId]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = window.setInterval(() => {
      setPosition(currentPosition());
    }, 1_000);

    return () => window.clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === playerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const pauseOrResume = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setFeedback("Demo broadcast paused");
      return;
    }

    const nextPosition = currentPosition();
    setPosition(nextPosition);
    setSyncOffset(nextPosition % 36);
    setIsPlaying(true);
    setFeedback("Returned to the live edge");
  };

  const goLive = () => {
    const nextPosition = currentPosition();
    setPosition(nextPosition);
    setSyncOffset(nextPosition % 36);
    setIsPlaying(true);
    setFeedback("Returned to the live edge");
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await playerRef.current?.requestFullscreen();
      }
    } catch {
      setFeedback("Fullscreen is unavailable in this browser");
    }
  };

  const playerStyle = {
    "--stage-sync": `-${syncOffset}s`,
  } as CSSProperties;

  return (
    <section
      className={`live-stage-player${isPlaying ? "" : " live-stage-player--paused"}`}
      id="live-stage"
      ref={playerRef}
      style={playerStyle}
      aria-labelledby="live-stage-title"
    >
      <div className="live-stage__scene" aria-hidden="true">
        <div className="live-stage__aurora" />
        <div className="live-stage__sun" />
        <div className="live-stage__ring live-stage__ring--one" />
        <div className="live-stage__ring live-stage__ring--two" />
        <div className="live-stage__beam live-stage__beam--one" />
        <div className="live-stage__beam live-stage__beam--two" />
        <div className="live-stage__beam live-stage__beam--three" />
        <div className="live-stage__performer live-stage__performer--one" />
        <div className="live-stage__performer live-stage__performer--two" />
        <div className="live-stage__performer live-stage__performer--three" />
        <div className="live-stage__floor" />
        <div className="live-stage__wave">
          {waveBars.map((height, index) => (
            <span
              key={`${height}-${index}`}
              style={{ "--wave-height": `${height}%`, "--wave-delay": `${index * -0.07}s` } as CSSProperties}
            />
          ))}
        </div>
        <div className="live-stage__grain" />
      </div>

      <div className="live-stage__topbar">
        <div className="live-stage__status">
          <span className="live-stage__badge"><RadioIcon /> DEMO LIVE</span>
          <span>{viewers.replace("waiting", "watching")}</span>
        </div>
        <span className="live-stage__sync">SYNCHRONIZED FICTIONAL BROADCAST</span>
      </div>

      <div className="live-stage__lower-third">
        <span>{episode}</span>
        <h2 id="live-stage-title">{title}</h2>
        <p>{artist} · Seoul signal room</p>
      </div>

      <div className="live-stage__controls">
        <button
          type="button"
          onClick={pauseOrResume}
          aria-label={isPlaying ? "Pause demo broadcast" : "Resume demo broadcast"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        {!isPlaying && (
          <button className="live-stage__go-live" type="button" onClick={goLive}>
            <span /> Back to live
          </button>
        )}
        <div className="live-stage__time">
          <span className={isPlaying ? "live-stage__dot" : "live-stage__dot live-stage__dot--paused"} />
          {isPlaying ? "LIVE" : "PAUSED"} · {formatLivePosition(position)}
        </div>
        <button
          className="live-stage__fullscreen"
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <ExpandIcon />
        </button>
      </div>

      <p className="sr-only">This is an always-available simulated live broadcast using fictional content.</p>
      <p className="sr-only" aria-live="polite">{feedback}</p>
    </section>
  );
}
