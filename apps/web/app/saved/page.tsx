import { SavedList } from "@/components/saved-list";
import { getContents } from "@/lib/data";

export const metadata = { title: "Saved shows" };

export default async function SavedPage() {
  const contents = await getContents();
  return (
    <main className="saved-page">
      <div className="page-intro"><span className="kicker">YOUR COLLECTION</span><h1>Saved signals</h1><p>A quiet shelf for every stage you want to return to.</p></div>
      <SavedList contents={contents} />
    </main>
  );
}
