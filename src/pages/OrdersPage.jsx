import React from "react";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ChefHat,
  XCircle,
  Flame,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  preparing: {
    label: "Preparing",
    icon: ChefHat,
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  ready: {
    label: "Ready",
    icon: Package,
    color: "bg-green-100 text-green-700 border-green-200",
  },
  delivered: {
    label: "Delivered",
    icon: Truck,
    color: "bg-green-100 text-green-700 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-100 text-red-700 border-red-200",
  },
};

export default function OrdersPage() {
  const { orders } = useApp();
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">
            No orders yet
          </h2>
          <p className="text-muted-foreground mb-8">
            Place your first order from our delicious menu!
          </p>
          <Link to="/">
            <Button size="lg" className="font-semibold">
              Browse Menu
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="font-heading text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order, index) => {
          const status = statusConfig[order.status] || statusConfig.pending;
          const StatusIcon = status.icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {order.created_date &&
                      format(
                        new Date(order.created_date),
                        "MMM d, yyyy · h:mm a",
                      )}
                  </p>
                  <p className="font-heading font-bold text-lg">
                    Order #{order.id?.slice(-6)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${status.color} border font-medium gap-1.5 px-3 py-1`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={() => navigate(`/invoice/${order.id}`)}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Invoice
                  </Button>
                  {["pending", "confirmed", "preparing", "ready"].includes(
                    order.status,
                  ) && (
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={() => navigate(`/track/${order.id}`)}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      Track
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
                {order.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-muted/50 rounded-xl p-3 flex-shrink-0"
                  >
                    <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Flame className="w-6 h-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        x{item.quantity} · $
                        {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground capitalize">
                  {order.order_type?.replace("_", " ")} · {order.payment_method}
                </span>
                <span className="font-heading font-bold text-lg text-primary">
                  ${order.total?.toFixed(2)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
