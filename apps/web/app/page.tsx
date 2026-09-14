import { EventHome } from "@/components/event-home";
import { featuredEvent } from "@/lib/events";

export default function HomePage() {
  return (
    <main>
      <EventHome event={featuredEvent} />
    </main>
  );
}
