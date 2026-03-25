import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  type: z.enum(['MOVIE', 'SERIES']),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  releaseYear: z.number().int(),
  maturity: z.string(),
  backdropUrl: z.string().url(),
  posterUrl: z.string().url(),
  trailerUrl: z.string().url(),
  runtimeMin: z.number().int().optional(),
  tags: z.array(z.string()).default([])
});

const guard = async () => {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'ADMIN';
};

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  if (parsed.data.type === 'MOVIE') {
    const movie = await prisma.movie.create({ data: { ...parsed.data, runtimeMin: parsed.data.runtimeMin ?? 100 } });
    return NextResponse.json(movie, { status: 201 });
  }

  const series = await prisma.series.create({ data: { ...parsed.data } });
  return NextResponse.json(series, { status: 201 });
}
