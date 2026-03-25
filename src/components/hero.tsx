import Link from 'next/link';

export function Hero({ title, description, id }: { title: string; description: string; id: string }) {
  return (
    <section className="rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-700 p-8 md:p-12">
      <p className="text-accent text-sm uppercase">Featured Spotlight</p>
      <h1 className="mt-2 text-4xl font-bold">{title}</h1>
      <p className="mt-3 max-w-2xl text-zinc-200">{description}</p>
      <Link href={`/title/${id}`} className="mt-6 inline-block rounded bg-accent px-5 py-2 font-semibold text-black">Details ansehen</Link>
    </section>
  );
}
