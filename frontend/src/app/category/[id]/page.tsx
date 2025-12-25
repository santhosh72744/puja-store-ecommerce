// src/app/category/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { apiUrl } from "@/app/lib/api";


type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  category: string;
  thumbnail?: string | null;
  stock?: number;
};

async function getProductsByCategory(id: string): Promise<Product[]> {
  const res = await fetch(
  apiUrl(`/products?category=${encodeURIComponent(id)}`),
  { cache: 'no-store' },
);

  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

type CategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const products = await getProductsByCategory(id);

  const heading = decodeURIComponent(id).replace(/-/g, ' ');

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-10">
        {/* Centered, nicer heading */}
        <div className="mb-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-500">
            Browse category
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {heading}
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">
            Handpicked brass and copper sets for daily worship, festive rituals and gifting.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="mt-8 text-sm text-slate-500">
            No products found in this category yet.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="block"
              >
                <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">
                  {/* image */}
                  <div className="relative h-56 w-full bg-slate-100">
                    {p.thumbnail && (
                      <Image
                    src={apiUrl(p.thumbnail)}
                     alt={p.name}
                     fill
                    className="object-contain bg-white"
                    unoptimized
                     />


                    )}
                  </div>

                  {/* content */}
                  <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                    <p className="inline-flex items-center self-start rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      In stock
                    </p>

                    <h2 className="mt-3 line-clamp-2 text-sm font-semibold text-slate-900">
                      {p.name}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-xs text-slate-600">
                      {p.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Price
                        </p>
                        <p className="text-base font-semibold text-amber-700">
                          ₹{p.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500">Puja kit</p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
