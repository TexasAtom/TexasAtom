import { prisma } from '@/lib/prisma';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; genre?: string }> }) {
  const params = await searchParams;
  const q = params.q ?? '';
  const genre = params.genre ?? '';

  const movies = await prisma.movie.findMany({
    where: {
      title: { contains: q, mode: 'insensitive' },
      genres: genre ? { some: { genre: { slug: genre } } } : undefined
    },
    take: 30
  });

  return (
    <div className="space-y-5">
      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Titel suchen" className="flex-1" />
        <input name="genre" defaultValue={genre} placeholder="Genre-Slug" />
        <button className="rounded bg-accent px-4 py-2 text-black">Suchen</button>
      </form>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {movies.map((m) => (
          <a key={m.id} href={`/title/${m.id}`} className="rounded bg-card p-2">
            <img src={m.posterUrl} alt={m.title} className="aspect-[2/3] w-full rounded object-cover" />
            <p className="pt-2">{m.title}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
