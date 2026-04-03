import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Clock,
  Flame as FlameIcon,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";

const spiceColors = {
  mild: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hot: "bg-orange-100 text-orange-700",
  extra_hot: "bg-red-100 text-red-700",
};

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) {
  const { getProductRating } = useApp();
  const rating = getProductRating(product.id);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="bg-card rounded-2xl border border-border overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FlameIcon className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}

        {/* Wishlist Button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => onToggleWishlist(product)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
            isWishlisted
              ? "bg-primary text-primary-foreground"
              : "bg-card/80 text-foreground hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </motion.button>

        {/* Featured badge */}
        {product.is_featured && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-semibold">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Featured
          </Badge>
        )}

        {!product.is_available && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <span className="text-background font-bold text-lg">Sold Out</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link
            to={`/product/${product.id}`}
            className="font-heading font-semibold text-lg leading-tight hover:text-primary transition-colors"
          >
            {product.name}
          </Link>
          <span className="font-heading font-bold text-primary text-lg whitespace-nowrap">
            ${product.price?.toFixed(2)}
          </span>
        </div>
        {rating && (
          <div className="flex items-center gap-1.5 mb-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${s <= Math.round(rating.avg) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold">
              {rating.avg.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({rating.count})
            </span>
          </div>
        )}

        {product.description && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {product.spice_level && (
            <Badge
              variant="secondary"
              className={spiceColors[product.spice_level]}
            >
              <FlameIcon className="w-3 h-3 mr-1" />
              {product.spice_level.replace("_", " ")}
            </Badge>
          )}
          {product.prep_time_mins && (
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {product.prep_time_mins} min
            </Badge>
          )}
          {product.calories && (
            <Badge variant="outline" className="text-xs">
              {product.calories} cal
            </Badge>
          )}
        </div>

        {/* Add to cart */}
        <Button
          className="w-full gap-2 font-semibold"
          disabled={!product.is_available}
          onClick={() => onAddToCart(product)}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}
