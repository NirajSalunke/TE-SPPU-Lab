import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Shield, Headphones, Zap } from 'lucide-react';
import ProductCard from '../components/shared/ProductCard';
import { PageSpinner } from '../components/ui/Spinner';
import { getProducts } from '../services/productService';

const CATEGORIES = [
  { name: 'Electronics', emoji: '📱', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { name: 'Clothing', emoji: '👗', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  { name: 'Books', emoji: '📚', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { name: 'Home & Kitchen', emoji: '🏠', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { name: 'Sports', emoji: '⚽', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { name: 'Beauty', emoji: '💄', color: 'bg-purple-50 border-purple-200 text-purple-700' },
];

const FEATURES = [
  { icon: Truck, title: 'Free Delivery', desc: 'On all orders above ₹999' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer care' },
  { icon: Zap, title: 'Fast Shipping', desc: '2-5 business days' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProducts({ featured: true, limit: 8 });
        setFeatured(data.products);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-400 rounded-full filter blur-3xl" />
        </div>
        <div className="container-custom py-24 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>New arrivals every week</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Discover Premium
              <span className="block text-primary-300">Products at</span>
              <span className="block">Great Prices</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-lg">
              Shop from thousands of curated products across Electronics, Fashion, Books and more. Free delivery on orders above ₹999.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/products" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
                <ShoppingBag className="w-5 h-5" />
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/products?featured=true" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
                View Featured
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-500 text-sm mt-1">Find exactly what you're looking for</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 ${cat.color} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-center`}
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-xs font-semibold leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 text-sm mt-1">Handpicked by our team just for you</p>
            </div>
            <Link to="/products?featured=true" className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <PageSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section bg-primary-600">
        <div className="container-custom text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to start shopping?</h2>
          <p className="text-primary-200 mb-6">Browse our full catalog of 20+ premium products</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors">
            Browse All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
