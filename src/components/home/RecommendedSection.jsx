import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function RecommendedSection({ products, wishlistIds, onAddToCart, onToggleWishlist }) {
  const recommended = products
    .filter(p => p.is_featured && p.is_available !== false)
    .slice(0, 6);

  if (recommended.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-accent fill-accent" />
        <h2 className="font-heading text-xl font-bold">Recommended for You</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
        {recommended.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex-shrink-0 w-64 bg-card rounded-2xl border border-border overflow-hidden group"
          >
            <div className="relative h-36 bg-muted overflow-hidden">
              {p.image_url
                ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                : <div className="w-full h-full flex items-center justify-center"><Flame className="w-10 h-10 text-muted-foreground/30" /></div>
              }
              <button
                onClick={() => onToggleWishlist(p)}
                className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
                  wishlistIds.includes(p.id) ? 'bg-primary text-white' : 'bg-white/80 text-foreground hover:bg-primary hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlistIds.includes(p.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm leading-tight mb-1">{p.name}</h3>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">${p.price?.toFixed(2)}</span>
                <button className="h-7 text-xs px-3 gap-1 flex items-center bg-primary text-white rounded hover:bg-primary/90 transition-colors" onClick={() => onAddToCart(p)}>
                  <ShoppingCart className="w-3 h-3" />
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}