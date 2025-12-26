// src/app/admin/category/[slug]/page.tsx
import Link from 'next/link';
import { CategoryActions } from './CategoryActions';

type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  currency?: string;
};

async function getCategory(slug: string): Promise<Category | null> {
 const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`,
  { cache: 'no-store' }
);



  if (!res.ok) {
    return null;
  }

  return res.json();
}

async function getProducts(slug: string): Promise<Product[]> {
const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/products?category=${encodeURIComponent(slug)}`,
  { cache: 'no-store' }
);



  if (!res.ok) {
    return [];
  }

  return res.json();
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminCategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const [category, products] = await Promise.all([
    getCategory(slug),
    getProducts(slug),
  ]);

  if (!category) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-sm text-red-600">Category not found.</p>
        <Link
          href="/admin"
          className="mt-4 inline-block text-sm text-amber-700"
        >
          ← Back to categories
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-sm text-slate-500">
              {category.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/category/${category.slug}/edit`}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>
          <CategoryActions id={category.id} />
          <Link
            href="/admin"
            className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-700"
          >
            ← All categories
          </Link>
        </div>
      </header>

      <section className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Products</h2>
        <Link
          href={`/admin/category/${category.slug}/products/new`}
          className="rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700"
        >
          + Add product
        </Link>
      </section>

      {products.length === 0 ? (
        <p className="text-sm text-slate-500">
          No products in this category yet.
        </p>
      ) : (
        <ul className="space-y-2">
  {products.map((p) => (
    <li
      key={p.id}
      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
    >
      <div className="flex-1">
        <p className="font-medium text-slate-900">{p.name}</p>
        <p className="text-xs text-slate-500">
          {(p.currency === 'USD' ? '$' : '₹') + p.price} · Stock: {p.stock}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Public product page */}
        <Link
          href={`/product/${p.slug}`}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
        >
          View
        </Link>

        {/* Admin edit page */}
        <Link
          href={`/admin/product/${p.slug}/edit`}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
        >
          Edit
        </Link>
      </div>
    </li>
  ))}
</ul>

      )}
    </main>
  );
}
