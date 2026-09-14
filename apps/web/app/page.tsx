import { DiscoverGrid } from "@/components/discover-grid";
import { Hero } from "@/components/hero";
import { UpcomingRail } from "@/components/upcoming-rail";
import { getContents } from "@/lib/data";
import { featureFlags } from "@/lib/feature-flags";

export default async function HomePage() {
  const contents = await getContents();
  const liveContent = contents.find((content) => content.isLive) ?? contents[0];

  return (
    <main>
      <Hero content={liveContent} />
      {featureFlags.discoveryRail && <UpcomingRail contents={contents.filter((content) => content.kind === "live")} />}
      <DiscoverGrid contents={contents} />
    </main>
  );
}
