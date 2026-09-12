import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Ruler,
  Maximize2,
  X,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/shop/ProductCard';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // User selections
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Image zoom state
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    api.get(`/products/slug/${slug}`)
      .then(({ data }) => {
        const prod = data.product;
        setProduct(prod);
        setActiveImage((prod.images && prod.images[0]) || '/logo.png');
        if (prod.sizes && prod.sizes.length > 0) {
          setSelectedSize(prod.sizes[0]);
        }

        // Fetch related products
        api.get(`/products/${prod._id}/related`)
          .then((relRes) => setRelatedProducts(relRes.data.products || []))
          .catch(() => {});

        // Fetch reviews
        api.get(`/reviews/product/${prod._id}`)
          .then((revRes) => setReviews(revRes.data.reviews || []))
          .catch(() => {});
      })
      .catch(() => {
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleMouseLeave = () => {
    setZoomPos((prev) => ({ ...prev, show: false }));
  };

  const handleAddToBag = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity, selectedSize);
    navigate('/checkout');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please login to leave an authentic review', 'info');
      navigate('/login');
      return;
    }

    if (!reviewComment.trim()) {
      addToast('Please write a review comment', 'error');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const { data } = await api.post(`/reviews/product/${product._id}`, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      setReviews([data.review, ...reviews]);
      setProduct((prev) => ({
        ...prev,
        rating: data.productRating,
        reviewCount: data.reviewCount,
      }));
      setReviewComment('');
      setReviewTitle('');
      addToast('Thank you! Your verified review has been published.', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-32 flex items-center justify-center text-luxury-gold">
        <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-32 flex flex-col items-center justify-center text-white text-center px-4">
        <h2 className="font-display text-2xl uppercase tracking-widest mb-3">Creation Not Found</h2>
        <p className="text-xs text-white/50 mb-6">The requested garment may have been archived into our private vault.</p>
        <Link to="/women" className="px-6 py-2.5 bg-luxury-gold text-black text-xs uppercase tracking-widest font-semibold">
          Discover Catalog
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);
  const activePrice = product.salePrice || product.price;

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-24 pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-white/50 flex items-center gap-2 tracking-wider uppercase font-sans">
        <Link to="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3 h-3 text-luxury-gold" />
        <Link to={`/${product.gender}`} className="hover:text-white">{product.gender}</Link>
        <ChevronRight className="w-3 h-3 text-luxury-gold" />
        <span className="text-luxury-gold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase: Left Gallery / Right Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: Multi-image Gallery with Zoom */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 pb-2 md:pb-0">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-[3/4] w-20 md:w-full border overflow-hidden shrink-0 transition-all ${
                    activeImage === img ? 'border-luxury-gold scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Interactive Zoom Stage */}
            <div
              className="relative flex-1 aspect-[3/4] overflow-hidden border border-white/15 bg-neutral-900 cursor-crosshair select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />

              {/* Zoom Lens Overlay */}
              {zoomPos.show && (
                <div
                  className="hidden md:block absolute inset-0 pointer-events-none bg-no-repeat"
                  style={{
                    backgroundImage: `url(${activeImage})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: '240%',
                  }}
                />
              )}

              {/* Fullscreen Trigger */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-4 right-4 p-2 bg-black/60 border border-white/20 text-white hover:text-luxury-gold hover:border-luxury-gold transition-colors z-10"
                aria-label="View Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT: Product Details & Buying Module */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Brand & Category line */}
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-luxury-gold font-medium mb-2">
              <span>{product.gender} &bull; {product.category}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-luxury-gold" />
                <span className="font-semibold text-white">{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
                <span className="text-white/40">({product.reviewCount || 0})</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-wide uppercase font-light text-white mb-4">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-white/10">
              <span className="font-serif text-3xl font-bold text-luxury-gold">
                ₹{activePrice.toLocaleString('en-IN')}
              </span>
              {product.salePrice && (
                <>
                  <span className="font-serif text-lg text-white/40 line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="bg-luxury-crimson text-white text-[10px] font-semibold uppercase px-2 py-0.5 tracking-widest">
                    Save ₹{(product.price - product.salePrice).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            {/* Short Narrative */}
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans mb-6">
              {product.description}
            </p>

            {/* Fabric Specification */}
            <div className="mb-6 p-3 bg-[#141414] border border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/60">Craftsmanship:</span>
              <span className="text-luxury-gold font-medium">{product.fabric}</span>
            </div>

            {/* Size Matrix */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-widest font-medium text-white">Select Size</span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-luxury-gold hover:underline"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide & Bespoke Tailoring</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.sizes?.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-all ${
                      selectedSize === sz
                        ? 'bg-luxury-gold text-black border-luxury-gold shadow-md'
                        : 'bg-transparent text-white border-white/20 hover:border-luxury-gold'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock status indicator */}
            <div className="mb-6 text-xs flex items-center gap-2">
              {product.stock <= 0 ? (
                <span className="text-red-400 font-medium">Currently Sold Out &bull; Inquire for Made-to-Order</span>
              ) : product.stock <= 3 ? (
                <span className="text-amber-400 font-medium">Limited Inventory &bull; Only {product.stock} bespoke pieces remaining</span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Available for immediate white-glove dispatch</span>
                </span>
              )}
            </div>

            {/* Action Buttons: Add to Bag & Buy Now */}
            <div className="space-y-3 mb-8">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToBag}
                  disabled={product.stock <= 0}
                  className="flex-1 py-4 bg-luxury-gold text-black font-display text-xs font-semibold tracking-[0.25em] uppercase hover:bg-luxury-gold-light transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Shopping Bag'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 border transition-colors ${
                    isWishlisted
                      ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/10'
                      : 'border-white/20 text-white hover:border-white'
                  }`}
                  aria-label="Toggle Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-luxury-gold' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-3.5 border border-white/40 text-white font-display text-xs font-semibold tracking-[0.25em] uppercase hover:border-luxury-gold hover:text-luxury-gold transition-colors text-center disabled:opacity-50"
              >
                Immediate Checkout &bull; Buy Now
              </button>
            </div>

            {/* Brand Commitments */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-luxury-gold" />
                <span>Insured Global Courier</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-luxury-gold" />
                <span>Certified Zari & Silk</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-luxury-gold" />
                <span>Complimentary Alterations</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-luxury-gold" />
                <span>Luxury Keepsake Box</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product In-Depth Tabs: Description, Care, Shipping, Reviews */}
        <div className="mt-20 border-t border-white/10 pt-10">
          <div className="flex border-b border-white/10 gap-8 overflow-x-auto text-xs uppercase tracking-[0.2em] font-medium mb-8">
            {['description', 'details', 'shipping', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 relative transition-colors whitespace-nowrap ${
                  activeTab === tab ? 'text-luxury-gold font-semibold' : 'text-white/60 hover:text-white'
                }`}
              >
                {tab === 'description' && 'Garment Story'}
                {tab === 'details' && 'Fabric & Care'}
                {tab === 'shipping' && 'White-Glove Delivery'}
                {tab === 'reviews' && `Client Reviews (${reviews.length})`}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-luxury-gold" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl text-xs sm:text-sm text-white/80 leading-relaxed">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <p>
                  Every silhouette designed at Dazzling Threads is crafted individually. From the tension of our pure metallic zardozi threads to the structural canvas lining, our garments guarantee a poise that honors lifetime memories.
                </p>
                <div className="mt-4 p-4 bg-[#111111] border border-white/10">
                  <p className="text-luxury-gold font-serif italic text-base">
                    “Dazzling Threads — Dulha Dulhan House represents the pinnacle of celebratory Indian craftsmanship.”
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-3">
                <p><strong className="text-white">Primary Fabric:</strong> {product.fabric}</p>
                <p><strong className="text-white">Embellishments:</strong> Hand-stitched Zardozi, Basra Pearl beads, Salma Sitara, and French Knots.</p>
                <p><strong className="text-white">Lining:</strong> 100% Breathable Mulmul and Silk Crepe.</p>
                <p><strong className="text-white">Care Instructions:</strong> Strictly professional dry clean only. Store in provided acid-free garment bag with muslin cover. Protect from moisture and direct sunlight.</p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3">
                <p><strong className="text-white">Standard Delivery:</strong> 3 to 5 business days across India via insured priority courier.</p>
                <p><strong className="text-white">Custom / Made-to-Measure:</strong> 14 to 21 working days for custom hand embroidery and tailoring.</p>
                <p><strong className="text-white">White-Glove Service:</strong> Every bridal and groom creation arrives in our signature velvet keepsake chest with certificate of authenticity.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Write Review Form */}
                <form onSubmit={handleSubmitReview} className="p-6 bg-[#121212] border border-white/10 space-y-4">
                  <h3 className="font-display text-sm uppercase tracking-widest text-luxury-gold font-semibold">
                    Write an Editorial Review
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/70">Your Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-0.5 text-luxury-gold"
                        >
                          <Star className={`w-4 h-4 ${reviewRating >= star ? 'fill-luxury-gold' : 'stroke-luxury-gold'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Review headline (e.g. Majestic craftsmanship for our royal wedding)"
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                  />

                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your personal experience with the fabric, fitting, and occasion presence..."
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                  />

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-2.5 bg-luxury-gold text-black text-xs uppercase tracking-widest font-semibold hover:bg-luxury-gold-light transition-colors disabled:opacity-50"
                  >
                    Submit Review
                  </button>
                </form>

                {/* Review List */}
                <div className="space-y-4 divide-y divide-white/10">
                  {reviews.length === 0 ? (
                    <p className="text-white/50 text-xs italic">Be the first to review this creation.</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev._id} className="pt-4 first:pt-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-xs">{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[9px] bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 px-1.5 py-0.5 uppercase tracking-wider">
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-white/40 font-sans">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-1 text-luxury-gold mb-1.5">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-luxury-gold" />
                          ))}
                        </div>
                        {rev.title && <h4 className="text-xs font-semibold text-white mb-1">{rev.title}</h4>}
                        <p className="text-xs text-white/70">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-white/10">
            <h3 className="font-display text-2xl uppercase tracking-widest text-center mb-8">
              Complementary Creations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 text-white hover:text-luxury-gold p-2"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={activeImage} alt={product.name} className="max-h-[90vh] max-w-full object-contain" />
        </div>
      )}

      {/* Elegant Size Guide & Custom Tailoring Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsSizeGuideOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#111111] border border-luxury-gold/50 p-6 sm:p-8 z-10 text-white max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="font-display text-lg uppercase tracking-widest text-luxury-gold font-semibold">
                  Size Guide & Bespoke Tailoring
                </h3>
                <p className="text-xs text-white/60 font-sans">Dulha Dulhan House Measurement Standards</p>
              </div>
              <button onClick={() => setIsSizeGuideOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Measurement Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/20 text-luxury-gold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Chest / Bust (in)</th>
                    <th className="py-2.5 px-3">Waist (in)</th>
                    <th className="py-2.5 px-3">Hips (in)</th>
                    <th className="py-2.5 px-3">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-white/80">
                  <tr><td className="py-2 px-3 font-semibold text-luxury-gold">XS</td><td>34</td><td>28</td><td>36</td><td>16.5</td></tr>
                  <tr><td className="py-2 px-3 font-semibold text-luxury-gold">S</td><td>36</td><td>30</td><td>38</td><td>17.0</td></tr>
                  <tr><td className="py-2 px-3 font-semibold text-luxury-gold">M</td><td>38</td><td>32</td><td>40</td><td>17.5</td></tr>
                  <tr><td className="py-2 px-3 font-semibold text-luxury-gold">L</td><td>40</td><td>34</td><td>42</td><td>18.0</td></tr>
                  <tr><td className="py-2 px-3 font-semibold text-luxury-gold">XL</td><td>42</td><td>36</td><td>44</td><td>18.5</td></tr>
                  <tr><td className="py-2 px-3 font-semibold text-luxury-gold">XXL</td><td>44</td><td>38</td><td>46</td><td>19.0</td></tr>
                  <tr className="bg-luxury-gold/10 font-medium text-luxury-gold">
                    <td className="py-2.5 px-3 font-bold">Custom</td>
                    <td colSpan={4} className="py-2.5 px-3">Made-to-Measure according to your exact personalized measurements</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 text-xs text-white/70 space-y-2">
              <p className="font-semibold text-white">Custom Made-to-Measure Assistance:</p>
              <p>
                When selecting "Custom", our Master Tailor concierge will contact you via WhatsApp or video consultation within 24 hours to record your 14-point bridal or groom measurements.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
