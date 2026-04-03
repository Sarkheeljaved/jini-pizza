import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import SubCategoryManager from '@/components/admin/SubCategoryManager';

const emptyCat = { name: '', description: '', icon_emoji: '🍽️', image_url: '', sort_order: '0', is_active: true, badge: '' };

export default function AdminCategories() {
  const { categories, createCategory, updateCategory, deleteCategory } = useApp();
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState(emptyCat);
  const [expandedCat, setExpandedCat] = useState(null);

  const openCreate = () => { setEditingCat(null); setCatForm(emptyCat); setCatDialogOpen(true); };
  const openEdit = (c) => { setEditingCat(c); setCatForm({ ...emptyCat, ...c, sort_order: c.sort_order?.toString() || '0' }); setCatDialogOpen(true); };

  const handleSave = () => {
    const payload = { ...catForm, sort_order: parseInt(catForm.sort_order) || 0 };
    if (editingCat) { updateCategory(editingCat.id, payload); toast.success('Updated!'); }
    else { createCategory(payload); toast.success('Created!'); }
    setCatDialogOpen(false);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold">Menu Categories</h2>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" />Add Category</Button>
      </div>

      <div className="space-y-3">
        {categories.map(cat => (
          <div key={cat.id} className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center">
                {cat.image_url ? <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" /> : <span className="text-2xl">{cat.icon_emoji || '🍽️'}</span>}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{cat.name}</h3>
                  {cat.badge && <Badge className="bg-accent text-accent-foreground text-xs">{cat.badge}</Badge>}
                  {!cat.is_active && <Badge variant="outline" className="text-xs">Inactive</Badge>}
                </div>
                {cat.description && <p className="text-sm text-muted-foreground">{cat.description}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}><Pencil className="w-3 h-3" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { deleteCategory(cat.id); toast.success('Deleted'); }}><Trash2 className="w-3 h-3" /></Button>
                <Button variant="ghost" size="sm" onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}>
                  {expandedCat === cat.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />} Sub-items
                </Button>
              </div>
            </div>
            <AnimatePresence>
              {expandedCat === cat.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="border-t border-border p-4 bg-muted/30">
                    <SubCategoryManager categoryId={cat.id} categoryName={cat.name} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-heading">{editingCat ? 'Edit Category' : 'Add Category'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name *</Label><Input value={catForm.name} onChange={e => setCatForm(p => ({ ...p, name: e.target.value }))} className="mt-1.5" /></div>
              <div><Label>Emoji Icon</Label><Input value={catForm.icon_emoji} onChange={e => setCatForm(p => ({ ...p, icon_emoji: e.target.value }))} className="mt-1.5" /></div>
            </div>
            <div><Label>Description</Label><Textarea value={catForm.description} onChange={e => setCatForm(p => ({ ...p, description: e.target.value }))} className="mt-1.5" /></div>
            <div><Label>Image URL</Label><Input value={catForm.image_url} onChange={e => setCatForm(p => ({ ...p, image_url: e.target.value }))} className="mt-1.5" placeholder="https://..." /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Badge</Label><Input value={catForm.badge} onChange={e => setCatForm(p => ({ ...p, badge: e.target.value }))} className="mt-1.5" placeholder="e.g. Hot, New" /></div>
              <div><Label>Sort Order</Label><Input type="number" value={catForm.sort_order} onChange={e => setCatForm(p => ({ ...p, sort_order: e.target.value }))} className="mt-1.5" /></div>
            </div>
            <div className="flex items-center gap-3"><Switch checked={catForm.is_active} onCheckedChange={v => setCatForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
            <Button className="w-full" disabled={!catForm.name} onClick={handleSave}>{editingCat ? 'Update' : 'Create Category'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}