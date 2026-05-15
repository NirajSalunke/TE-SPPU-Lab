import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, MapPin, ShoppingBag } from 'lucide-react';
import { getOrderById } from '../services/orderService';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { PageSpinner } from '../components/ui/Spinner';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getOrderById(id);
        setOrder(data.order);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <PageSpinner />;
  if (!order) return null;

  return (
    <div className="container-custom py-12 animate-fade-in">
      <div className="max-w-lg mx-auto text-center mb-10">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500">Thank you for your order. We'll get it to you soon.</p>
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 mt-3">
          <span className="text-xs text-gray-500">Order ID:</span>
          <span className="text-xs font-mono font-semibold text-gray-800">#{order._id.slice(-8).toUpperCase()}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Items */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary-600" /> Order Items ({order.items.length})
          </h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <img src={item.image || `https://picsum.photos/seed/${item.productId}/48/48`} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 line-clamp-1">{item.title}</p>
                  <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-gray-900">
            <span>Total Amount</span>
            <span className="text-primary-600">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Shipping address */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary-600" /> Shipping Address
          </h2>
          <div className="text-sm text-gray-700 space-y-0.5">
            <p className="font-semibold">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p className="text-gray-500">{order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Status */}
        <div className="card p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Order Status</span>
            <span className="badge-success font-semibold">{order.orderStatus}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-500">Order Date</span>
            <span className="text-gray-700 font-medium">{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-500">Payment Method</span>
            <span className="text-gray-700 font-medium">{order.paymentMethod}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link to="/profile" className="btn-primary flex-1 justify-center btn-lg">
            <Package className="w-4 h-4" /> View All Orders
          </Link>
          <Link to="/products" className="btn-secondary flex-1 justify-center btn-lg">
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
