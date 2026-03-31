import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CategoryGrid({ categories }) {
  if (!categories.length) return null;

  return (
    <div className="mb-10">
      <h2 className="font-heading text-xl font-bold mb-4">Browse Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={`/category/${cat.id}`}>
              <div className="group relative overflow-hidden rounded-2xl border-2 border-border hover:border-primary transition-all duration-200 cursor-pointer bg-card hover:shadow-lg hover:-translate-y-1">
                {/* Image or gradient */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-5xl">{cat.icon_emoji || '🍽️'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {cat.badge && (
                    <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-bold">
                      {cat.badge}
                    </Badge>
                  )}
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="text-lg mr-2">{cat.icon_emoji}</span>
                    <span className="font-heading font-semibold text-sm">{cat.name}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}