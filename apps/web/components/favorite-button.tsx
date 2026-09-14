"use client";

import { track } from "@stagelog/analytics";
import { Button, IconButton } from "@stagelog/ui";
import { useSyncExternalStore } from "react";
import { readFavorites, toggleFavorite } from "@/lib/favorites";
import { BookmarkIcon } from "./icons";

type FavoriteButtonProps = {
  contentId: string;
  source: "card" | "detail";
  compact?: boolean;
};

export function FavoriteButton({ contentId, source, compact = false }: FavoriteButtonProps) {
  const saved = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("stagelog:favorites-changed", onStoreChange);
      window.addEventListener("storage", onStoreChange);
      return () => {
        window.removeEventListener("stagelog:favorites-changed", onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    () => readFavorites().includes(contentId),
    () => false,
  );

  const handleClick = () => {
    const next = toggleFavorite(contentId);
    const isSaved = next.includes(contentId);
    track(isSaved ? "favorite_added" : "favorite_removed", { contentId, source });
  };

  if (compact) {
    return (
      <IconButton
        label={saved ? "Remove saved show" : "Save show"}
        aria-pressed={saved}
        onClick={handleClick}
      >
        <BookmarkIcon fill={saved ? "currentColor" : "none"} />
      </IconButton>
    );
  }

  return (
    <Button variant={saved ? "secondary" : "primary"} onClick={handleClick} aria-pressed={saved}>
      <BookmarkIcon fill={saved ? "currentColor" : "none"} />
      {saved ? "Saved" : "Save show"}
    </Button>
  );
}
