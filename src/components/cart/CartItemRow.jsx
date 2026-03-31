import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CartItemRow({ item, onUpdateQuantity, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border"
    >
      {/* Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
        {item.product_image ? (
          <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Flame className="w-8 h-8 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-semibold truncate">{item.product_name}</h3>
        <p className="text-primary font-bold">${item.price?.toFixed(2)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-full"
          onClick={() => onUpdateQuantity(item, Math.max(1, (item.quantity || 1) - 1))}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="font-bold w-8 text-center">{item.quantity || 1}</span>
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-full"
          onClick={() => onUpdateQuantity(item, (item.quantity || 1) + 1)}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      {/* Total & Remove */}
      <div className="text-right flex-shrink-0">
        <p className="font-heading font-bold">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive mt-1 px-2 h-7"
          onClick={() => onRemove(item)}
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Remove
        </Button>
      </div>
    </motion.div>
  );
}