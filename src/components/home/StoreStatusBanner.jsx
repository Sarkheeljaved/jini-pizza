import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Store, Clock, CheckCircle2, XCircle } from 'lucide-react';

function msToTimeLabel(ms) {
  if (!ms && ms !== 0) return '--:--';
  const totalMinutes = Math.floor(ms / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function getNowMs() {
  const now = new Date();
  return (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) * 1000;
}

function isOpen(openMs, closeMs) {
  if (openMs == null || closeMs == null) return false;
  const now = getNowMs();
  return now >= openMs && now < closeMs;
}

export default function StoreStatusBanner({ settings }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  if (!settings) return null;

  const deliveryOpen = settings.delivery_enabled && isOpen(settings.delivery_open_time_ms, settings.delivery_close_time_ms);
  const pickupOpen = settings.pickup_enabled && isOpen(settings.pickup_open_time_ms, settings.pickup_close_time_ms);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row gap-3 mb-6"
    >
      {/* Delivery */}
      {settings.delivery_enabled && (
        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl flex-1 border-2 ${
          deliveryOpen
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <Truck className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {deliveryOpen
                ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                : <XCircle className="w-4 h-4 text-red-500" />}
              <span className="font-bold text-sm">Delivery {deliveryOpen ? 'Open' : 'Closed'}</span>
            </div>
            <p className="text-xs opacity-70 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              {msToTimeLabel(settings.delivery_open_time_ms)} – {msToTimeLabel(settings.delivery_close_time_ms)}
              {deliveryOpen && settings.estimated_delivery_mins && (
                <span className="ml-1">· ~{settings.estimated_delivery_mins} min</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Pickup */}
      {settings.pickup_enabled && (
        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl flex-1 border-2 ${
          pickupOpen
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <Store className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {pickupOpen
                ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                : <XCircle className="w-4 h-4 text-red-500" />}
              <span className="font-bold text-sm">Pickup {pickupOpen ? 'Open' : 'Closed'}</span>
            </div>
            <p className="text-xs opacity-70 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              {msToTimeLabel(settings.pickup_open_time_ms)} – {msToTimeLabel(settings.pickup_close_time_ms)}
              {pickupOpen && settings.estimated_pickup_mins && (
                <span className="ml-1">· ~{settings.estimated_pickup_mins} min</span>
              )}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}