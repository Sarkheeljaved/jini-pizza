import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Flame, Printer, ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

export default function InvoicePage() {
  const { orderId } = useParams();
  const { orders } = useApp();
  const printRef = useRef();
  const order = orders.find(o => o.id === orderId);

  const handlePrint = () => window.print();

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-heading text-2xl font-bold mb-4">Invoice not found</h2>
        <Link to="/orders"><Button>My Orders</Button></Link>
      </div>
    );
  }

  const invoiceNum = 'INV-' + order.id.slice(-8).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {/* Controls - hidden on print */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link to="/orders" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />Back to Orders
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="gap-2"><Printer className="w-4 h-4" />Print</Button>
          <Button onClick={handlePrint} className="gap-2"><Download className="w-4 h-4" />Download PDF</Button>
        </div>
      </div>

      {/* Invoice Card */}
      <motion.div ref={printRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Flame className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-2xl">JiniPizza</h1>
                <p className="text-white/70 text-sm">123 Jini Street, New York</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-heading font-bold text-2xl">INVOICE</p>
              <p className="text-white/80 font-mono">{invoiceNum}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Order info grid */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Bill To</p>
              <p className="font-semibold">{order.customer_name}</p>
              <p className="text-sm text-muted-foreground">{order.customer_email}</p>
              <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
              {order.delivery_address && <p className="text-sm text-muted-foreground mt-1">{order.delivery_address}</p>}
            </div>
            <div className="text-right">
              <div className="space-y-1 text-sm">
                <div><span className="text-muted-foreground">Invoice Date:</span><span className="ml-2 font-medium">{format(new Date(order.created_date), 'MMM d, yyyy')}</span></div>
                <div><span className="text-muted-foreground">Order ID:</span><span className="ml-2 font-mono font-medium">#{order.id.slice(-8)}</span></div>
                <div><span className="text-muted-foreground">Order Type:</span><span className="ml-2 font-medium capitalize">{order.order_type?.replace('_', ' ')}</span></div>
                <div><span className="text-muted-foreground">Payment:</span><span className="ml-2 font-medium capitalize">{order.payment_method}</span></div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div className="rounded-2xl border border-border overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Item</th>
                  <th className="text-center px-4 py-3 font-semibold">Qty</th>
                  <th className="text-right px-4 py-3 font-semibold">Unit Price</th>
                  <th className="text-right px-4 py-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{item.product_name}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">${item.price?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-semibold">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${order.subtotal?.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span>${order.tax?.toFixed(2)}</span></div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>{(order.total - order.subtotal - order.tax) <= 0.01 ? 'FREE' : `$${(order.total - order.subtotal - order.tax)?.toFixed(2)}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-heading font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>Thank you for your order! 🔥 JiniPizza — Fresh, Bold, Fast.</p>
            <p className="mt-1">hello@JiniPizza.com · +1 (800) Jini-IT · JiniPizza.com</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}