import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Plus, Minus, Check, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';

export default function ProductCustomizerPage() {
  const { categoryId, itemId } = useParams();
  const navigate = useNavigate();
  const { subCategories, addCustomToCart } = useApp();

  const subItem = subCategories.find(s => s.id === itemId);
  const [quantity, setQuantity] = useState(1);
  const [selectedBase, setSelectedBase] = useState({});
  const [selectedToppings, setSelectedToppings] = useState({});

  if (!subItem) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Item not found.</p>
        <Link to="/"><Button className="mt-4">Back to Menu</Button></Link>
      </div>
    );
  }

  const baseExtras = Object.entries(selectedBase).reduce((sum, [group, optName]) => {
    const grp = subItem.base_options?.find(g => g.group_name === group);
    const opt = grp?.options?.find(o => o.name === optName);
    return sum + (opt?.extra_price || 0);
  }, 0);

  const toppingExtras = Object.values(selectedToppings).reduce((sum, names) => {
    const arr = Array.from(names);
    return sum + arr.reduce((s, name) => {
      for (const grp of subItem.topping_groups || []) {
        const opt = grp.options?.find(o => o.name === name);
        if (opt) return s + (opt.extra_price || 0);
      }
      return s;
    }, 0);
  }, 0);

  const unitPrice = (subItem.base_price || 0) + baseExtras + toppingExtras;
  const totalPrice = unitPrice * quantity;

  const toggleTopping = (groupName, optName, max) => {
    setSelectedToppings(prev => {
      const set = new Set(prev[groupName] || []);
      if (set.has(optName)) { set.delete(optName); }
      else { if (max && set.size >= max) { toast.error(`Max ${max} selections`); return prev; } set.add(optName); }
      return { ...prev, [groupName]: set };
    });
  };

  const allRequiredSelected = () => (subItem.base_options || []).filter(g => g.required).every(g => selectedBase[g.group_name]);

  const handleAddToCart = () => {
    const baseLabel = Object.values(selectedBase).join(', ');
    const toppingsLabel = Object.values(selectedToppings).flatMap(s => Array.from(s)).join(', ');
    const customLabel = [baseLabel, toppingsLabel].filter(Boolean).join(' | ');
    addCustomToCart({
      product_id: itemId,
      product_name: `${subItem.name}${customLabel ? ` (${customLabel})` : ''}`,
      product_image: subItem.image_url,
      price: unitPrice,
      quantity,
    });
    toast.success('Added to cart!');
    navigate('/cart');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <Link to={`/category/${categoryId}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />Back
      </Link>

      {/* Product Header */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
        {subItem.image_url
          ? <img src={subItem.image_url} alt={subItem.name} className="w-full h-56 object-cover" />
          : <div className="w-full h-56 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"><Flame className="w-20 h-20 text-primary/30" /></div>
        }
        <div className="p-5">
          <h1 className="font-heading text-2xl font-bold">{subItem.name}</h1>
          {subItem.description && <p className="text-muted-foreground mt-1">{subItem.description}</p>}
          <p className="font-heading text-2xl font-bold text-primary mt-2">From ${subItem.base_price?.toFixed(2)}</p>
        </div>
      </div>

      {/* Base Options */}
      {(subItem.base_options || []).map(group => (
        <div key={group.group_name} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-bold">Please select — <span className="text-foreground">{group.group_name}</span></h3>
            {group.required && <Badge className="bg-primary/10 text-primary text-xs">Required</Badge>}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {(group.options || []).map(opt => {
              const isSelected = selectedBase[group.group_name] === opt.name;
              return (
                <motion.button key={opt.name} whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedBase(prev => ({ ...prev, [group.group_name]: isSelected ? undefined : opt.name }))}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-border'}`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="font-medium">{opt.name}</span>
                  </div>
                  {opt.extra_price > 0 && <span className="text-sm text-muted-foreground">+${opt.extra_price?.toFixed(2)}</span>}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Topping Groups */}
      {(subItem.topping_groups || []).map(group => {
        const selected = selectedToppings[group.group_name] || new Set();
        return (
          <div key={group.group_name} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-bold">Optional — {group.group_name}</h3>
              {group.max_selections && <Badge variant="outline" className="text-xs">Max {group.max_selections} · {selected.size} selected</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(group.options || []).map(opt => {
                const isSelected = selected.has(opt.name);
                return (
                  <motion.button key={opt.name} whileTap={{ scale: 0.97 }}
                    onClick={() => toggleTopping(group.group_name, opt.name, group.max_selections)}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40'}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-border'}`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className="text-sm font-medium">{opt.name}</span>
                    </div>
                    {opt.extra_price > 0 && <span className="text-xs text-muted-foreground">+${opt.extra_price?.toFixed(2)}</span>}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}

      <Separator className="my-6" />

      {/* Sticky Add to Cart */}
      <div className="sticky bottom-0 bg-background pt-4 pb-6">
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total price</p>
              <p className="font-heading text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="w-4 h-4" /></Button>
              <span className="font-bold text-xl w-8 text-center">{quantity}</span>
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => setQuantity(q => q + 1)}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
          {!allRequiredSelected() && <p className="text-xs text-destructive mb-2">Please make all required selections above.</p>}
          <Button className="w-full h-12 font-bold text-base gap-2" disabled={!allRequiredSelected()} onClick={handleAddToCart}>
            <ShoppingCart className="w-5 h-5" />Add to Cart — ${totalPrice.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}