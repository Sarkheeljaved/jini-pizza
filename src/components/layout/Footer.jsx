import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, MapPin, Phone, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-lg">Jini<span className="text-primary">Pizza</span></span> */}
               <img
              className="w-40 h-30 bg-none rounded-xl flex items-center justify-center"
              src="/logo-brand-name-jinipizza-removebg-preview.png"
              alt=""
            />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fresh ingredients, bold flavors, blazing fast delivery. Your favorite fast food, just a tap away.
            </p>
            <div className="flex gap-3 mt-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <div key={i} className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[['/', 'Menu'], ['/cart', 'Cart'], ['/wishlist', 'Wishlist'], ['/orders', 'My Orders'], ['/group-order', 'Group Order']].map(([href, label]) => (
                <li key={href}><Link to={href} className="hover:text-primary transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Help */}
          {/* <div>
            <h4 className="font-heading font-bold mb-4">Help & Info</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {['Track Order', 'FAQs', 'Allergen Info', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}><span className="hover:text-primary transition-colors cursor-pointer">{item}</span></li>
              ))}
            </ul>
          </div> */}

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" /><span>89 City Rd, Cardiff, CF24 3BN</span></li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary flex-shrink-0" /><span>029 2048 4705</span></li>
              {/* <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary flex-shrink-0" /><span>hello@JiniPizza.com</span></li> */}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© 2026 JiniPizza. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>We accept:</span>
            <div className="flex gap-2">
              {['Visa', 'MC', 'PayPal', 'GPay'].map(m => (
                <span key={m} className="px-2 py-0.5 bg-muted rounded text-xs font-medium">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}