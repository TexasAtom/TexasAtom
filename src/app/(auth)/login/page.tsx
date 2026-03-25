'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@streamvault.local');
  const [password, setPassword] = useState('Demo1234!');
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) return setError('Anmeldung fehlgeschlagen');
    router.push('/');
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-12 max-w-md space-y-4 rounded-xl bg-card p-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="E-Mail" className="w-full" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Passwort" className="w-full" />
      {error && <p className="text-red-400">{error}</p>}
      <button className="w-full rounded bg-accent px-4 py-2 font-semibold text-black">Einloggen</button>
      <p className="text-sm text-zinc-400">Kein Konto? <Link href="/register" className="text-accent">Registrieren</Link></p>
    </form>
  );
}
