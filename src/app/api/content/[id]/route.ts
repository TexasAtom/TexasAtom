import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const movie = await prisma.movie.findUnique({ where: { id }, include: { genres: { include: { genre: true } } } });
  if (movie) return NextResponse.json({ type: 'MOVIE', data: movie });

  const series = await prisma.series.findUnique({
    where: { id },
    include: { genres: { include: { genre: true } }, seasons: { include: { episodes: true } } }
  });
  if (series) return NextResponse.json({ type: 'SERIES', data: series });

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
