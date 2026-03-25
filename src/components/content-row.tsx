import Link from 'next/link';

type CardItem = { id: string; title: string; posterUrl: string; subtitle: string };

export function ContentRow({ title, items }: { title: string; items: CardItem[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {items.map((item) => (
          <Link key={item.id} href={`/title/${item.id}`} className="group rounded-lg bg-card p-2 transition hover:-translate-y-1 hover:bg-zinc-700">
            <img src={item.posterUrl} alt={item.title} className="aspect-[2/3] w-full rounded object-cover" />
            <div className="pt-2">
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-zinc-400">{item.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
