'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export function Navbar() {
  const { data } = useSession();
  return (
    <header className="sticky top-0 z-10 bg-black/70 backdrop-blur border-b border-zinc-800">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-accent">StreamVault</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/search">Suchen</Link>
          <Link href="/profile">Profile</Link>
          {data?.user?.role === 'ADMIN' && <Link href="/admin/content">Admin</Link>}
          {data?.user ? (
            <button onClick={() => signOut({ callbackUrl: '/login' })}>Logout</button>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
