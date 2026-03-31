import React from 'react';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { DollarSign, Package, ShoppingBag, LayoutGrid, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

function StatCard({ title, value, icon: Icon, colorClass, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}><Icon className="w-6 h-6" /></div>
        <TrendingUp className="w-4 h-4 text-green-500" />
      </div>
      <p className="text-muted-foreground text-sm">{title}</p>
      <p className="font-heading text-2xl font-bold mt-1">{value}</p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { orders, products, categories } = useApp();
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status)).length;

  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-bold mb-6">Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} colorClass="bg-green-100 text-green-700" delay={0} />
        <StatCard title="Total Orders" value={orders.length} icon={ShoppingBag} colorClass="bg-blue-100 text-blue-700" delay={0.05} />
        <StatCard title="Pending Orders" value={pendingOrders} icon={Package} colorClass="bg-orange-100 text-orange-700" delay={0.1} />
        <StatCard title="Menu Categories" value={categories.length} icon={LayoutGrid} colorClass="bg-purple-100 text-purple-700" delay={0.15} />
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border"><h3 className="font-heading font-bold text-lg">Recent Orders</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Status'].map(h => (
                  <th key={h} className="text-left p-4 text-sm font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map(order => (
                <tr key={order.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-mono text-sm">#{order.id?.slice(-6)}</td>
                  <td className="p-4 text-xs text-muted-foreground">{order.created_date && format(new Date(order.created_date), 'MMM d, h:mm a')}</td>
                  <td className="p-4 text-sm">{order.customer_name}</td>
                  <td className="p-4 text-sm text-muted-foreground">{order.items?.length} items</td>
                  <td className="p-4 text-sm font-semibold">${order.total?.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-center py-8 text-muted-foreground">No orders yet</p>}
        </div>
      </div>
    </div>
  );
}