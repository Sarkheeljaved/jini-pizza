import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, Banknote, Smartphone, User, ShieldCheck,
  Lock, CheckCircle2, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';

const PAYMENT_METHODS = [
  { id: 'visa',       label: 'Visa / Mastercard',  icon: '💳', color: 'from-blue-600 to-blue-800',   desc: 'Pay securely with your card' },
  { id: 'paypal',     label: 'PayPal',              icon: '🅿️', color: 'from-blue-400 to-blue-600',   desc: 'Fast & secure PayPal checkout' },
  { id: 'stripe',     label: 'Stripe',              icon: '⚡', color: 'from-violet-500 to-purple-700', desc: 'Stripe secure payment' },
  { id: 'googlepay',  label: 'Google Pay',          icon: '🔵', color: 'from-green-500 to-teal-600',  desc: 'Pay with Google Pay' },
  { id: 'cash',       label: 'Cash on Delivery',    icon: '💵', color: 'from-yellow-500 to-orange-500', desc: 'Pay when your order arrives' },
];

const ORDER_TYPES = [
  { id: 'delivery', label: 'Delivery' },
  { id: 'takeaway', label: 'Takeaway' },
  { id: 'dine_in',  label: 'Dine In' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, placeOrder, currentUser } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('visa');
  const [orderType, setOrderType] = useState('delivery');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '', email: currentUser?.email || '', phone: '', address: '', notes: '',
    cardNumber: '', cardExpiry: '', cardCvv: '', cardName: '',
  });

  const subtotal = cart.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  const tax = subtotal * 0.08;
  const deliveryFee = orderType === 'delivery' ? (subtotal > 25 ? 0 : 3.99) : 0;
  const total = subtotal + tax + deliveryFee;
  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const handlePlaceOrder = async () => {
    if (!form.name) { toast.error('Please enter your name'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const order = placeOrder({
      customer_name: form.name, customer_email: form.email,
      customer_phone: form.phone, delivery_address: form.address,
      notes: form.notes, items: cart.map(i => ({
        product_id: i.product_id, product_name: i.product_name,
        quantity: i.quantity, price: i.price, image_url: i.product_image,
      })),
      subtotal, tax, total, payment_method: paymentMethod, order_type: orderType, status: 'pending',
    });
    setPlacedOrder(order);
    setOrderPlaced(true);
    setLoading(false);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-14 h-14 text-green-600" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="font-heading text-3xl font-bold mb-3">Order Placed!</h2>
          <p className="text-muted-foreground text-lg mb-8">Your order has been placed. We'll start preparing it right away!</p>
          <div className="flex gap-3 justify-center">
            <Button size="lg" className="font-semibold" onClick={() => navigate(`/invoice/${placedOrder?.id}`)}>View Invoice</Button>
            <Link to="/orders"><Button size="lg" variant="outline">My Orders</Button></Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />Back to Cart
      </Link>
      <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2"><User className="w-5 h-5 text-primary" />Customer Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Full Name</Label><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Doe" className="mt-1.5" /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@email.com" className="mt-1.5" /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 234 567 890" className="mt-1.5" /></div>
              <div>
                <Label>Order Type</Label>
                <div className="flex gap-2 mt-1.5">
                  {ORDER_TYPES.map(t => <Button key={t.id} variant={orderType === t.id ? 'default' : 'outline'} size="sm" onClick={() => setOrderType(t.id)} className="flex-1">{t.label}</Button>)}
                </div>
              </div>
            </div>
            {orderType === 'delivery' && <div className="mt-4"><Label>Delivery Address</Label><Textarea value={form.address} onChange={e => set('address', e.target.value)} placeholder="Enter delivery address..." className="mt-1.5" /></div>}
            <div className="mt-4"><Label>Special Instructions</Label><Textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any allergies, preferences..." className="mt-1.5" /></div>
          </div>

          {/* Payment Methods */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" />Payment Method</h3>
            <div className="space-y-3">
              {PAYMENT_METHODS.map(method => (
                <motion.button
                  key={method.id}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                >
                  <div className={`w-12 h-8 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center text-white text-lg`}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{method.label}</p>
                    <p className="text-xs text-muted-foreground">{method.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-primary bg-primary' : 'border-border'}`}>
                    {paymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Card details */}
            {['visa', 'stripe'].includes(paymentMethod) && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-6 space-y-4 overflow-hidden">
                <div><Label>Cardholder Name</Label><Input value={form.cardName} onChange={e => set('cardName', e.target.value)} placeholder="John Doe" className="mt-1.5" /></div>
                <div><Label>Card Number</Label><Input value={form.cardNumber} onChange={e => set('cardNumber', e.target.value)} placeholder="1234 5678 9012 3456" className="mt-1.5" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Expiry</Label><Input value={form.cardExpiry} onChange={e => set('cardExpiry', e.target.value)} placeholder="MM/YY" className="mt-1.5" /></div>
                  <div><Label>CVV</Label><Input type="password" value={form.cardCvv} onChange={e => set('cardCvv', e.target.value)} placeholder="•••" className="mt-1.5" /></div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-green-50 rounded-xl border border-green-200">
                  <Lock className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-700">Your payment is 256-bit SSL encrypted & secure</span>
                </div>
              </motion.div>
            )}
            {paymentMethod === 'paypal' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
                <p className="text-sm text-blue-700 font-medium">You'll be redirected to PayPal to complete payment after confirming your order.</p>
              </motion.div>
            )}
            {paymentMethod === 'googlepay' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                <p className="text-sm text-green-700 font-medium">Google Pay will open on your device to authorize the payment.</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
            <h3 className="font-heading font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {item.product_image && <img src={item.product_image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">x{item.quantity || 1}</p>
                  </div>
                  <p className="text-sm font-semibold">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className={deliveryFee === 0 ? 'text-green-600' : ''}>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-heading font-bold text-xl mb-6"><span>Total</span><span className="text-primary">${total.toFixed(2)}</span></div>
            <Button className="w-full h-12 font-bold text-base gap-2" onClick={handlePlaceOrder} disabled={loading || !form.name || cart.length === 0}>
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              {loading ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}