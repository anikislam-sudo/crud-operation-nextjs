
import ItemList from "./components/ItemList";
import { getItems } from "@/lib/db";

export default async function Home() {
  const { items = [], error } = await getItems();
  console.log("Fetched Items:", items);

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <main className="w-full max-w-[1220px] mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl text-center font-bold mb-4">My Next.js App</h1>
    <ItemList initialItems={items} />
    </main>
  );
}
