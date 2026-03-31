import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Clock, Truck, Store, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

function timeToMs(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h * 3600 + m * 60) * 1000;
}
function msToTime(ms) {
  if (!ms && ms !== 0) return '';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export default function AdminSettings() {
  const { storeSettings, saveStoreSettings } = useApp();
  const [form, setForm] = useState({ store_name: '', delivery_enabled: true, delivery_open: '11:00', delivery_close: '22:00', pickup_enabled: true, pickup_open: '10:00', pickup_close: '22:00', delivery_min_order: '10', delivery_fee: '3.99', delivery_free_threshold: '25', estimated_delivery_mins: '35', estimated_pickup_mins: '15' });

  useEffect(() => {
    if (storeSettings) {
      setForm({
        store_name: storeSettings.store_name || '',
        delivery_enabled: storeSettings.delivery_enabled !== false,
        delivery_open: msToTime(storeSettings.delivery_open_time_ms) || '11:00',
        delivery_close: msToTime(storeSettings.delivery_close_time_ms) || '22:00',
        pickup_enabled: storeSettings.pickup_enabled !== false,
        pickup_open: msToTime(storeSettings.pickup_open_time_ms) || '10:00',
        pickup_close: msToTime(storeSettings.pickup_close_time_ms) || '22:00',
        delivery_min_order: storeSettings.delivery_min_order?.toString() || '10',
        delivery_fee: storeSettings.delivery_fee?.toString() || '3.99',
        delivery_free_threshold: storeSettings.delivery_free_threshold?.toString() || '25',
        estimated_delivery_mins: storeSettings.estimated_delivery_mins?.toString() || '35',
        estimated_pickup_mins: storeSettings.estimated_pickup_mins?.toString() || '15',
      });
    }
  }, [storeSettings]);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    saveStoreSettings({
      store_name: form.store_name,
      delivery_enabled: form.delivery_enabled,
      delivery_open_time_ms: timeToMs(form.delivery_open),
      delivery_close_time_ms: timeToMs(form.delivery_close),
      pickup_enabled: form.pickup_enabled,
      pickup_open_time_ms: timeToMs(form.pickup_open),
      pickup_close_time_ms: timeToMs(form.pickup_close),
      delivery_min_order: parseFloat(form.delivery_min_order),
      delivery_fee: parseFloat(form.delivery_fee),
      delivery_free_threshold: parseFloat(form.delivery_free_threshold),
      estimated_delivery_mins: parseInt(form.estimated_delivery_mins),
      estimated_pickup_mins: parseInt(form.estimated_pickup_mins),
    });
    toast.success('Settings saved!');
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="font-heading text-xl font-bold mb-6">Store Settings</h2>
      <div className="space-y-6">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-heading font-semibold mb-4">General</h3>
          <div><Label>Store Name</Label><Input value={form.store_name} onChange={e => set('store_name', e.target.value)} placeholder="JiniPizza" className="mt-1.5" /></div>
        </div>

        {/* Delivery */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold flex items-center gap-2"><Truck className="w-5 h-5 text-primary" />Delivery</h3>
            <div className="flex items-center gap-2"><Switch checked={form.delivery_enabled} onCheckedChange={v => set('delivery_enabled', v)} /><Label>{form.delivery_enabled ? 'Enabled' : 'Disabled'}</Label></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><Label className="flex items-center gap-1"><Clock className="w-3 h-3" />Open Time</Label><Input type="time" value={form.delivery_open} onChange={e => set('delivery_open', e.target.value)} className="mt-1.5" /><p className="text-xs text-muted-foreground mt-1">= {timeToMs(form.delivery_open).toLocaleString()} ms</p></div>
            <div><Label className="flex items-center gap-1"><Clock className="w-3 h-3" />Close Time</Label><Input type="time" value={form.delivery_close} onChange={e => set('delivery_close', e.target.value)} className="mt-1.5" /><p className="text-xs text-muted-foreground mt-1">= {timeToMs(form.delivery_close).toLocaleString()} ms</p></div>
          </div>
          <div className="p-3 bg-muted/50 rounded-xl mb-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">Times stored as milliseconds from midnight. Open: {timeToMs(form.delivery_open).toLocaleString()} ms · Close: {timeToMs(form.delivery_close).toLocaleString()} ms</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>Min Order ($)</Label><Input type="number" value={form.delivery_min_order} onChange={e => set('delivery_min_order', e.target.value)} className="mt-1.5" /></div>
            <div><Label>Delivery Fee ($)</Label><Input type="number" step="0.01" value={form.delivery_fee} onChange={e => set('delivery_fee', e.target.value)} className="mt-1.5" /></div>
            <div><Label>Free Over ($)</Label><Input type="number" value={form.delivery_free_threshold} onChange={e => set('delivery_free_threshold', e.target.value)} className="mt-1.5" /></div>
          </div>
          <div className="mt-4"><Label>Est. Delivery Time (mins)</Label><Input type="number" value={form.estimated_delivery_mins} onChange={e => set('estimated_delivery_mins', e.target.value)} className="mt-1.5 w-40" /></div>
        </div>

        {/* Pickup */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold flex items-center gap-2"><Store className="w-5 h-5 text-primary" />Pickup</h3>
            <div className="flex items-center gap-2"><Switch checked={form.pickup_enabled} onCheckedChange={v => set('pickup_enabled', v)} /><Label>{form.pickup_enabled ? 'Enabled' : 'Disabled'}</Label></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><Label>Open Time</Label><Input type="time" value={form.pickup_open} onChange={e => set('pickup_open', e.target.value)} className="mt-1.5" /><p className="text-xs text-muted-foreground mt-1">= {timeToMs(form.pickup_open).toLocaleString()} ms</p></div>
            <div><Label>Close Time</Label><Input type="time" value={form.pickup_close} onChange={e => set('pickup_close', e.target.value)} className="mt-1.5" /><p className="text-xs text-muted-foreground mt-1">= {timeToMs(form.pickup_close).toLocaleString()} ms</p></div>
          </div>
          <div><Label>Est. Pickup Time (mins)</Label><Input type="number" value={form.estimated_pickup_mins} onChange={e => set('estimated_pickup_mins', e.target.value)} className="mt-1.5 w-40" /></div>
        </div>

        <Button className="w-full h-12 font-bold gap-2" onClick={handleSave}><Save className="w-5 h-5" />Save Settings</Button>
      </div>
    </div>
  );
}