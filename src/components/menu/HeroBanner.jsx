import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroBanner({ onOrderNow }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary rounded-3xl mb-10">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-background rounded-full blur-3xl" />
      </div>

      <div className="relative px-6 sm:px-10 py-12 sm:py-16 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-background/20 backdrop-blur-sm text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Flame className="w-4 h-4" />
              Free delivery on orders over $25
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl font-bold text-primary-foreground leading-tight mb-4">
              Craving Something<br />
              <span className="text-accent">Delicious?</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-6 max-w-md">
              Fresh ingredients, bold flavors, blazing fast delivery. Your favorite meals, just a tap away.
            </p>
            <Button
              size="lg"
              onClick={onOrderNow}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base px-8 shadow-xl"
            >
              Order Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop"
            alt="Delicious burger"
            className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl object-cover shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
          />
        </motion.div>
      </div>
    </div>
  );
}