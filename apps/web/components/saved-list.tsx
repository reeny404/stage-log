"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { readFavorites } from "@/lib/favorites";
import type { StageContent } from "@/lib/types";
import { ContentCard } from "./content-card";

export function SavedList({ contents }: { contents: StageContent[] }) {
  const serializedIds = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("stagelog:favorites-changed", onStoreChange);
      window.addEventListener("storage", onStoreChange);
      return () => {
        window.removeEventListener("stagelog:favorites-changed", onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    () => JSON.stringify(readFavorites()),
    () => "[]",
  );
  const favoriteIds = JSON.parse(serializedIds) as string[];

  const saved = contents.filter((content) => favoriteIds.includes(content.id));
  if (!saved.length) {
    return (
      <div className="empty-state empty-state--saved">
        <span className="empty-state__signal" />
        <h2>Your next favorite is waiting</h2>
        <p>Save a live or replay and it will stay close for later.</p>
        <Link className="text-link" href="/#discover">Explore shows</Link>
      </div>
    );
  }

  return <div className="content-grid">{saved.map((content) => <ContentCard key={content.id} content={content} />)}</div>;
}
