import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminContentPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') return <p>Zugriff verweigert.</p>;

  const [movies, series] = await Promise.all([prisma.movie.findMany(), prisma.series.findMany()]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin: Content Management</h1>
      <p className="text-zinc-400">CRUD-Endpunkte unter /api/admin/content.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded bg-card p-4"><h2 className="font-semibold">Filme ({movies.length})</h2></div>
        <div className="rounded bg-card p-4"><h2 className="font-semibold">Serien ({series.length})</h2></div>
      </div>
    </div>
  );
}
