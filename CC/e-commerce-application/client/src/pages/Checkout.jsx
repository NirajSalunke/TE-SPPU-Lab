import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { placeOrder } from '../services/orderService';
import { formatCurrency } from '../utils/formatCurrency';
import { PageSpinner } from '../components/ui/Spinner';
import { MapPin, User, Phone, Mail, Package } from 'lucide-react';

const Field = ({ label, icon: Icon, error, ...props }) => (
  <div>
    <label className="label">{label}</label>
    <div className="relative">
      {Icon && <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
      <input className={`input ${Icon ? 'pl-9' : ''} ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`} {...props} />
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, fetchCart, resetCart } = useCartStore();
  const { user } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.productId?.discountedPrice || item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const delivery = subtotal >= 999 ? 0 : 99;
  const total = subtotal + delivery;

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.addressLine1.trim()) e.addressLine1 = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State is required';
    if (!form.postalCode.trim()) e.postalCode = 'PIN code is required';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await placeOrder({ shippingAddress: form });
      resetCart();
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order. Please try again.');
    }
    setSubmitting(false);
  };

  if (!cart) return <PageSpinner />;

  return (
    <div className="container-custom py-8 animate-fade-in">
      <h1 className="page-title mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipping Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-600" /> Shipping Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Full Name *" icon={User} placeholder="John Doe" value={form.fullName} onChange={handleChange('fullName')} error={errors.fullName} />
              </div>
              <Field label="Email *" icon={Mail} type="email" placeholder="john@email.com" value={form.email} onChange={handleChange('email')} error={errors.email} />
              <Field label="Phone *" icon={Phone} type="tel" placeholder="9876543210" value={form.phone} onChange={handleChange('phone')} error={errors.phone} />
              <div className="sm:col-span-2">
                <Field label="Address Line 1 *" placeholder="Street, House No." value={form.addressLine1} onChange={handleChange('addressLine1')} error={errors.addressLine1} />
              </div>
              <div className="sm:col-span-2">
                <Field label="Address Line 2" placeholder="Landmark, Area (optional)" value={form.addressLine2} onChange={handleChange('addressLine2')} />
              </div>
              <Field label="City *" placeholder="Mumbai" value={form.city} onChange={handleChange('city')} error={errors.city} />
              <Field label="State *" placeholder="Maharashtra" value={form.state} onChange={handleChange('state')} error={errors.state} />
              <Field label="PIN Code *" placeholder="400001" value={form.postalCode} onChange={handleChange('postalCode')} error={errors.postalCode} />
              <div>
                <label className="label">Country</label>
                <input className="input" value={form.country} readOnly />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary-600" /> Payment Method
            </h2>
            <div className="flex items-center gap-3 p-4 border-2 border-primary-500 bg-primary-50 rounded-xl">
              <div className="w-5 h-5 rounded-full border-2 border-primary-500 bg-primary-500 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Cash on Delivery</p>
                <p className="text-xs text-gray-500">Pay when your order arrives</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="card p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4">Order Review</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => {
                const p = item.productId;
                if (!p) return null;
                const price = p.discountedPrice || p.price;
                return (
                  <div key={p._id} className="flex gap-2 text-sm">
                    <img src={p.images?.[0] || `https://picsum.photos/seed/${p._id}/48/48`} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-2 text-xs text-gray-700 leading-snug font-medium">{p.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × {formatCurrency(price)}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{delivery === 0 ? <span className="text-emerald-600">FREE</span> : formatCurrency(delivery)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="btn-primary w-full btn-lg justify-center disabled:opacity-60"
            >
              {submitting ? 'Placing Order...' : `Place Order · ${formatCurrency(total)}`}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">🔒 Secure checkout. No payment required.</p>
          </div>
        </div>
      </form>
    </div>
  );
}
