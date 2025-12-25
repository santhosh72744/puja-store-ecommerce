'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../hooks/useCart';

function NavbarContent() {
  const pathname = usePathname();

  // render only on home page
  if (pathname !== '/') {
    return null;
  }

  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';
  const [search, setSearch] = useState(initialQ);

  const { totalQuantity } = useCart();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-pink-500" />

      <nav className="backdrop-blur-xl bg-white/70 border-b border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center gap-4">
          {/* Logo + brand */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-400 to-pink-500 flex items-center justify-center shadow-md">
              <span className="text-xl">🪔</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-slate-900">
                Sri Lakshmi Durga Puja Store
              </p>
              <p className="text-[11px] text-slate-500">
                Pure · Fast · Devotional
              </p>
            </div>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSubmit}
            className="hidden sm:flex flex-1 justify-center"
          >
            <div className="relative w-full max-w-xl">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                🔍
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search idols, diyas, agarbattis, pooja kits..."
                className="w-full rounded-full border border-orange-100 bg-white/70 pl-8 pr-24 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/80 focus:border-orange-400 shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-1.5 text-xs font-semibold text-white shadow hover:brightness-105 transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-3 text-xs font-medium">
            <button className="hidden md:inline-flex items-center rounded-full px-3 py-1.5 text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition">
              Orders
            </button>
            <button className="hidden md:inline-flex items-center rounded-full px-3 py-1.5 text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition">
              Login
            </button>

            <Link
              href="/cart"
              className="relative inline-flex items-center rounded-full bg-slate-900 text-white px-3 py-1.5 shadow hover:bg-slate-800 transition"
            >
              <span className="text-sm mr-1.5">🛒</span>
              <span className="text-xs font-semibold">Cart</span>
              <span className="ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold">
                {totalQuantity}
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
