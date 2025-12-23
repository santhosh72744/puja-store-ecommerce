// src/app/layout.tsx
'use client';

import './globals.css';
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <div className="pt-16">{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}
