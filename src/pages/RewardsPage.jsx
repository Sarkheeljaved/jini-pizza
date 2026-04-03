import React from 'react';
import { motion } from 'framer-motion';
import { Star, Gift, Trophy, Zap, ArrowRight, ShoppingBag, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

const TIERS = [
  { name: 'Bronze',   min: 0,    max: 500,  color: 'from-orange-600 to-amber-700',  icon: '🥉', perks: ['1 point per $1', 'Birthday bonus 50pts'] },
  { name: 'Silver',   min: 500,  max: 1500, color: 'from-slate-400 to-slate-600',    icon: '🥈', perks: ['1.5x points', 'Free delivery at 750pts'] },
  { name: 'Gold',     min: 1500, max: 3000, color: 'from-yellow-400 to-yellow-600',  icon: '🥇', perks: ['2x points', 'Monthly free item'] },
  { name: 'Platinum', min: 3000, max: Infinity, color: 'from-purple-400 to-purple-700', icon: '💎', perks: ['3x points', 'Priority delivery', 'VIP perks'] },
];

const REWARDS = [
  { id: 'r1', name: '$2 Off Your Order',   points: 200,  icon: '🎟️', color: 'bg-blue-50 border-blue-200' },
  { id: 'r2', name: 'Free Fries',          points: 350,  icon: '🍟', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'r3', name: '$5 Off Your Order',   points: 500,  icon: '💵', color: 'bg-green-50 border-green-200' },
  { id: 'r4', name: 'Free Drink',          points: 400,  icon: '🥤', color: 'bg-purple-50 border-purple-200' },
  { id: 'r5', name: 'Free Delivery',       points: 300,  icon: '🚚', color: 'bg-orange-50 border-orange-200' },
  { id: 'r6', name: '$10 Off Your Order',  points: 1000, icon: '🎁', color: 'bg-red-50 border-red-200' },
];

export default function RewardsPage() {
  const { currentUser, rewards, redeemReward } = useApp();
  const points = rewards?.points || 0;
  const history = rewards?.history || [];

  const currentTier = TIERS.slice().reverse().find(t => points >= t.min) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const progressToNext = nextTier ? Math.round(((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100) : 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="font-heading text-3xl font-bold mb-6">My Rewards</h1>

      {/* Points card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`relative overflow-hidden bg-gradient-to-br ${currentTier.color} rounded-3xl p-6 text-white mb-6`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-10 -translate-x-10" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/70 text-sm">Total Points</p>
              <p className="font-heading text-5xl font-bold">{points.toLocaleString()}</p>
              <p className="text-white/80 text-sm mt-1">≈ ${(points / 100).toFixed(2)} value</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-1">{currentTier.icon}</div>
              <p className="font-bold text-lg">{currentTier.name}</p>
              <p className="text-white/70 text-xs">Member</p>
            </div>
          </div>
          {nextTier && (
            <div>
              <div className="flex justify-between text-xs text-white/80 mb-1.5">
                <span>{points} pts</span>
                <span>{nextTier.name} at {nextTier.min} pts</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full bg-white rounded-full" />
              </div>
              <p className="text-white/70 text-xs mt-1.5">{nextTier.min - points} pts until {nextTier.name}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: ShoppingBag, label: 'Earn', desc: '1 pt per $1 spent' },
          { icon: Zap,         label: 'Level Up', desc: 'Unlock better tiers' },
          { icon: Gift,        label: 'Redeem', desc: 'Get discounts & free items' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="bg-card rounded-2xl border border-border p-4 text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <p className="font-semibold text-sm">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Redeem Rewards */}
      <div className="mb-6">
        <h2 className="font-heading text-xl font-bold mb-4">Redeem Rewards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REWARDS.map((reward, i) => {
            const canAfford = points >= reward.points;
            return (
              <motion.div key={reward.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 ${canAfford ? reward.color : 'bg-muted/30 border-border opacity-60'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{reward.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{reward.name}</p>
                    <p className="text-xs text-muted-foreground">{reward.points} pts</p>
                  </div>
                </div>
                <Button size="sm" disabled={!canAfford} onClick={() => redeemReward(reward)} className="gap-1 text-xs">
                  {canAfford ? <><Gift className="w-3 h-3" />Redeem</> : <><Lock className="w-3 h-3" />Locked</>}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tiers */}
      <div className="mb-6">
        <h2 className="font-heading text-xl font-bold mb-4">Membership Tiers</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TIERS.map(tier => (
            <div key={tier.name} className={`rounded-2xl p-4 bg-gradient-to-br ${tier.color} text-white ${currentTier.name === tier.name ? 'ring-2 ring-offset-2 ring-primary' : ''}`}>
              <div className="text-2xl mb-2">{tier.icon}</div>
              <p className="font-bold text-sm">{tier.name}</p>
              <p className="text-white/70 text-xs">{tier.min.toLocaleString()}+ pts</p>
              <ul className="mt-2 space-y-0.5">
                {tier.perks.map(perk => <li key={perk} className="text-xs text-white/80">• {perk}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Points History */}
      {history.length > 0 && (
        <div>
          <h2 className="font-heading text-xl font-bold mb-4">Points History</h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {history.slice(0, 10).map((h, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-sm">{h.label}</p>
                  <p className="text-xs text-muted-foreground">{h.date}</p>
                </div>
                <span className={`font-bold ${h.pts > 0 ? 'text-green-600' : 'text-red-500'}`}>{h.pts > 0 ? '+' : ''}{h.pts} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length === 0 && (
        <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-2xl">
          <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No points yet — place an order to start earning!</p>
          <Link to="/"><Button className="mt-4 gap-2">Browse Menu<ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
      )}
    </div>
  );
}