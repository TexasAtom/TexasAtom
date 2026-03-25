import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function TitleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const movie = await prisma.movie.findUnique({ where: { id }, include: { genres: { include: { genre: true } } } });
  const series = movie
    ? null
    : await prisma.series.findUnique({ where: { id }, include: { genres: { include: { genre: true } }, seasons: { include: { episodes: true } } } });

  if (!movie && !series) return <p>Inhalt nicht gefunden.</p>;
  const item = movie ?? series;

  return (
    <article className="space-y-6">
      <img src={item!.backdropUrl} alt={item!.title} className="h-64 w-full rounded-xl object-cover md:h-96" />
      <h1 className="text-4xl font-bold">{item!.title}</h1>
      <p className="max-w-3xl text-zinc-300">{item!.description}</p>
      <div className="flex flex-wrap gap-2 text-sm text-zinc-400">
        {'genres' in item! && item!.genres.map((g) => <span key={g.genreId} className="rounded bg-zinc-800 px-2 py-1">{g.genre.name}</span>)}
      </div>
      <Link href={`/watch/${item!.id}`} className="inline-block rounded bg-accent px-4 py-2 font-semibold text-black">Jetzt abspielen</Link>
      {series && (
        <div>
          <h2 className="mb-2 text-2xl">Episoden</h2>
          {series.seasons.map((season) => (
            <div key={season.id} className="mb-4 rounded bg-card p-4">
              <h3 className="font-semibold">{season.title}</h3>
              <ul className="mt-2 space-y-1 text-sm text-zinc-300">
                {season.episodes.map((e) => (
                  <li key={e.id}>E{e.number}: {e.title} ({e.runtimeMin} min)</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
