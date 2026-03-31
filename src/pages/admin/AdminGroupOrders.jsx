import React from 'react';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Users, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminGroupOrders() {
  const { groupOrders } = useApp();

  const copyCode = (code) => { navigator.clipboard.writeText(code); toast.success('Code copied!'); };

  return (
    <div className="p-6">
      <h2 className="font-heading text-xl font-bold mb-6">Group Orders ({groupOrders.length})</h2>

      {groupOrders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No group orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupOrders.map(group => (
            <div key={group.id} className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading font-bold text-lg">{group.name}</h3>
                  <p className="text-sm text-muted-foreground">Host: {group.host_name} · {group.order_type}</p>
                  {group.created_date && <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(group.created_date), 'MMM d, yyyy h:mm a')}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Share Code</p>
                    <p className="font-mono font-bold text-xl text-primary tracking-widest">{group.share_code}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyCode(group.share_code)} className="gap-1">
                    <Copy className="w-3.5 h-3.5" />Copy
                  </Button>
                  <Badge className={group.status === 'open' ? 'bg-green-100 text-green-700' : group.status === 'locked' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}>
                    {group.status}
                  </Badge>
                </div>
              </div>

              {group.members?.length > 0 && (
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium mb-3">{group.members.length} member(s)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.members.map((m, i) => (
                      <div key={i} className="bg-muted/50 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{m.member_name}</span>
                          <span className="font-bold text-sm text-primary">${m.subtotal?.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{m.items?.map(i => `${i.product_name} x${i.quantity}`).join(', ')}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-3 pt-3 border-t border-border">
                    <span className="font-heading font-bold">Group Total: <span className="text-primary">${group.total_amount?.toFixed(2)}</span></span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}