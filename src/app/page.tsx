import { Hero } from '@/components/hero';
import { ContentRow } from '@/components/content-row';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  const [movies, series, trendingMovie] = await Promise.all([
    prisma.movie.findMany({ take: 12, orderBy: { createdAt: 'desc' } }),
    prisma.series.findMany({ take: 12, orderBy: { createdAt: 'desc' } }),
    prisma.movie.findFirst({ orderBy: { createdAt: 'desc' } })
  ]);

  if (!trendingMovie) return <p>Keine Inhalte vorhanden. Bitte Seed ausführen.</p>;

  return (
    <div className="space-y-8">
      <Hero title={trendingMovie.title} description={trendingMovie.description} id={trendingMovie.id} />
      <ContentRow title="Neue Filme" items={movies.map((m) => ({ id: m.id, title: m.title, posterUrl: m.posterUrl, subtitle: `${m.releaseYear} · Film` }))} />
      <ContentRow title="Aktuelle Serien" items={series.map((s) => ({ id: s.id, title: s.title, posterUrl: s.posterUrl, subtitle: `${s.releaseYear} · Serie` }))} />
    </div>
  );
}
