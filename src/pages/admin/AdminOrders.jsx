import React from 'react';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700', ready: 'bg-green-100 text-green-700',
  delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useApp();

  return (
    <div className="p-4 sm:p-6">
      <h2 className="font-heading text-xl font-bold mb-6">All Orders ({orders.length})</h2>

      {/* Mobile card list */}
      <div className="sm:hidden space-y-3">
        {orders.length === 0 && <div className="text-center py-12 text-muted-foreground">No orders yet</div>}
        {orders.map(order => (
          <div key={order.id} className="bg-card rounded-2xl border border-border p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono font-bold text-sm">#{order.id?.slice(-6)}</p>
                <p className="text-xs text-muted-foreground">{order.created_date && format(new Date(order.created_date), 'MMM d, h:mm a')}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.status]}`}>{order.status}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{order.customer_name}</p>
                <p className="text-xs text-muted-foreground capitalize">{order.order_type?.replace('_', ' ')} · {order.items?.length} items · {order.payment_method}</p>
              </div>
              <p className="font-bold text-primary">${order.total?.toFixed(2)}</p>
            </div>
            <Select value={order.status} onValueChange={(status) => { updateOrderStatus(order.id, status); toast.success('Status updated'); }}>
              <SelectTrigger className={`w-full h-8 text-xs font-medium ${statusColors[order.status]}`}><SelectValue /></SelectTrigger>
              <SelectContent>{statuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {['Order', 'Date', 'Customer', 'Type', 'Items', 'Total', 'Payment', 'Status'].map(h => (
                  <th key={h} className="text-left p-4 text-sm font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-mono text-sm font-medium">#{order.id?.slice(-6)}</td>
                  <td className="p-4 text-xs text-muted-foreground">{order.created_date && format(new Date(order.created_date), 'MMM d, h:mm a')}</td>
                  <td className="p-4"><p className="text-sm font-medium">{order.customer_name}</p><p className="text-xs text-muted-foreground">{order.customer_phone}</p></td>
                  <td className="p-4 text-sm capitalize">{order.order_type?.replace('_', ' ')}</td>
                  <td className="p-4 text-sm">{order.items?.length} items</td>
                  <td className="p-4 text-sm font-semibold">${order.total?.toFixed(2)}</td>
                  <td className="p-4 text-sm capitalize">{order.payment_method}</td>
                  <td className="p-4">
                    <Select value={order.status} onValueChange={(status) => { updateOrderStatus(order.id, status); toast.success('Status updated'); }}>
                      <SelectTrigger className={`w-32 h-8 text-xs font-medium ${statusColors[order.status]}`}><SelectValue /></SelectTrigger>
                      <SelectContent>{statuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="text-center py-12 text-muted-foreground">No orders yet</div>}
        </div>
      </div>
    </div>
  );
}