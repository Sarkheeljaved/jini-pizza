import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';
import CartItemRow from '@/components/cart/CartItemRow';

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, clearCart } = useApp();

  const subtotal = cart.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  const tax = subtotal * 0.08;
  const deliveryFee = subtotal > 25 ? 0 : 3.99;
  const total = subtotal + tax + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Add some delicious items from our menu!</p>
          <Link to="/"><Button size="lg" className="font-semibold"><ShoppingBag className="w-5 h-5 mr-2" />Browse Menu</Button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold">Your Cart</h1>
        <Button variant="ghost" className="text-destructive" onClick={() => { clearCart(); toast.success('Cart cleared'); }}>Clear Cart</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.map(item => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={(item, qty) => updateCartQty(item.id, qty)}
                onRemove={(item) => { removeFromCart(item.id); toast.success('Item removed'); }}
              />
            ))}
          </AnimatePresence>
        </div>

        <div>
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
            <h3 className="font-heading font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({cart.reduce((s, i) => s + (i.quantity || 1), 0)} items)</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span className="font-medium">${tax.toFixed(2)}</span></div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              {deliveryFee > 0 && <p className="text-xs text-muted-foreground">Free delivery on orders over $25</p>}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-heading font-bold text-lg mb-6"><span>Total</span><span className="text-primary">${total.toFixed(2)}</span></div>
            <Link to="/checkout">
              <Button className="w-full h-12 font-bold text-base gap-2">Proceed to Checkout<ArrowRight className="w-5 h-5" /></Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}