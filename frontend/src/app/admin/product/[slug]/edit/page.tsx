'use client';

import { useRouter, useParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  currency?: string;
  stock: number;
  category: string;
  diameterInches?: number;
  heightInches?: number;
  weightLbs?: number;
  material?: string;
  finish?: string;
  includedItems?: string;
  thumbnail?: string | null;
  images?: string[];
};

type UploadResponse = {
  thumbnail: string | null;
  images: string[];
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slugParam = params.slug;

  // same state as add-product page
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [stock, setStock] = useState('0');
  const [category, setCategory] = useState('');

  const [diameterInches, setDiameterInches] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [material, setMaterial] = useState('');
  const [finish, setFinish] = useState('');
  const [includedItems, setIncludedItems] = useState('');

  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState<string | null>(null);

  // load product data
  useEffect(() => {
    async function load() {
      const res = await fetch(
  `/api/products/${encodeURIComponent(slugParam)}`,
);

      if (!res.ok) {
        setLoading(false);
        return;
      }
      const p: Product = await res.json();
      setProductId(p.id);
      setSlug(p.slug);
      setName(p.name);
      setShortDescription(p.shortDescription || '');
      setDescription(p.description || '');
      setPrice(String(p.price));
      setCurrency(p.currency || 'USD');
      setStock(String(p.stock ?? 0));
      setCategory(p.category || '');
      setDiameterInches(p.diameterInches ? String(p.diameterInches) : '');
      setHeightInches(p.heightInches ? String(p.heightInches) : '');
      setWeightLbs(p.weightLbs ? String(p.weightLbs) : '');
      setMaterial(p.material || '');
      setFinish(p.finish || '');
      setIncludedItems(p.includedItems || '');
      setExistingThumbnail(p.thumbnail || null);
      setExistingImages(p.images || []);
      setLoading(false);
    }
    load();
  }, [slugParam]);

  // helper to turn "/uploads/..." into full URL
  function resolveImageUrl(path?: string | null) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `/api${path.startsWith('/') ? path : `/${path}`}`;

  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!productId) return;
    if (!slug || !name || !price) {
      alert('Slug, name and price are required');
      return;
    }
    setSubmitting(true);

    try {
      // upload new images if any
      let thumbnailPath: string | undefined = existingThumbnail || undefined;
      let imagesPaths: string[] | undefined = existingImages;

      if (thumbnailFile || (galleryFiles && galleryFiles.length > 0)) {
        const formData = new FormData();
        if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
        if (galleryFiles) {
          Array.from(galleryFiles).forEach((file) =>
            formData.append('gallery', file),
          );
        }

        const uploadRes = await fetch(
  '/api/upload/product-images',
  { method: 'POST', body: formData },
);

        if (!uploadRes.ok) throw new Error('Image upload failed');
        const data: UploadResponse = await uploadRes.json();
        if (data.thumbnail) thumbnailPath = data.thumbnail;
        if (data.images && data.images.length > 0) {
          imagesPaths = data.images;
        }
      }

      // PATCH product by id
      const updateRes = await fetch(
  `/api/products/${productId}`,
  {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug,
            name,
            shortDescription: shortDescription || null,
            description: description || null,
            price: Number(price),
            currency,
            stock: Number(stock) || 0,
            category,
            diameterInches: diameterInches ? Number(diameterInches) : null,
            heightInches: heightInches ? Number(heightInches) : null,
            weightLbs: weightLbs ? Number(weightLbs) : null,
            material: material || null,
            finish: finish || null,
            includedItems: includedItems || null,
            thumbnail: thumbnailPath,
            images: imagesPaths,
          }),
        },
      );

      if (!updateRes.ok) {
        const errText = await updateRes.text();
        console.error(errText);
        throw new Error('Updating product failed');
      }

      router.push(`/admin/category/${category}`);
      router.refresh();
    } catch (err: any) {
      alert(err.message ?? 'Something went wrong while updating product');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-sm text-slate-600">Loading product…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        Edit product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Short description
          </label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        {/* Stock and category */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Stock
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Category slug
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Diameter (inches)
            </label>
            <input
              type="number"
              value={diameterInches}
              onChange={(e) => setDiameterInches(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Height (inches)
            </label>
            <input
              type="number"
              value={heightInches}
              onChange={(e) => setHeightInches(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Weight (lbs)
            </label>
            <input
              type="number"
              value={weightLbs}
              onChange={(e) => setWeightLbs(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Material / finish / items */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Material
            </label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Finish
            </label>
            <input
              type="text"
              value={finish}
              onChange={(e) => setFinish(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Included items
            </label>
            <input
              type="text"
              value={includedItems}
              onChange={(e) => setIncludedItems(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Thumbnail with preview + replace/delete */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Thumbnail
          </label>

          {existingThumbnail ? (
            <div className="flex items-center gap-4">
              <img
                src={resolveImageUrl(existingThumbnail)}
                alt="Thumbnail"
                className="h-24 w-24 rounded-lg object-cover border border-slate-200"
              />
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  onClick={() => {
                    const input = document.getElementById(
                      'thumbnail-input',
                    ) as HTMLInputElement | null;
                    input?.click();
                  }}
                >
                  Replace thumbnail
                </button>
                <button
                  type="button"
                  className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setExistingThumbnail(null);
                    setThumbnailFile(null);
                  }}
                >
                  Delete thumbnail
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No thumbnail set.</p>
          )}

          <input
            id="thumbnail-input"
            type="file"
            accept="image/*"
            className="block w-full text-sm"
            onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Gallery images with delete + add */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Gallery images
          </label>

          {existingImages.length === 0 ? (
            <p className="text-xs text-slate-500">No gallery images yet.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img, index) => (
                <div key={img} className="relative">
                  <img
                    src={resolveImageUrl(img)}
                    alt={`Gallery image ${index + 1}`}
                    className="h-20 w-20 rounded-lg object-cover border border-slate-200"
                  />
                  <button
                    type="button"
                    className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow hover:bg-red-50"
                    onClick={() => {
                      setExistingImages((prev) =>
                        prev.filter((x) => x !== img),
                      );
                    }}
                    aria-label="Delete image"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
              onClick={() => {
                const input = document.getElementById(
                  'gallery-input',
                ) as HTMLInputElement | null;
                input?.click();
              }}
            >
              <span>＋</span>
              <span>Add images</span>
            </button>

            <input
              id="gallery-input"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => setGalleryFiles(e.target.files)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-amber-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </main>
  );
}
