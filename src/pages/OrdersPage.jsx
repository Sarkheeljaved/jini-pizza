import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle2, Truck, ChefHat, XCircle, Flame, FileText, RotateCcw, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

const statusConfig = {
  pending:   { label: 'Pending',   icon: Clock,         color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  confirmed: { label: 'Confirmed', icon: CheckCircle2,  color: 'bg-blue-100 text-blue-700 border-blue-200' },
  preparing: { label: 'Preparing', icon: ChefHat,       color: 'bg-orange-100 text-orange-700 border-orange-200' },
  ready:     { label: 'Ready',     icon: Package,       color: 'bg-green-100 text-green-700 border-green-200' },
  delivered: { label: 'Delivered', icon: Truck,         color: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelled', icon: XCircle,       color: 'bg-red-100 text-red-700 border-red-200' },
};

const STATUS_FILTERS = ['all', 'pending', 'preparing', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const { orders, currentUser, addToCart } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter by current user
  const myOrders = useMemo(() =>
    orders.filter(o => !currentUser || !o.customer_email || o.customer_email === currentUser.email || o.created_by === currentUser.email),
    [orders, currentUser]
  );

  const filtered = useMemo(() => {
    let result = myOrders;
    if (statusFilter !== 'all') result = result.filter(o => o.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(o =>
        o.id?.toLowerCase().includes(q) ||
        o.items?.some(i => i.product_name?.toLowerCase().includes(q))
      );
    }
    return result;
  }, [myOrders, statusFilter, search]);

  const handleReorder = (order) => {
    order.items?.forEach(item => {
      addToCart({ id: item.product_id, name: item.product_name, price: item.price, image_url: item.image_url }, item.quantity || 1);
    });
    toast.success('Items added to cart!');
    navigate('/cart');
  };

  if (myOrders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-8">Place your first order from our delicious menu!</p>
          <Link to="/"><Button size="lg" className="font-semibold">Browse Menu</Button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="font-heading text-3xl font-bold mb-6">My Orders</h1>

      {/* Search + Status filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or item name..." className="pl-9 h-11 rounded-xl" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all ${statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:border-primary/40'}`}>
              {s === 'all' ? `All (${myOrders.length})` : s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-muted/30 rounded-2xl">
          <p className="font-semibold">No orders match your search</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order, index) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
                className="bg-card rounded-2xl border border-border p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">{order.created_date && format(new Date(order.created_date), 'MMM d, yyyy · h:mm a')}</p>
                    <p className="font-heading font-bold text-lg">Order #{order.id?.slice(-6)}</p>
                    <p className="text-xs text-muted-foreground capitalize">{order.order_type?.replace('_', ' ')} · {order.payment_method}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`${status.color} border font-medium gap-1.5 px-3 py-1`}>
                      <StatusIcon className="w-3.5 h-3.5" />{status.label}
                    </Badge>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => navigate(`/invoice/${order.id}`)}>
                      <FileText className="w-3.5 h-3.5" />Invoice
                    </Button>
                    {['pending','confirmed','preparing','ready'].includes(order.status) && (
                      <Button size="sm" className="gap-1" onClick={() => navigate(`/track/${order.id}`)}>
                        <Truck className="w-3.5 h-3.5" />Track
                      </Button>
                    )}
                  </div>
                </div>

                {/* Items list */}
                <div className="space-y-2 mb-4">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-muted/40 rounded-xl p-3">
                      <div className="w-11 h-11 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {item.image_url ? <img src={item.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Flame className="w-5 h-5 text-muted-foreground/30" /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-primary flex-shrink-0">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-heading font-bold text-lg text-primary">${order.total?.toFixed(2)}</span>
                  <Button size="sm" variant="outline" className="gap-1.5 font-semibold" onClick={() => handleReorder(order)}>
                    <RotateCcw className="w-3.5 h-3.5" />Re-order
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}