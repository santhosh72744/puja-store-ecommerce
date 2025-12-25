// src/app/admin/category/[slug]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string;
};

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/categories/${slug}`);

        if (!res.ok) throw new Error('Failed to load category');
        const data: Category = await res.json();
        setCategory(data);
        setName(data.name);
        setNewSlug(data.slug);
        setDescription(data.description ?? '');
      } catch (e) {
        alert('Error loading category');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug: newSlug, description }),
      });
      if (!res.ok) throw new Error('Failed to update');
      router.push(`/admin/category/${newSlug}`);
      router.refresh();
    } catch (e) {
      alert('Error saving changes');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!category) return;
    const ok = confirm('Delete this category? This cannot be undone.');
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/admin');
      router.refresh();
    } catch (e) {
      alert('Error deleting category');
    } finally {
      setDeleting(false);
    }
  }

  if (loading || !category) {
    return (
      <main className="mx-auto max-w-xl px-4 py-8">
        <p className="text-sm text-slate-500">Loading category...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Edit category</h1>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Slug
          </label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            required
          />
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

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </main>
  );
}
