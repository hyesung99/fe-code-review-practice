import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { Header } from './components/Header';
import { cartCountAtom } from './atoms/cart';
import { getCart } from './api/cart';
import HomePage from './pages/home-page';
import ProductDetailPage from './pages/product-detail-page';
import CartPage from './pages/cart-page';
import ReviewEditPage from './pages/review-edit-page';

export default function App() {
  const setCartCount = useSetAtom(cartCountAtom);

  useEffect(() => {
    getCart().then((items) => setCartCount(items.reduce((sum, item) => sum + item.quantity, 0)));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products/:productId/reviews/new" element={<ReviewEditPage />} />
          <Route path="/reviews/:reviewId/edit" element={<ReviewEditPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
    </div>
  );
}
