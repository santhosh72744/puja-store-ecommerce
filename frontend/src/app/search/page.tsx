// app/search/page.tsx
import { apiUrl } from "@/app/lib/api";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  currency: string;
  stock: number;
  thumbnail?: string | null;
};

async function getProducts(q: string): Promise<Product[]> {
  if (!q) return [];

  const res = await fetch(
    apiUrl(`/products?q=${encodeURIComponent(q)}`)
  );

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const products = query ? await getProducts(query) : [];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold text-slate-900">
          Search results for “{query}”
        </h1>

        {(!query || products.length === 0) && (
          <p className="mt-4 text-sm text-slate-500">
            {query
              ? "No products found. Try a different keyword."
              : "Type something in the search bar to see results."}
          </p>
        )}

        {products.length > 0 && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <a
                key={p.id}
                href={`/product/${p.slug}`}
                className="block"
              >
                <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">
                  {/* image */}
                  <div className="relative w-full overflow-hidden bg-slate-100 rounded-t-3xl">
                    <div className="relative w-full pt-[75%]">
                      {p.thumbnail && (
                        <img
                          src={apiUrl(p.thumbnail)}
                          alt={p.name}
                          className="absolute inset-0 h-full w-full object-contain bg-white p-3"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                    <p className="inline-flex items-center self-start rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      {p.stock > 0 ? "In stock" : "Out of stock"}
                    </p>

                    <h2 className="mt-3 line-clamp-2 text-sm font-semibold text-slate-900">
                      {p.name}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-xs text-slate-600">
                      {p.shortDescription ?? p.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Price
                        </p>
                        <p className="text-base font-semibold text-amber-700">
                          {(p.currency === "USD" ? "$" : "₹")}
                          {p.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
