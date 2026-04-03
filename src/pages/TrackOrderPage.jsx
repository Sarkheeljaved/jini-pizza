import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, CheckCircle2, ChefHat, Bike, Package, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

const TRACKING_STEPS = [
  { id: 'pending',    label: 'Order Confirmed',    icon: CheckCircle2, desc: 'Your order has been received', color: 'text-blue-500',   bg: 'bg-blue-100' },
  { id: 'preparing',  label: 'Preparing Your Food', icon: ChefHat,      desc: 'Our chefs are cooking your meal', color: 'text-orange-500', bg: 'bg-orange-100' },
  { id: 'driver',     label: 'Driver Assigned',    icon: Bike,         desc: 'A driver is on the way to pick up', color: 'text-purple-500', bg: 'bg-purple-100' },
  { id: 'ready',      label: 'Picking Up',         icon: Package,      desc: 'Driver is collecting your order', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { id: 'delivered',  label: 'Out for Delivery',   icon: MapPin,       desc: 'Your order is on the way!', color: 'text-green-600',  bg: 'bg-green-100' },
];

const STATUS_TO_STEP = {
  pending: 0, confirmed: 0, preparing: 1, ready: 3, delivered: 4, cancelled: -1,
};

// Fake driver positions cycling around a path
const DRIVER_POSITIONS = [
  { x: 20, y: 70 }, { x: 30, y: 55 }, { x: 45, y: 45 }, { x: 60, y: 38 },
  { x: 72, y: 50 }, { x: 78, y: 62 }, { x: 72, y: 72 }, { x: 60, y: 75 },
];

const MAP_ROUTE = "M 40,160 Q 80,120 120,100 Q 160,80 200,90 Q 240,100 260,130 Q 280,160 260,180 Q 240,200 200,200 Q 160,200 140,185";

export default function TrackOrderPage() {
  const { orderId } = useParams();
  const { orders } = useApp();
  const order = orders.find(o => o.id === orderId);

  const [driverPos, setDriverPos] = useState(0);
  const [simStep, setSimStep] = useState(0);
  const [eta, setEta] = useState(32);

  const statusStep = order ? (STATUS_TO_STEP[order.status] ?? 0) : simStep;
  const currentStep = Math.max(statusStep, simStep);

  // Animate driver position
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPos(p => (p + 1) % DRIVER_POSITIONS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Simulate steps progressing for demo
  useEffect(() => {
    if (order?.status === 'delivered') return;
    const t1 = setTimeout(() => setSimStep(1), 4000);
    const t2 = setTimeout(() => setSimStep(2), 9000);
    const t3 = setTimeout(() => setSimStep(3), 15000);
    const t4 = setTimeout(() => setSimStep(4), 22000);
    const timer = setInterval(() => setEta(e => Math.max(1, e - 1)), 30000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearInterval(timer); };
  }, [order?.status]);

  const driverXY = DRIVER_POSITIONS[driverPos];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-heading text-2xl font-bold mb-4">Order not found</h2>
        <Link to="/orders"><Button>My Orders</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <Link to="/orders" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />Back to Orders
      </Link>

      <h1 className="font-heading text-2xl font-bold mb-1">Track Your Order</h1>
      <p className="text-muted-foreground text-sm mb-6">Order #{order.id?.slice(-6)}</p>

      {/* ETA Banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 p-4 bg-primary text-primary-foreground rounded-2xl mb-6">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm opacity-80">Estimated Arrival</p>
          <p className="font-heading font-bold text-2xl">{eta} mins</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm opacity-80">Driver</p>
          <p className="font-semibold">Alex K.</p>
          <button className="flex items-center gap-1 text-xs opacity-80 hover:opacity-100 mt-0.5">
            <Phone className="w-3 h-3" />Call
          </button>
        </div>
      </motion.div>

      {/* Animated Map */}
      <div className="relative bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-2xl border border-border overflow-hidden mb-6" style={{ height: 220 }}>
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 220">
          {[0,1,2,3,4,5].map(i => <line key={`h${i}`} x1="0" y1={i*44} x2="300" y2={i*44} stroke="currentColor" strokeWidth="1" />)}
          {[0,1,2,3,4,5,6].map(i => <line key={`v${i}`} x1={i*50} y1="0" x2={i*50} y2="220" stroke="currentColor" strokeWidth="1" />)}
        </svg>

        {/* Roads */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 220">
          <path d={MAP_ROUTE} fill="none" stroke="#d1d5db" strokeWidth="12" strokeLinecap="round" />
          <path d={MAP_ROUTE} fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeDasharray="8 6" />
        </svg>

        {/* Buildings (fake) */}
        {[[30,40,20,30,'bg-blue-200'],[80,30,25,35,'bg-orange-200'],[180,40,18,28,'bg-purple-200'],[230,50,22,32,'bg-green-200'],[100,140,20,25,'bg-yellow-200'],[250,160,18,22,'bg-pink-200']].map(([x,y,w,h,c], i) => (
          <div key={i} className={`absolute rounded-sm ${c} opacity-70`} style={{ left: `${x/3}%`, top: y, width: w, height: h }} />
        ))}

        {/* Destination pin */}
        <div className="absolute" style={{ left: '80%', top: '60%' }}>
          <div className="relative">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500" />
          </div>
        </div>

        {/* Animated driver */}
        <motion.div
          className="absolute"
          animate={{ left: `${driverXY.x}%`, top: `${driverXY.y}%` }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{ left: `${driverXY.x}%`, top: `${driverXY.y}%` }}
        >
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-xl border-2 border-white">
              <Bike className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <motion.div animate={{ scale: [1, 2], opacity: [0.4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 rounded-full bg-primary/30" />
          </div>
        </motion.div>

        <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-medium flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Live Tracking
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-heading font-semibold mb-5">Delivery Status</h3>
        <div className="space-y-1">
          {TRACKING_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const isFuture = index > currentStep;
            return (
              <div key={step.id}>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isCompleted ? 'bg-primary text-primary-foreground' : isActive ? `${step.bg} ${step.color}` : 'bg-muted text-muted-foreground'}`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    {index < TRACKING_STEPS.length - 1 && (
                      <div className="w-0.5 h-8 mt-1 transition-all duration-700" style={{ background: isCompleted ? 'hsl(var(--primary))' : 'hsl(var(--border))' }} />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={`font-semibold text-sm transition-all ${isFuture ? 'text-muted-foreground' : 'text-foreground'}`}>{step.label}</p>
                    <p className={`text-xs transition-all ${isFuture ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>{step.desc}</p>
                    {isActive && (
                      <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3, repeat: Infinity }} className="mt-2 h-1 bg-primary rounded-full max-w-xs" />
                    )}
                  </div>
                  {isActive && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-auto">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall progress bar */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Overall Progress</span>
            <span>{Math.round((currentStep / (TRACKING_STEPS.length - 1)) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}