// src/app/components/CategoryGrid.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiUrl } from '@/app/lib/api';

type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string;
};

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(apiUrl('/categories'));
        if (!res.ok) return;

        const data = await res.json();
        if (!cancelled) {
          setCategories(data);
        }
      } catch (e) {
        console.error('Failed to load categories', e);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading && categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-gradient-to-b from-slate-50 via-orange-50/20 to-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500">
              Categories
            </p>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mt-1">
              Everything for your next puja
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Select a category
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end text-[11px] text-slate-500">
            <span>✨ Curated for daily and festival rituals</span>
            <span>🔒 Secure payments · 🚚 Fast delivery</span>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/5 via-amber-400/5 to-pink-400/5 blur-2xl" />

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 p-4 text-left shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-50 text-2xl shadow-inner">
                    ✨
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center gap-1 font-medium text-slate-600 group-hover:text-orange-600 transition">
                    Browse items
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                  <span className="rounded-full border border-dashed border-slate-200 px-2 py-0.5 text-[9px] uppercase tracking-wide text-slate-400">
                    Puja category
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
