import { prisma } from '@/lib/prisma';

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await prisma.movie.findUnique({ where: { id } });
  const series = movie ? null : await prisma.series.findUnique({ where: { id }, include: { seasons: { include: { episodes: true } } } });
  const videoUrl = movie?.trailerUrl ?? series?.seasons[0]?.episodes[0]?.videoUrl ?? series?.trailerUrl;
  if (!videoUrl) return <p>Video nicht verfügbar.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Player</h1>
      <div className="aspect-video overflow-hidden rounded-xl">
        <iframe src={videoUrl} className="h-full w-full" allowFullScreen title="video-player" />
      </div>
    </div>
  );
}
