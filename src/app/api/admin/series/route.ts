import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  seriesId: z.string(),
  seasonNumber: z.number().int(),
  seasonTitle: z.string(),
  episodeTitle: z.string(),
  synopsis: z.string(),
  episodeNumber: z.number().int(),
  runtimeMin: z.number().int(),
  videoUrl: z.string().url()
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const season = await prisma.season.upsert({
    where: { seriesId_number: { seriesId: parsed.data.seriesId, number: parsed.data.seasonNumber } },
    update: { title: parsed.data.seasonTitle },
    create: { seriesId: parsed.data.seriesId, number: parsed.data.seasonNumber, title: parsed.data.seasonTitle }
  });

  const episode = await prisma.episode.create({
    data: {
      seasonId: season.id,
      title: parsed.data.episodeTitle,
      synopsis: parsed.data.synopsis,
      number: parsed.data.episodeNumber,
      runtimeMin: parsed.data.runtimeMin,
      videoUrl: parsed.data.videoUrl
    }
  });

  return NextResponse.json(episode, { status: 201 });
}
