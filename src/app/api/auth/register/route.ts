import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validators';

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return NextResponse.json({ error: 'Email already used' }, { status: 409 });

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash: await hash(parsed.data.password, 12),
      name: parsed.data.name,
      profiles: { create: [{ name: 'Hauptprofil' }] }
    }
  });

  return NextResponse.json({ id: user.id }, { status: 201 });
}
