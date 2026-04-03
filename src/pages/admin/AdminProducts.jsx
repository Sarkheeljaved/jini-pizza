import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const categories = ['burgers', 'pizzas', 'sides', 'drinks', 'desserts', 'combos'];
const spiceLevels = ['mild', 'medium', 'hot', 'extra_hot'];
const emptyProduct = { name: '', description: '', price: '', category: 'burgers', image_url: '', is_featured: false, is_available: true, spice_level: '', calories: '', prep_time_mins: '' };

export default function AdminProducts() {
  const { products, createProduct, updateProduct, deleteProduct } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);

  const openCreate = () => { setEditingProduct(null); setForm(emptyProduct); setDialogOpen(true); };
  const openEdit = (p) => {
    setEditingProduct(p);
    setForm({ name: p.name || '', description: p.description || '', price: p.price?.toString() || '', category: p.category || 'burgers', image_url: p.image_url || '', is_featured: p.is_featured || false, is_available: p.is_available !== false, spice_level: p.spice_level || '', calories: p.calories?.toString() || '', prep_time_mins: p.prep_time_mins?.toString() || '' });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const payload = { ...form, price: parseFloat(form.price) || 0, calories: form.calories ? parseInt(form.calories) : undefined, prep_time_mins: form.prep_time_mins ? parseInt(form.prep_time_mins) : undefined };
    if (editingProduct) { updateProduct(editingProduct.id, payload); toast.success('Product updated!'); }
    else { createProduct(payload); toast.success('Product created!'); }
    setDialogOpen(false);
  };

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold">Products ({products.length})</h2>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" />Add Product</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {products.map(product => (
            <motion.div key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="aspect-video bg-muted overflow-hidden">
                {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Flame className="w-12 h-12 text-muted-foreground/20" /></div>}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div><h3 className="font-heading font-semibold">{product.name}</h3><p className="text-primary font-bold">${product.price?.toFixed(2)}</p></div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${product.is_available !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.is_available !== false ? 'Available' : 'Sold Out'}</span>
                </div>
                <p className="text-sm text-muted-foreground capitalize mb-3">{product.category}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => openEdit(product)}><Pencil className="w-3 h-3" />Edit</Button>
                  <Button variant="outline" size="sm" className="text-destructive gap-1" onClick={() => { deleteProduct(product.id); toast.success('Deleted'); }}><Trash2 className="w-3 h-3" />Delete</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={e => set('name', e.target.value)} className="mt-1.5" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => set('description', e.target.value)} className="mt-1.5" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Price ($) *</Label><Input type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} className="mt-1.5" /></div>
              <div><Label>Category</Label><Select value={form.category} onValueChange={v => set('category', v)}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div><Label>Image URL</Label><Input value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..." className="mt-1.5" /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Spice Level</Label><Select value={form.spice_level} onValueChange={v => set('spice_level', v)}><SelectTrigger className="mt-1.5"><SelectValue placeholder="None" /></SelectTrigger><SelectContent>{spiceLevels.map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Calories</Label><Input type="number" value={form.calories} onChange={e => set('calories', e.target.value)} className="mt-1.5" /></div>
              <div><Label>Prep (mins)</Label><Input type="number" value={form.prep_time_mins} onChange={e => set('prep_time_mins', e.target.value)} className="mt-1.5" /></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><Switch checked={form.is_featured} onCheckedChange={v => set('is_featured', v)} /><Label>Featured</Label></div>
              <div className="flex items-center gap-3"><Switch checked={form.is_available} onCheckedChange={v => set('is_available', v)} /><Label>Available</Label></div>
            </div>
            <Button className="w-full" disabled={!form.name || !form.price} onClick={handleSave}>{editingProduct ? 'Update Product' : 'Create Product'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}