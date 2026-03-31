import React, { useRef } from 'react';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';
import HeroBanner from '@/components/menu/HeroBanner';
import StoreStatusBanner from '@/components/home/StoreStatusBanner';
import RecommendedSection from '@/components/home/RecommendedSection';
import CategoryGrid from '@/components/home/CategoryGrid';

export default function MenuPage() {
  const { products, categories, storeSettings, addToCart, toggleWishlist, isWishlisted } = useApp();
  const categoriesRef = useRef(null);

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const activeCategories = categories
    .filter(c => c.is_active !== false)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <HeroBanner onOrderNow={scrollToCategories} />

      <StoreStatusBanner settings={storeSettings} />

      <RecommendedSection
        products={products}
        wishlistIds={products.filter(p => isWishlisted(p.id)).map(p => p.id)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={toggleWishlist}
      />

      <div ref={categoriesRef}>
        <CategoryGrid categories={activeCategories} />
      </div>
    </div>
  );
}