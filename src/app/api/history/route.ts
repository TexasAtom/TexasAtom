import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const historySchema = z.object({ profileId: z.string(), contentType: z.enum(['MOVIE', 'SERIES']), contentId: z.string(), progressSec: z.number().int().min(0).default(0) });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const parsed = historySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  await prisma.viewingHistory.create({ data: parsed.data });
  const cont = await prisma.continueWatching.upsert({
    where: {
      profileId_contentType_contentId: {
        profileId: parsed.data.profileId,
        contentType: parsed.data.contentType,
        contentId: parsed.data.contentId
      }
    },
    update: { progressSec: parsed.data.progressSec },
    create: parsed.data
  });

  return NextResponse.json(cont);
}
