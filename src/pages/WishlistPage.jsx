import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useApp();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">Save your favorite items for later!</p>
          <Link to="/"><Button size="lg" className="font-semibold">Browse Menu</Button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="font-heading text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {wishlist.map((item) => (
            <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                {item.product_image ? <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Flame className="w-16 h-16 text-muted-foreground/30" /></div>}
              </div>
              <div className="p-4">
                <h3 className="font-heading font-semibold mb-1">{item.product_name}</h3>
                <p className="text-primary font-bold text-lg mb-4">${item.price?.toFixed(2)}</p>
                <div className="flex gap-2">
                  <Button className="flex-1 gap-2" onClick={() => { addToCart({ id: item.product_id, name: item.product_name, image_url: item.product_image, price: item.price }); toast.success('Added to cart!'); }}>
                    <ShoppingCart className="w-4 h-4" />Add to Cart
                  </Button>
                  <Button variant="outline" size="icon" className="text-destructive" onClick={() => { toggleWishlist({ id: item.product_id }); toast.success('Removed from wishlist'); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}