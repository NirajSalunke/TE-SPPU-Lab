import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../utils/formatCurrency';
import { PageSpinner } from '../components/ui/Spinner';
import EmptyState from '../components/shared/EmptyState';

export default function Cart() {
  const { cart, isLoading, fetchCart, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();
  const items = cart?.items || [];

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const subtotal = items.reduce((sum, item) => {
    const price = item.productId?.discountedPrice || item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  if (isLoading) return <PageSpinner />;

  return (
    <div className="container-custom py-8 animate-fade-in">
      <h1 className="page-title mb-6">Shopping Cart</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Let's fix that!"
          action={<Link to="/products" className="btn-primary btn-lg">Browse Products</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => {
              const p = item.productId;
              if (!p) return null;
              const price = p.discountedPrice || p.price;
              const image = p.images?.[0] || `https://picsum.photos/seed/${p._id}/80/80`;

              return (
                <div key={p._id} className="card p-4 flex gap-4 items-start">
                  <Link to={`/products/${p._id}`} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={image} alt={p.title} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${p._id}`} className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                      {p.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">{p.category} · {p.brand}</p>
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => item.quantity > 1 ? updateQuantity(p._id, item.quantity - 1) : removeFromCart(p._id)}
                          className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1.5 text-sm font-semibold border-x border-gray-200">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(p._id, item.quantity + 1)}
                          className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(price * item.quantity)}</span>
                        <button
                          onClick={() => removeFromCart(p._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className={subtotal >= 999 ? 'text-emerald-600 font-medium' : ''}>
                    {subtotal >= 999 ? 'FREE' : formatCurrency(99)}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal >= 999 ? subtotal : subtotal + 99)}</span>
                </div>
              </div>
              {subtotal < 999 && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2 mb-4">
                  Add {formatCurrency(999 - subtotal)} more for free delivery!
                </p>
              )}
              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full btn-lg justify-center"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
              <Link to="/products" className="btn-ghost w-full justify-center mt-2 text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
