'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (!res.ok) return setError('Registrierung fehlgeschlagen');
    router.push('/login');
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-12 max-w-md space-y-4 rounded-xl bg-card p-6">
      <h1 className="text-2xl font-bold">Registrierung</h1>
      <input className="w-full" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="w-full" type="email" placeholder="E-Mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="w-full" type="password" placeholder="Passwort" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error && <p className="text-red-400">{error}</p>}
      <button className="w-full rounded bg-accent px-4 py-2 font-semibold text-black">Konto erstellen</button>
    </form>
  );
}
