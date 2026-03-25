import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return <p>Bitte anmelden.</p>;

  const profiles = await prisma.profile.findMany({ where: { userId: session.user.id } });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Deine Profile</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="rounded-lg bg-card p-4">
            <img src={profile.avatarUrl ?? 'https://picsum.photos/seed/default-avatar/200/200'} className="h-20 w-20 rounded-full object-cover" alt={profile.name} />
            <p className="mt-2 font-semibold">{profile.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
