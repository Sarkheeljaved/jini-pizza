import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, Pencil, Trash2, X, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const emptySubCat = { name: '', description: '', base_price: '', image_url: '', sort_order: '0', is_active: true, base_options: [], topping_groups: [] };

export default function SubCategoryManager({ categoryId, categoryName }) {
  const { subCategories, createSubCategory, updateSubCategory, deleteSubCategory } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptySubCat);

  const subs = subCategories.filter(s => s.category_id === categoryId);

  const openCreate = () => { setEditing(null); setForm(emptySubCat); setDialogOpen(true); };
  const openEdit = (s) => { setEditing(s); setForm({ ...emptySubCat, ...s, base_price: s.base_price?.toString(), sort_order: s.sort_order?.toString() || '0' }); setDialogOpen(true); };

  const handleSave = () => {
    const payload = { ...form, category_id: categoryId, base_price: parseFloat(form.base_price) || 0, sort_order: parseInt(form.sort_order) || 0 };
    if (editing) { updateSubCategory(editing.id, payload); toast.success('Updated!'); }
    else { createSubCategory(payload); toast.success('Created!'); }
    setDialogOpen(false);
  };

  // Base option helpers
  const addBaseGroup = () => setForm(p => ({ ...p, base_options: [...(p.base_options || []), { group_name: '', required: true, select_type: 'single', options: [] }] }));
  const updBG = (i, f, v) => setForm(p => { const g = [...p.base_options]; g[i] = { ...g[i], [f]: v }; return { ...p, base_options: g }; });
  const remBG = (i) => setForm(p => ({ ...p, base_options: p.base_options.filter((_, idx) => idx !== i) }));
  const addBO = (gi) => setForm(p => { const g = [...p.base_options]; g[gi] = { ...g[gi], options: [...(g[gi].options || []), { name: '', extra_price: 0 }] }; return { ...p, base_options: g }; });
  const updBO = (gi, oi, f, v) => setForm(p => { const g = [...p.base_options]; const o = [...(g[gi].options || [])]; o[oi] = { ...o[oi], [f]: v }; g[gi] = { ...g[gi], options: o }; return { ...p, base_options: g }; });
  const remBO = (gi, oi) => setForm(p => { const g = [...p.base_options]; g[gi] = { ...g[gi], options: g[gi].options.filter((_, idx) => idx !== oi) }; return { ...p, base_options: g }; });

  // Topping helpers
  const addTG = () => setForm(p => ({ ...p, topping_groups: [...(p.topping_groups || []), { group_name: '', max_selections: '', options: [] }] }));
  const updTG = (i, f, v) => setForm(p => { const g = [...p.topping_groups]; g[i] = { ...g[i], [f]: v }; return { ...p, topping_groups: g }; });
  const remTG = (i) => setForm(p => ({ ...p, topping_groups: p.topping_groups.filter((_, idx) => idx !== i) }));
  const addTO = (gi) => setForm(p => { const g = [...p.topping_groups]; g[gi] = { ...g[gi], options: [...(g[gi].options || []), { name: '', extra_price: 0 }] }; return { ...p, topping_groups: g }; });
  const updTO = (gi, oi, f, v) => setForm(p => { const g = [...p.topping_groups]; const o = [...(g[gi].options || [])]; o[oi] = { ...o[oi], [f]: v }; g[gi] = { ...g[gi], options: o }; return { ...p, topping_groups: g }; });
  const remTO = (gi, oi) => setForm(p => { const g = [...p.topping_groups]; g[gi] = { ...g[gi], options: g[gi].options.filter((_, idx) => idx !== oi) }; return { ...p, topping_groups: g }; });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{subs.length} items in {categoryName}</p>
        <Button size="sm" onClick={openCreate} className="gap-1"><Plus className="w-3.5 h-3.5" />Add Item</Button>
      </div>

      {subs.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No items yet.</p>}

      <div className="space-y-2">
        {subs.map(sub => (
          <div key={sub.id} className="flex items-center gap-3 p-3 bg-background rounded-xl">
            {sub.image_url && <img src={sub.image_url} alt={sub.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{sub.name}</p>
              <p className="text-xs text-muted-foreground">${sub.base_price?.toFixed(2)}</p>
            </div>
            <Badge variant="outline" className={`text-xs ${sub.is_active !== false ? 'border-green-300 text-green-700' : 'border-red-300 text-red-700'}`}>{sub.is_active !== false ? 'Active' : 'Inactive'}</Badge>
            <Button variant="ghost" size="sm" onClick={() => openEdit(sub)}><Pencil className="w-3.5 h-3.5" /></Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteSubCategory(sub.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">{editing ? 'Edit Item' : `Add Item to ${categoryName}`}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="mt-1.5" placeholder="e.g. Margherita 16 inch" /></div>
              <div><Label>Base Price (e) *</Label><Input type="number" step="0.01" value={form.base_price} onChange={e => setForm(p => ({ ...p, base_price: e.target.value }))} className="mt-1.5" /></div>
            </div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1.5" placeholder="e.g. Served with cheese and mayo" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} className="mt-1.5" /></div>
              <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} className="mt-1.5" /></div>
            </div>
            <div className="flex items-center gap-3"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>

            {/* Base Options */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-semibold">Selection Groups (e.g. Crust Type)</Label>
                <Button size="sm" variant="outline" onClick={addBaseGroup} className="gap-1 text-xs"><PlusCircle className="w-3.5 h-3.5" />Add Group</Button>
              </div>
              {(form.base_options || []).map((group, gi) => (
                <div key={gi} className="p-3 border border-border rounded-xl mb-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <Input value={group.group_name} onChange={e => updBG(gi, 'group_name', e.target.value)} placeholder="Group name e.g. Crust Type" className="flex-1" />
                    <Select value={group.select_type} onValueChange={v => updBG(gi, 'select_type', v)}><SelectTrigger className="w-28"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="single">Single</SelectItem><SelectItem value="multiple">Multiple</SelectItem></SelectContent></Select>
                    <div className="flex items-center gap-1"><Switch checked={group.required} onCheckedChange={v => updBG(gi, 'required', v)} /><span className="text-xs">Req.</span></div>
                    <Button size="icon" variant="ghost" className="text-destructive w-8 h-8" onClick={() => remBG(gi)}><X className="w-3.5 h-3.5" /></Button>
                  </div>
                  {(group.options || []).map((opt, oi) => (
                    <div key={oi} className="flex gap-2 ml-4">
                      <Input value={opt.name} onChange={e => updBO(gi, oi, 'name', e.target.value)} placeholder="Option name" className="flex-1" />
                      <Input type="number" step="0.01" value={opt.extra_price} onChange={e => updBO(gi, oi, 'extra_price', parseFloat(e.target.value) || 0)} placeholder="+price" className="w-20" />
                      <Button size="icon" variant="ghost" className="text-destructive w-8 h-8" onClick={() => remBO(gi, oi)}><X className="w-3 h-3" /></Button>
                    </div>
                  ))}
                  <Button size="sm" variant="ghost" className="ml-4 text-xs gap-1" onClick={() => addBO(gi)}><Plus className="w-3 h-3" />Add Option</Button>
                </div>
              ))}
            </div>

            {/* Toppings */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-semibold">Topping Groups (Optional)</Label>
                <Button size="sm" variant="outline" onClick={addTG} className="gap-1 text-xs"><PlusCircle className="w-3.5 h-3.5" />Add Group</Button>
              </div>
              {(form.topping_groups || []).map((group, gi) => (
                <div key={gi} className="p-3 border border-border rounded-xl mb-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <Input value={group.group_name} onChange={e => updTG(gi, 'group_name', e.target.value)} placeholder="Group e.g. Extra Toppings" className="flex-1" />
                    <Input type="number" value={group.max_selections} onChange={e => updTG(gi, 'max_selections', parseInt(e.target.value) || '')} placeholder="Max" className="w-16" />
                    <Button size="icon" variant="ghost" className="text-destructive w-8 h-8" onClick={() => remTG(gi)}><X className="w-3.5 h-3.5" /></Button>
                  </div>
                  {(group.options || []).map((opt, oi) => (
                    <div key={oi} className="flex gap-2 ml-4">
                      <Input value={opt.name} onChange={e => updTO(gi, oi, 'name', e.target.value)} placeholder="Topping e.g. Anchovies" className="flex-1" />
                      <Input type="number" step="0.01" value={opt.extra_price} onChange={e => updTO(gi, oi, 'extra_price', parseFloat(e.target.value) || 0)} placeholder="+price" className="w-20" />
                      <Button size="icon" variant="ghost" className="text-destructive w-8 h-8" onClick={() => remTO(gi, oi)}><X className="w-3 h-3" /></Button>
                    </div>
                  ))}
                  <Button size="sm" variant="ghost" className="ml-4 text-xs gap-1" onClick={() => addTO(gi)}><Plus className="w-3 h-3" />Add Topping</Button>
                </div>
              ))}
            </div>

            <Button className="w-full" disabled={!form.name || !form.base_price} onClick={handleSave}>{editing ? 'Update Item' : 'Create Item'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}