// frontend/src/hooks/useCart.ts

'use client';

import { useEffect, useState, useCallback } from 'react';

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
};

type Cart = {
  id: string;
  cartToken: string;
  items: CartItem[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';


function getOrCreateCartToken() {
  if (typeof window === 'undefined') return '';
  let token = localStorage.getItem('cartToken');
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('cartToken', token);
  }
  return token;
}

export function useCart() {
  const [cartToken, setCartToken] = useState('');
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  // init token on client
  useEffect(() => {
    const token = getOrCreateCartToken();
    setCartToken(token);
  }, []);

  // reusable loader so page can call reload()
  const fetchCart = useCallback(
    async (overrideToken?: string) => {
      const token = overrideToken ?? cartToken;
      if (!token) return;

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/cart?cartToken=${token}`);
        const data = await res.json();
        setCart(data);
      } catch (e) {
        console.error('Failed to load cart', e);
      } finally {
        setLoading(false);
      }
    },
    [cartToken],
  );

  // load cart when token ready
  useEffect(() => {
    if (!cartToken) return;
    fetchCart(cartToken);
  }, [cartToken, fetchCart]);

  const addItem = async (
    productId: string,
    quantity: number,
    unitPrice: number,
  ) => {
    if (!cartToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/cart/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartToken, productId, quantity, unitPrice }),
      });
      const data = await res.json();
      setCart(data);
    } catch (e) {
      console.error('Failed to add item', e);
    } finally {
      setLoading(false);
    }
  };

  const totalQuantity =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const totalPrice =
    cart?.items?.reduce(
      (sum, item) => sum + item.quantity * Number(item.unitPrice),
      0,
    ) ?? 0;

  return {
    cart,
    cartToken,
    loading,
    addItem,
    totalQuantity,
    totalPrice,
    reload: fetchCart, // IMPORTANT: used by CartPage after PATCH
  };
}
