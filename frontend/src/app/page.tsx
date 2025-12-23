// src/app/page.tsx
'use client';

import OffersCarousel from './components/OffersCarousel';
import CategoryGrid from './components/CategoryGrid';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <OffersCarousel />
      <CategoryGrid />
    </main>
  );
}
