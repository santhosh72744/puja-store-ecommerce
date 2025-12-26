// src/app/admin/page.tsx
import Link from 'next/link';

type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string;
};

async function getCategories(): Promise<Category[]> {
  const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/categories`,
  { cache: 'no-store' }
);


  if (!res.ok) { 
    return [];
  }
  return res.json();
}

export default async function AdminHomePage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin – Categories</h1>
          <p className="text-sm text-slate-500">
            Manage puja categories and products.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700"
        >
          + Add category
        </Link>
      </header>

      {categories.length === 0 ? (
        <p className="text-sm text-slate-500">
          No categories yet. Click &ldquo;Add category&rdquo; to create one.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    {cat.name}
                  </h2>
                  {cat.description && (
                    <p className="mt-1 text-xs text-slate-500">
                      {cat.description}
                    </p>
                  )}
                  <div className="mt-2 flex gap-3 text-[11px]">
                    <Link
                      href={`/admin/category/${cat.slug}`}
                      className="font-medium text-amber-600 hover:text-amber-700"
                    >
                      Manage products →
                    </Link>
                    <Link
                      href={`/admin/category/${cat.slug}/edit`}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
