import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, ShoppingCart, Heart, Flame, Clock, Zap, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';

function StarRating({ value, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button" onClick={() => onChange?.(star)} onMouseEnter={() => onChange && setHovered(star)} onMouseLeave={() => onChange && setHovered(0)} className={onChange ? 'cursor-pointer' : 'cursor-default'}>
          <Star className={`${sz} transition-colors ${(hovered || value) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ stars, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-3 text-muted-foreground">{stars}</span>
      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full bg-yellow-400 rounded-full" />
      </div>
      <span className="w-6 text-muted-foreground text-right">{count}</span>
    </div>
  );
}

const SPICE_COLORS = { mild: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', hot: 'bg-orange-100 text-orange-700', extra_hot: 'bg-red-100 text-red-700' };

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { products, addToCart, toggleWishlist, isWishlisted, orders, currentUser, reviews, addReview } = useApp();

  const product = products.find(p => p.id === productId);
  const productReviews = (reviews || []).filter(r => r.product_id === productId);

  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  // Check if user is a verified buyer
  const isVerifiedBuyer = orders.some(o =>
    o.items?.some(i => i.product_id === productId) && currentUser
  );
  const hasAlreadyReviewed = productReviews.some(r => r.user_email === currentUser?.email);

  const avgRating = productReviews.length > 0 ? productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(s => ({ stars: s, count: productReviews.filter(r => r.rating === s).length }));

  if (!product) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h2 className="font-heading text-xl font-bold mb-4">Product not found</h2>
      <Link to="/"><Button>Back to Menu</Button></Link>
    </div>
  );

  const handleSubmitReview = async () => {
    if (!reviewForm.rating) { toast.error('Please select a star rating'); return; }
    if (!reviewForm.comment.trim()) { toast.error('Please write a comment'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    addReview({
      product_id: productId,
      user_name: currentUser?.name || 'Anonymous',
      user_email: currentUser?.email,
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
      verified_buyer: isVerifiedBuyer,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    });
    setReviewForm({ rating: 0, comment: '' });
    setSubmitting(false);
    toast.success('Review submitted!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />Back to Menu
      </Link>

      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="relative rounded-3xl overflow-hidden bg-muted aspect-square md:aspect-auto md:h-80">
          {product.image_url
            ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center"><Flame className="w-20 h-20 text-muted-foreground/20" /></div>
          }
          {product.is_featured && <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground font-bold">⭐ Featured</Badge>}
          <button onClick={() => toggleWishlist(product)} className="absolute top-4 right-4 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow">
            <Heart className={`w-5 h-5 transition-colors ${isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </button>
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="font-heading text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5">
              <StarRating value={Math.round(avgRating)} size="sm" />
              <span className="font-bold text-sm">{avgRating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground text-sm">({productReviews.length} {productReviews.length === 1 ? 'review' : 'reviews'})</span>
          </div>
          <p className="text-muted-foreground mb-4">{product.description}</p>

          <div className="flex flex-wrap gap-2 mb-5">
            {product.spice_level && <Badge className={SPICE_COLORS[product.spice_level]}><Flame className="w-3 h-3 mr-1" />{product.spice_level.replace('_', ' ')}</Badge>}
            {product.calories && <Badge variant="outline"><Zap className="w-3 h-3 mr-1" />{product.calories} cal</Badge>}
            {product.prep_time_mins && <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />{product.prep_time_mins} min</Badge>}
            <Badge className={product.is_available !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>{product.is_available !== false ? 'Available' : 'Sold Out'}</Badge>
          </div>

          <p className="font-heading text-3xl font-bold text-primary mb-5">${product.price?.toFixed(2)}</p>

          <Button size="lg" className="gap-2 font-bold" disabled={product.is_available === false} onClick={() => { addToCart(product); toast.success('Added to cart!'); }}>
            <ShoppingCart className="w-5 h-5" />Add to Cart
          </Button>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Reviews Section */}
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          Customer Reviews
        </h2>

        {productReviews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* Average score */}
            <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-5">
              <div className="text-center">
                <p className="font-heading text-5xl font-bold text-primary">{avgRating.toFixed(1)}</p>
                <StarRating value={Math.round(avgRating)} size="sm" />
                <p className="text-xs text-muted-foreground mt-1">{productReviews.length} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {ratingCounts.map(({ stars, count }) => (
                  <RatingBar key={stars} stars={stars} count={count} total={productReviews.length} />
                ))}
              </div>
            </div>

            {/* Verified buyers note */}
            <div className="bg-green-50 dark:bg-green-950/20 rounded-2xl border border-green-200 dark:border-green-800 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-800 dark:text-green-300">Verified Reviews</p>
                <p className="text-sm text-green-700 dark:text-green-400 mt-0.5">Reviews are from customers who have ordered this item. Look for the ✓ badge for verified buyers.</p>
              </div>
            </div>
          </div>
        )}

        {/* Review list */}
        <div className="space-y-4 mb-8">
          <AnimatePresence>
            {productReviews.map((review, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                      {review.user_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{review.user_name}</p>
                        {review.verified_buyer && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Verified</span>}
                      </div>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <StarRating value={review.rating} size="sm" />
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed pl-12">{review.comment}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {productReviews.length === 0 && (
            <div className="text-center py-10 text-muted-foreground bg-muted/30 rounded-2xl">
              <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No reviews yet — be the first to review!</p>
            </div>
          )}
        </div>

        {/* Write a review */}
        {currentUser && !hasAlreadyReviewed && (
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="font-heading font-bold mb-4">Write a Review</h3>
            {!isVerifiedBuyer && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl mb-4 text-sm text-yellow-700">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                You haven't ordered this item yet. You can still review, but it won't show as Verified.
              </div>
            )}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Your Rating</p>
              <StarRating value={reviewForm.rating} onChange={r => setReviewForm(p => ({ ...p, rating: r }))} />
            </div>
            <Textarea value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} placeholder="Share your experience with this item..." className="mb-4 min-h-[80px]" />
            <Button onClick={handleSubmitReview} disabled={submitting || !reviewForm.rating || !reviewForm.comment.trim()} className="gap-2">
              {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Star className="w-4 h-4" />}
              Submit Review
            </Button>
          </div>
        )}
        {currentUser && hasAlreadyReviewed && (
          <div className="text-center py-4 text-muted-foreground text-sm bg-muted/30 rounded-xl">You've already reviewed this product. Thank you!</div>
        )}
        {!currentUser && (
          <div className="text-center py-6 bg-muted/30 rounded-2xl">
            <p className="text-muted-foreground mb-3">Sign in to leave a review</p>
            <Link to="/login"><Button variant="outline">Sign In</Button></Link>
          </div>
        )}
      </div>
    </div>
  );
}