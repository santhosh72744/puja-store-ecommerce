'use client';

import { apiUrl } from "@/app/lib/api";

import Image from 'next/image';
import { useCartContext } from '../context/CartContext';

export default function CartPage() {
  const { cart, totalQuantity, totalPrice, loading, reload } = useCartContext();

  if (loading && !cart) {
    return <main className="px-4 py-10">Loading cart...</main>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return <main className="px-4 py-10">Your cart is empty.</main>;
  }

  const handleIncrease = async (itemId: string) => {
    await fetch(apiUrl(`/cart/items/${itemId}/increase`), {
  method: 'PATCH',
});

    await reload();
  };

  const handleDecrease = async (itemId: string) => {
    await fetch(apiUrl(`/cart/items/${itemId}/decrease`), {
  method: 'PATCH',
});

    await reload();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">
          Shopping Cart
        </h1>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          {/* LEFT: items list */}
          <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            {cart.items.map((item: any) => {
              const product = item.product;
              const thumbUrl = product?.thumbnail
  ? apiUrl(product.thumbnail)
  : null;


              return (
                <article
                  key={item.id}
                  className="flex gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  {/* Image */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                    {thumbUrl ? (
                      <Image
                        src={thumbUrl}
                        alt={product?.name || 'Product image'}
                        width={96}
                        height={96}
                        className="h-full w-full object-contain bg-white"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[11px] text-slate-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1 text-sm">
                    <p className="font-medium text-slate-900">
                      {product?.name || 'Product'}
                    </p>
                    <p className="text-xs text-emerald-700">In stock</p>

                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
                      <div className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-1">
                        <button
                          type="button"
                          onClick={() => handleDecrease(item.id)}
                          className="h-7 w-7 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          −
                        </button>
                        <span className="mx-2 w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncrease(item.id)}
                          className="h-7 w-7 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                      <span>Qty</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right text-sm">
                    <p className="font-semibold text-slate-900">
                      ₹{Number(item.unitPrice) * item.quantity}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      ₹{Number(item.unitPrice)} each
                    </p>
                  </div>
                </article>
              );
            })}
          </section>

          {/* RIGHT: order summary */}
          <aside className="space-y-3 self-start rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-800">
              Subtotal ({totalQuantity} items):{' '}
              <span className="font-semibold">₹{totalPrice}</span>
            </p>

            <button
              type="button"
              className="w-full rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-600"
            >
              Proceed to Buy
            </button>

            <p className="text-[11px] text-slate-500">
              Taxes and shipping will be calculated at checkout.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
