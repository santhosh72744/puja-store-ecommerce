'use client';

import { useRouter, useParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

type UploadResponse = {
  thumbnail: string | null;
  images: string[];
};

export default function NewProductPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const categorySlug = params.slug; // ex: "puja-thali-kits"

  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [stock, setStock] = useState('0');

  // extra fields
  const [diameterInches, setDiameterInches] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [material, setMaterial] = useState('');
  const [finishing, setFinishing] = useState('');
  const [includedItems, setIncludedItems] = useState('');

  // files + previews
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setThumbnailFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    } else {
      setThumbnailPreview(null);
    }
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) {
      setGalleryFiles([]);
      setGalleryPreviews([]);
      return;
    }
    const urls = files.map((f) => URL.createObjectURL(f));
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [...prev, ...urls]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!slug || !name || !price) {
      alert('Slug, name and price are required');
      return;
    }

    setSubmitting(true);

    try {
      // 1) upload images (if any)
      let thumbnailPath: string | undefined;
      let imagesPaths: string[] | undefined;

      if (thumbnailFile || galleryFiles.length > 0) {
        const formData = new FormData();
        if (thumbnailFile) {
          formData.append('thumbnail', thumbnailFile);
        }
        if (galleryFiles.length > 0) {
          galleryFiles.forEach((file) => formData.append('gallery', file));
        }

        const uploadRes = await fetch(
          'http://localhost:3000/upload/product-images',
          {
            method: 'POST',
            body: formData,
          },
        );

        if (!uploadRes.ok) {
          throw new Error('Image upload failed');
        }

        const data: UploadResponse = await uploadRes.json();
        if (data.thumbnail) thumbnailPath = data.thumbnail;
        if (data.images && data.images.length > 0) imagesPaths = data.images;
      }

      // 2) create product row
      const createRes = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          name,
          shortDescription: shortDescription || null,
          description: description || null,
          price: Number(price),
          currency,
          stock: Number(stock) || 0,
          category: categorySlug,

          diameterInches: diameterInches ? Number(diameterInches) : null,
          heightInches: heightInches ? Number(heightInches) : null,
          weightLbs: weightLbs ? Number(weightLbs) : null,
          material: material || null,
          finish: finishing || null,
          includedItems: includedItems || null,

          thumbnail: thumbnailPath,
          images: imagesPaths,
        }),
      });

      if (!createRes.ok) {
        const errText = await createRes.text();
        console.error(errText);
        throw new Error('Creating product failed');
      }

      router.push(`/admin/category/${categorySlug}`);
      router.refresh();
    } catch (err: any) {
      alert(err.message ?? 'Something went wrong while saving product');
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
              Admin · New product
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Add product in “{categorySlug}”
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Fill in details, upload images and save to publish this item.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70"
        >
          {/* basic info */}
          <section className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Name
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Slug
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                 
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600">
                Short description
              </label>
              <textarea
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600">
                Full description
              </label>
              <textarea
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </section>

          {/* price + stock + currency */}
          <section className="space-y-3 rounded-xl bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Pricing & stock
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Currency
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* specs */}
          <section className="space-y-3 rounded-xl bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Specifications
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Diameter (inches)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={diameterInches}
                  onChange={(e) => setDiameterInches(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Height (inches)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Material
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Finishing
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={finishing}
                  onChange={(e) => setFinishing(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600">
                Included items
              </label>
              <textarea
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                rows={3}
                value={includedItems}
                onChange={(e) => setIncludedItems(e.target.value)}
              
              />
            </div>
          </section>

          {/* images */}
          <section className="space-y-3 rounded-xl bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Images
            </p>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Thumbnail */}
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Thumbnail image
                </label>

                <input
                  id="thumbnail-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailChange}
                />

                <div className="mt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById(
                        'thumbnail-input',
                      ) as HTMLInputElement | null;
                      input?.click();
                    }}
                    className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    Choose file
                  </button>
                  <span className="text-[11px] text-slate-500">
                    {thumbnailFile ? thumbnailFile.name : 'No file chosen'}
                  </span>
                </div>

                {thumbnailPreview && (
                  <div className="relative mt-2 inline-block">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="h-20 w-20 rounded-lg object-cover border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={clearThumbnail}
                      className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white shadow hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <p className="mt-1 text-[11px] text-slate-500">
                  Main image shown on product card and detail page.
                </p>
              </div>

              {/* Gallery */}
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Gallery images
                </label>

                <input
                  id="gallery-input"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleGalleryChange}
                />

                <div className="mt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById(
                        'gallery-input',
                      ) as HTMLInputElement | null;
                      input?.click();
                    }}
                    className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    Choose files
                  </button>
                  <span className="text-[11px] text-slate-500">
                    {galleryFiles.length > 0
                      ? `${galleryFiles.length} file(s) selected`
                      : 'No files chosen'}
                  </span>
                </div>

                {galleryPreviews.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {galleryPreviews.map((url, i) => (
                      <div key={url} className="relative inline-block">
                        <img
                          src={url}
                          alt={`Gallery preview ${i + 1}`}
                          className="h-16 w-16 rounded-lg object-cover border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="mt-1 text-[11px] text-slate-500">
                  Optional extra photos (close-ups, angles, packaging).
                </p>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center rounded-full bg-amber-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Saving...' : 'Save product'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
