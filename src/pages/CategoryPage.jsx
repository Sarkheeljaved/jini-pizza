import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Flame } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { categories, subCategories } = useApp();

  const category = categories.find(c => c.id === categoryId);
  const subs = subCategories
    .filter(s => s.category_id === categoryId && s.is_active !== false)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />Back to Menu
      </Link>

      <div className="flex items-center gap-4 mb-8">
        {category?.image_url
          ? <img src={category.image_url} alt={category.name} className="w-16 h-16 rounded-2xl object-cover" />
          : <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">{category?.icon_emoji || '🍽️'}</div>
        }
        <div>
          <h1 className="font-heading text-3xl font-bold">{category?.name || 'Category'}</h1>
          {category?.description && <p className="text-muted-foreground mt-1">{category.description}</p>}
        </div>
      </div>

      {subs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No items in this category yet.</div>
      ) : (
        <div className="space-y-3">
          {subs.map((sub, i) => (
            <motion.div key={sub.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link to={`/category/${categoryId}/item/${sub.id}`}>
                <div className="group flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-primary hover:shadow-md transition-all duration-200">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {sub.image_url
                      ? <img src={sub.image_url} alt={sub.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      : <div className="w-full h-full flex items-center justify-center"><Flame className="w-8 h-8 text-muted-foreground/30" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-base">{sub.name}</h3>
                    {sub.description && <p className="text-muted-foreground text-sm mt-0.5 line-clamp-2">{sub.description}</p>}
                    <p className="text-primary font-bold mt-1">From ${sub.base_price?.toFixed(2)}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}