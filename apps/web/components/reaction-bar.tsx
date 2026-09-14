"use client";

import { track } from "@stagelog/analytics";
import { useState } from "react";

const reactions = ["♡", "✦", "⚡", "♪"];

export function ReactionBar({ contentId }: { contentId: string }) {
  const [counts, setCounts] = useState([1240, 892, 411, 638]);

  const react = (reaction: string, index: number) => {
    setCounts((current) => current.map((count, itemIndex) => itemIndex === index ? count + 1 : count));
    track("reaction_sent", { contentId, reaction });
  };

  return (
    <div className="reaction-panel">
      <div><span className="live-pulse" /> <strong>Audience pulse</strong><small>Reactions update live</small></div>
      <div className="reaction-list">
        {reactions.map((reaction, index) => (
          <button key={reaction} onClick={() => react(reaction, index)} aria-label={`React with ${reaction}`}>
            <span>{reaction}</span>{counts[index].toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}
