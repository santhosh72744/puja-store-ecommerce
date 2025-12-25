// src/app/admin/category/[slug]/CategoryActions.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CategoryActions({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this category? This cannot be undone.')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${id}`, {
  method: 'DELETE',
});

      if (!res.ok) throw new Error('Failed to delete');
      router.push('/admin');
      router.refresh();
    } catch (e) {
      alert('Error deleting category');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
    >
      {loading ? 'Deleting...' : 'Delete category'}
    </button>
  );
}
