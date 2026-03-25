import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';
  const genre = searchParams.get('genre') ?? '';

  const [movies, series] = await Promise.all([
    prisma.movie.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { tags: { hasSome: q ? [q] : [] } }
        ],
        genres: genre ? { some: { genre: { slug: genre } } } : undefined
      },
      include: { genres: { include: { genre: true } } }
    }),
    prisma.series.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { tags: { hasSome: q ? [q] : [] } }
        ],
        genres: genre ? { some: { genre: { slug: genre } } } : undefined
      },
      include: { genres: { include: { genre: true } } }
    })
  ]);

  return NextResponse.json({ movies, series });
}
