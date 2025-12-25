'use client';

import { useEffect, useState } from 'react';

type Slide = {
  id: number;
  title: string;
  subtitle: string;
  badge?: string;
  gradient: string;
};

const slides: Slide[] = [
  {
    id: 1,
    title: 'Daily Pooja Essentials – Flat 20% OFF',
    subtitle: 'Agarbattis, diyas, oil, cotton wicks & more. Auto-delivery options available.',
    badge: 'Today only',
    gradient: 'from-orange-600 via-amber-500 to-yellow-400',
  },
  {
    id: 2,
    title: 'Festival Ready Combo Kits',
    subtitle: 'Curated kits for Ganesh Chaturthi, Navratri, Diwali and more – starting at ₹199.',
    badge: 'Festive',
    gradient: 'from-rose-600 via-orange-500 to-amber-400',
  },
  {
    id: 3,
    title: 'Free Delivery on Orders Above ₹999',
    subtitle: 'Stock up once, perform pooja peacefully all month.',
    badge: 'Limited',
    gradient: 'from-emerald-600 via-lime-500 to-amber-400',
  },
];

export default function OffersCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="w-full bg-slate-900">
      <div className="relative w-full overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === active ? 'opacity-100' : 'opacity-0'
            } bg-gradient-to-r ${slide.gradient}`}
          >
            <div className="h-[260px] md:h-[320px] lg:h-[360px] w-full">
              <div className="h-full w-full bg-black/25">
                <div className="max-w-7xl mx-auto h-full px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="max-w-xl text-white">
                    {slide.badge && (
                      <span className="inline-flex items-center rounded-full bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide mb-3">
                        {slide.badge}
                      </span>
                    )}
                    <h2 className="text-2xl md:text-3xl font-semibold leading-snug mb-2">
                      {slide.title}
                    </h2>
                    <p className="text-sm md:text-[13px] text-orange-50/90 mb-4">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs">
                      <button className="rounded-full bg-white text-slate-900 px-4 py-1.5 font-semibold hover:bg-slate-100">
                        Shop offer
                      </button>
                      <button className="rounded-full border border-white/70 text-white px-4 py-1.5 hover:bg-white/10">
                        View all combos
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-[11px] text-orange-50/80">
                    <p>✨ Temple-grade quality</p>
                    <p>🚚 Fast delivery</p>
                    <p>🔔 Real-time stock (coming soon)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

    
        <div className="invisible">
          <div className="h-[260px] md:h-[320px] lg:h-[360px]" />
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === active ? 'w-6 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
