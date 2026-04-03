import React, { useRef, useState, useMemo } from "react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import HeroBanner from "@/components/menu/HeroBanner";
import StoreStatusBanner from "@/components/home/StoreStatusBanner";
import RecommendedSection from "@/components/home/RecommendedSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductCard from "@/components/menu/ProductCard";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const QUICK_FILTERS = [
  { id: "featured", label: "⭐ Featured" },
  { id: "spicy", label: "🌶️ Spicy" },
];

export default function MenuPage() {
  const {
    products,
    categories,
    storeSettings,
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useApp();
  const categoriesRef = useRef(null);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const toggleFilter = (id) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const activeCategories = categories
    .filter((c) => c.is_active !== false)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const isSearching = search.trim().length > 0 || activeFilters.length > 0;

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.is_available !== false);
    const q = search.trim().toLowerCase();
    if (q)
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    if (activeFilters.includes("featured"))
      result = result.filter((p) => p.is_featured);
    if (activeFilters.includes("spicy"))
      result = result.filter((p) =>
        ["hot", "extra_hot", "medium"].includes(p.spice_level),
      );
    return result;
  }, [products, search, activeFilters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <HeroBanner onOrderNow={scrollToCategories} />
      <StoreStatusBanner settings={storeSettings} />

      {/* Search + Quick Filters */}
      <div className="my-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or category..."
            className="pl-9 pr-9 h-11 rounded-xl"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => toggleFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${activeFilters.includes(f.id) ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:border-primary/50"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {isSearching ? (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {filteredProducts.length} result
            {filteredProducts.length !== 1 ? "s" : ""} found
          </p>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No products found</p>
              <p className="text-sm">Try a different search term or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={isWishlisted(product.id)}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      ) : (
        <>
          <RecommendedSection
            products={products}
            wishlistIds={products
              .filter((p) => isWishlisted(p.id))
              .map((p) => p.id)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={toggleWishlist}
          />
          <div ref={categoriesRef}>
            <CategoryGrid categories={activeCategories} />
          </div>
        </>
      )}
    </div>
  );
}
