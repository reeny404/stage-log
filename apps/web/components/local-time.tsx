"use client";

import { formatSchedule } from "@/lib/date";

export function LocalTime({ startsAt, compact = false }: { startsAt: string; compact?: boolean }) {
  const value = formatSchedule(startsAt);

  return <time dateTime={startsAt} suppressHydrationWarning>{compact ? value.replace(/, /g, " · ") : value}</time>;
}
