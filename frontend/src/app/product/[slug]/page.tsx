// src/app/product/[slug]/page.tsx
'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useCart } from '../../hooks/useCart';

type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  currency?: string;
  category: string;
  thumbnail?: string | null;
  images?: string[];
  diameterInches?: number;
  heightInches?: number;
  weightLbs?: number;
  material?: string;
  finish?: string;
  includedItems?: string;
  stock?: number;
};

type PageProps = {

  params: Promise<{ slug: string }>;
};

export default function ProductPage(props: PageProps) {

  const { slug } = (React as any).use(props.params) as { slug: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isHoveringMain, setIsHoveringMain] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

  const { addItem, loading } = useCart();

  useEffect(() => {
    async function load() {
    
      const res = await fetch(
        `http://localhost:3000/products/${encodeURIComponent(slug)}`,
        { cache: 'no-store' },
      );
      if (!res.ok) {
        setProduct(null);
        return;
      }
      const data: Product = await res.json();
      setProduct(data);

      const thumb = data.thumbnail ? `http://localhost:3000${data.thumbnail}` : null;
      const extras = data.images?.map((img) => `http://localhost:3000${img}`) ?? [];
      const all = [...(thumb ? [thumb] : []), ...extras.filter((url) => url !== thumb)];

      setActiveImage(all[0] ?? null);
      setActiveIndex(0);
    }
    load();
  }, [slug]);

  if (!product || !activeImage) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-sm text-slate-600">Product not found.</p>
      </main>
    );
  }

  const currencySymbol = product.currency === 'USD' ? '$' : '₹';

  const thumbnailUrl = product.thumbnail ? `http://localhost:3000${product.thumbnail}` : null;
  const galleryUrls = product.images?.map((img) => `http://localhost:3000${img}`) ?? [];

  const bottomImages = [
    ...(thumbnailUrl ? [thumbnailUrl] : []),
    ...galleryUrls.filter((url) => url !== thumbnailUrl),
  ];

  const goPrev = () => {
    if (bottomImages.length === 0) return;
    const nextIndex = (activeIndex - 1 + bottomImages.length) % bottomImages.length;
    setActiveIndex(nextIndex);
    setActiveImage(bottomImages[nextIndex]);
  };

  const goNext = () => {
    if (bottomImages.length === 0) return;
    const nextIndex = (activeIndex + 1) % bottomImages.length;
    setActiveIndex(nextIndex);
    setActiveImage(bottomImages[nextIndex]);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product.id, 1, product.price);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-10">
        {/* TOP GRID: left images + right zoom / info */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
          {/* LEFT: main image + thumbnails */}
          <div className="space-y-4">
            {/* MAIN IMAGE */}
            <button
              type="button"
              className="relative h-[340px] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-crosshair"
              onClick={() => {
                const idx = bottomImages.findIndex((url) => url === activeImage);
                if (idx >= 0) setActiveIndex(idx);
                setIsOpen(true);
                setIsZoomed(false);
              }}
              onMouseEnter={() => setIsHoveringMain(true)}
              onMouseLeave={() => setIsHoveringMain(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setCursorPos({ x, y });
              }}
            >
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-contain bg-white"
                unoptimized
              />
            </button>

            {/* THUMBNAILS */}
            {bottomImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {bottomImages.map((fullUrl, index) => {
                  const isActive = fullUrl === activeImage;
                  return (
                    <button
                      key={fullUrl}
                      type="button"
                      onClick={() => {
                        setActiveImage(fullUrl);
                        setActiveIndex(index);
                      }}
                      className={`relative h-20 w-full overflow-hidden rounded-xl bg-slate-100 border ${
                        isActive ? 'border-amber-500' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={fullUrl}
                        alt={product.name}
                        fill
                        className="object-contain bg-white"
                        unoptimized
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: zoom panel + info */}
          <div className="space-y-4">
            {isHoveringMain && (
              <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <div className="w-full h-[380px] overflow-hidden rounded-2xl bg-slate-100 border">
                  <div
                    className="w-full h-full bg-no-repeat"
                    style={{
                      backgroundImage: `url(${activeImage})`,
                      backgroundSize: '200%',
                      backgroundPosition: `${cursorPos.x}% ${cursorPos.y}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Kits
              </p>
              <h1 className="text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="text-sm text-slate-600">{product.shortDescription}</p>
              )}

              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <p className="text-2xl font-semibold text-amber-700">
                    {currencySymbol}
                    {product.price.toFixed(2)}
                  </p>
                </div>
                {typeof product.stock === 'number' && (
                  <p className="text-xs text-emerald-700">
                    In stock · Only {product.stock} left
                  </p>
                )}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-950 disabled:opacity-60"
                >
                  {loading ? 'Adding…' : 'Add to cart'}
                </button>
              </div>

              <div className="mt-3 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Free standard shipping</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span>Express shipping available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOWER SECTIONS */}
        <div className="mt-10 grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">Product Details</h2>
              {product.description && (
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {product.description}
                </p>
              )}
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">Specifications</h2>
              <dl className="mt-3 grid gap-x-6 gap-y-2 text-xs text-slate-600 md:grid-cols-2">
                {product.material && (
                  <>
                    <dt className="font-medium">Material</dt>
                    <dd>{product.material}</dd>
                  </>
                )}
                {product.finish && (
                  <>
                    <dt className="font-medium">Finish</dt>
                    <dd>{product.finish}</dd>
                  </>
                )}
                {product.heightInches && (
                  <>
                    <dt className="font-medium">Height</dt>
                    <dd>{product.heightInches}"</dd>
                  </>
                )}
                {product.diameterInches && (
                  <>
                    <dt className="font-medium">Diameter</dt>
                    <dd>{product.diameterInches}"</dd>
                  </>
                )}
                {product.weightLbs && (
                  <>
                    <dt className="font-medium">Weight</dt>
                    <dd>{product.weightLbs} lbs</dd>
                  </>
                )}
              </dl>

              {product.includedItems && (
                <div className="mt-4">
                  <h3 className="text-xs font-semibold text-slate-900">
                    What&apos;s in the box
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-700">
                    {product.includedItems}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">Delivery and Returns</h2>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                <li>Shipping: Dispatch in 1–3 business days.</li>
                <li>Returns: Eligible for return within 7 days of delivery.</li>
                <li>Delivery: Free standard delivery on all orders.</li>
              </ul>
            </div>

            <div className="grid gap-3 text-xs text-slate-700 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-900/95 p-3 text-white">
                <p className="font-semibold text-[11px]">Secure</p>
                <p className="mt-1 text-[11px]">Payments protected.</p>
              </div>
              <div className="rounded-2xl bg-slate-900/95 p-3 text-white">
                <p className="font-semibold text-[11px]">Insured</p>
                <p className="mt-1 text-[11px]">Fully insured delivery.</p>
              </div>
              <div className="rounded-2xl bg-slate-900/95 p-3 text-white">
                <p className="font-semibold text-[11px]">Artisan</p>
                <p className="mt-1 text-[11px]">Handmade in India.</p>
              </div>
            </div>
          </div>
        </div>

        
        {isOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
            onClick={() => {
              setIsOpen(false);
              setIsZoomed(false);
            }}
          >
            <div
              className="relative max-w-5xl w-full px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute -top-10 right-2 text-sm text-white/80 hover:text-white z-50"
                onClick={() => {
                  setIsOpen(false);
                  setIsZoomed(false);
                }}
              >
                ✕ Close
              </button>

              <button
                type="button"
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50
                        flex h-12 w-12 items-center justify-center
                        rounded-full bg-white/90 text-black shadow-lg hover:bg-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50
                        flex h-12 w-12 items-center justify-center
                        rounded-full bg-white/90 text-black shadow-lg hover:bg-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div
                className={`relative mx-auto h-[80vh] max-w-5xl overflow-hidden rounded-xl bg-black ${
                  isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed((z) => !z)}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className={`h-full w-full object-contain transition-transform duration-300 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
