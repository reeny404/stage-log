"use client";

import { track } from "@stagelog/analytics";
import { useDeferredValue, useMemo, useState } from "react";
import type { ContentCategory, StageContent } from "@/lib/types";
import { ContentCard } from "./content-card";
import { SearchIcon } from "./icons";

const categories: Array<"All" | ContentCategory> = ["All", "Live", "Performance", "Documentary", "Behind"];

export function DiscoverGrid({ contents }: { contents: StageContent[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    return contents.filter((content) => {
      const matchesCategory = category === "All" || content.category === category;
      const matchesQuery = !normalized || `${content.title} ${content.artist}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, contents, deferredQuery]);

  const handleCategory = (nextCategory: (typeof categories)[number]) => {
    setCategory(nextCategory);
    track("filter_changed", { category: nextCategory });
  };

  return (
    <section className="section" id="discover" aria-labelledby="discover-title">
      <div className="section-heading section-heading--stackable">
        <div>
          <span className="kicker">CURATED FOR RIGHT NOW</span>
          <h2 id="discover-title">Discover your next replay</h2>
        </div>
        <label className="search-field">
          <SearchIcon />
          <span className="sr-only">Search shows or artists</span>
          <input
            type="search"
            placeholder="Search shows or artists"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                track("search_submitted", { queryLength: query.length, resultCount: filtered.length });
              }
            }}
          />
        </label>
      </div>
      <div className="filter-row" aria-label="Content categories">
        {categories.map((item) => (
          <button
            className={item === category ? "filter-pill filter-pill--active" : "filter-pill"}
            type="button"
            aria-pressed={item === category}
            onClick={() => handleCategory(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="content-grid">
          {filtered.map((content, index) => <ContentCard content={content} priority={index < 2} key={content.id} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state__signal" />
          <h3>No signal found</h3>
          <p>Try a different title, artist, or category.</p>
        </div>
      )}
    </section>
  );
}
