import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Copy, Link2, ShoppingCart, Lock, Check, ArrowRight, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

function generateCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

export default function GroupOrderPage() {
  const navigate = useNavigate();
  const { cart, createGroupOrder, updateGroupOrder, findGroupByCode, groupOrders } = useApp();
  const [mode, setMode] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [memberName, setMemberName] = useState('');
  const [createForm, setCreateForm] = useState({ name: '', hostName: '', orderType: 'delivery', address: '' });

  const totalItems = cart.reduce((s, i) => s + (i.quantity || 1), 0);

  const handleCreate = () => {
    if (!createForm.name || !createForm.hostName) { toast.error('Fill all fields'); return; }
    const code = generateCode();
    const group = createGroupOrder({
      name: createForm.name, host_name: createForm.hostName, share_code: code,
      status: 'open', order_type: createForm.orderType, delivery_address: createForm.address, members: [], total_amount: 0,
    });
    setActiveGroup(group);
    setMode('active');
    toast.success(`Group created! Share code: ${code}`);
  };

  const handleJoin = () => {
    const group = findGroupByCode(joinCode);
    if (!group) { toast.error('No group found with that code'); return; }
    if (group.status !== 'open') { toast.error('This group is no longer accepting members'); return; }
    setActiveGroup(group);
    setMode('active');
    toast.success(`Joined "${group.name}"!`);
  };

  const handleAddItems = () => {
    if (!memberName.trim()) { toast.error('Enter your name'); return; }
    if (totalItems === 0) { toast.error('Add items to your cart first'); return; }
    const myItems = cart.map(i => ({ product_name: i.product_name, quantity: i.quantity || 1, price: i.price }));
    const subtotal = myItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const members = [...(activeGroup.members || []), { member_name: memberName, items: myItems, subtotal }];
    const total = members.reduce((s, m) => s + m.subtotal, 0);
    const updated = updateGroupOrder(activeGroup.id, { members, total_amount: total });
    setActiveGroup(updated);
    toast.success('Your items added!');
  };

  const handleLock = () => {
    const updated = updateGroupOrder(activeGroup.id, { status: 'locked' });
    setActiveGroup(updated);
    toast.success('Group locked!');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(activeGroup.share_code);
    toast.success('Code copied!');
  };

  if (!mode) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold">Group Order</h1>
          <p className="text-muted-foreground mt-2">Order together! Everyone picks their own items.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => setMode('create')} className="p-6 bg-card rounded-2xl border-2 border-border hover:border-primary text-left">
            <Plus className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-heading font-bold text-lg">Start a Group Order</h3>
            <p className="text-muted-foreground text-sm mt-1">Create and share a code with friends</p>
          </motion.button>
          <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => setMode('join')} className="p-6 bg-card rounded-2xl border-2 border-border hover:border-primary text-left">
            <Link2 className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-heading font-bold text-lg">Join a Group Order</h3>
            <p className="text-muted-foreground text-sm mt-1">Enter a share code to join</p>
          </motion.button>
        </div>

        {/* Active groups */}
        {groupOrders.filter(g => g.status === 'open').length > 0 && (
          <div>
            <h3 className="font-heading font-bold mb-3">Active Groups</h3>
            <div className="space-y-2">
              {groupOrders.filter(g => g.status === 'open').map(g => (
                <button key={g.id} onClick={() => { setActiveGroup(g); setMode('active'); }}
                  className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary transition-all">
                  <div>
                    <p className="font-semibold text-sm">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{g.members?.length || 0} members · Code: <span className="font-mono font-bold text-primary">{g.share_code}</span></p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-heading text-2xl font-bold mb-6">Start Group Order</h1>
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <div><Label>Group Name</Label><Input value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Office Lunch" className="mt-1.5" /></div>
          <div><Label>Your Name (Host)</Label><Input value={createForm.hostName} onChange={e => setCreateForm(p => ({ ...p, hostName: e.target.value }))} placeholder="Your name" className="mt-1.5" /></div>
          <div>
            <Label>Order Type</Label>
            <div className="flex gap-2 mt-1.5">
              {['delivery', 'pickup'].map(t => <Button key={t} variant={createForm.orderType === t ? 'default' : 'outline'} size="sm" onClick={() => setCreateForm(p => ({ ...p, orderType: t }))} className="flex-1 capitalize">{t}</Button>)}
            </div>
          </div>
          {createForm.orderType === 'delivery' && <div><Label>Delivery Address</Label><Input value={createForm.address} onChange={e => setCreateForm(p => ({ ...p, address: e.target.value }))} className="mt-1.5" /></div>}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setMode(null)}>Cancel</Button>
            <Button className="flex-1" onClick={handleCreate}>Create Group</Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-heading text-2xl font-bold mb-6">Join Group Order</h1>
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <div><Label>Share Code</Label><Input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="e.g. AB3XY" className="mt-1.5 font-mono text-2xl tracking-widest text-center" maxLength={5} /></div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setMode(null)}>Cancel</Button>
            <Button className="flex-1" disabled={joinCode.length < 5} onClick={handleJoin}>Join Group</Button>
          </div>
        </div>
      </div>
    );
  }

  // Active group
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-card rounded-2xl border border-border p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div><h1 className="font-heading text-xl font-bold">{activeGroup.name}</h1><p className="text-muted-foreground text-sm">Host: {activeGroup.host_name}</p></div>
          <Badge className={activeGroup.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
            {activeGroup.status === 'open' ? 'Open' : 'Locked'}
          </Badge>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
          <div>
            <p className="text-xs text-muted-foreground">Share Code — send this to friends</p>
            <p className="font-mono font-bold text-3xl tracking-[0.3em] text-primary">{activeGroup.share_code}</p>
          </div>
          <Button size="sm" variant="outline" onClick={copyCode} className="ml-auto gap-1"><Copy className="w-3.5 h-3.5" />Copy</Button>
        </div>
      </div>

      {activeGroup.members?.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          <h3 className="font-heading font-bold mb-3">Members ({activeGroup.members.length})</h3>
          <div className="space-y-3">
            {activeGroup.members.map((m, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"><span className="text-sm font-bold text-primary">{m.member_name[0]?.toUpperCase()}</span></div>
                  <div><p className="font-medium text-sm">{m.member_name}</p><p className="text-xs text-muted-foreground">{m.items?.length} items</p></div>
                </div>
                <span className="font-bold text-sm">${m.subtotal?.toFixed(2)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold"><span>Group Total</span><span className="text-primary">${activeGroup.total_amount?.toFixed(2)}</span></div>
          </div>
        </div>
      )}

      {activeGroup.status === 'open' && (
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          <h3 className="font-heading font-bold mb-3">Add Your Items</h3>
          <div className="mb-3"><Label>Your Name</Label><Input value={memberName} onChange={e => setMemberName(e.target.value)} placeholder="Enter your name" className="mt-1.5" /></div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-xl mb-3">
            <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            <div><p className="text-sm font-medium">{totalItems} items in your cart</p><p className="text-xs text-muted-foreground">${cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0).toFixed(2)}</p></div>
            <Link to="/" className="ml-auto"><Button size="sm" variant="outline" className="gap-1"><Plus className="w-3 h-3" />Browse</Button></Link>
          </div>
          <Button className="w-full gap-2" disabled={!memberName || totalItems === 0} onClick={handleAddItems}><Check className="w-4 h-4" />Confirm My Items</Button>
        </div>
      )}

      {activeGroup.status === 'open' && (
        <Button variant="outline" className="w-full gap-2 border-orange-300 text-orange-600 hover:bg-orange-50 mb-3" onClick={handleLock} disabled={!activeGroup.members?.length}>
          <Lock className="w-4 h-4" />Lock Group & Place Order
        </Button>
      )}
      {activeGroup.status === 'locked' && (
        <Link to="/checkout"><Button className="w-full gap-2 h-12 font-bold"><ChefHat className="w-5 h-5" />Proceed to Checkout<ArrowRight className="w-4 h-4" /></Button></Link>
      )}
      <Button variant="ghost" className="w-full mt-2" onClick={() => setMode(null)}>← Back to Group Orders</Button>
    </div>
  );
}