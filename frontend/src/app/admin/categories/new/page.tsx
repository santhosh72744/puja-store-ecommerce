'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/categories`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, slug, description }),
  }
);


      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? 'Failed to create category');
      }

      router.push('/admin');        // back to list
      router.refresh();             // reload categories
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">
        Add category
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Idols & Statues"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Slug
          </label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="idols-and-statues"
            required
          />
          <p className="mt-1 text-xs text-slate-500">
            Used in URL, for example /category/idols-and-statues
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save category'}
        </button>
      </form>
    </main>
  );
}
