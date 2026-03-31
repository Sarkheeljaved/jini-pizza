import React from 'react';
import { motion } from 'framer-motion';
import { Beef, Pizza, Cookie, CupSoda, IceCreamCone, UtensilsCrossed } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All', icon: UtensilsCrossed },
  { id: 'burgers', label: 'Burgers', icon: Beef },
  { id: 'pizzas', label: 'Pizzas', icon: Pizza },
  { id: 'sides', label: 'Sides', icon: Cookie },
  { id: 'drinks', label: 'Drinks', icon: CupSoda },
  { id: 'desserts', label: 'Desserts', icon: IceCreamCone },
  { id: 'combos', label: 'Combos', icon: UtensilsCrossed },
];

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = selected === cat.id;
        return (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap font-medium text-sm transition-all border ${
              isActive
                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25'
                : 'bg-card text-foreground border-border hover:border-primary/50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {cat.label}
          </motion.button>
        );
      })}
    </div>
  );
}