import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getMyOrders } from '../services/orderService';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { PageSpinner } from '../components/ui/Spinner';
import EmptyState from '../components/shared/EmptyState';

const STATUS_COLORS = {
  Placed: 'badge-primary',
  Processing: 'badge-warning',
  Shipped: 'badge bg-blue-100 text-blue-700',
  Delivered: 'badge-success',
  Cancelled: 'badge-danger',
};

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data.orders);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="container-custom py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                {user?.role === 'admin' && <span className="badge-primary text-xs mt-0.5">Admin</span>}
              </div>
            </div>
            <nav className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                <Package className="w-4 h-4" /> My Orders
              </div>
              {user?.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                  <User className="w-4 h-4" /> Admin Panel
                </Link>
              )}
              <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-3">
          <h1 className="page-title mb-4">My Orders</h1>
          {loading ? (
            <PageSpinner />
          ) : orders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No orders yet"
              description="Looks like you haven't placed any orders. Start shopping!"
              action={<Link to="/products" className="btn-primary">Browse Products</Link>}
            />
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link key={order._id} to={`/order-success/${order._id}`} className="card p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200 hover:border-primary-200">
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                      <span className={STATUS_COLORS[order.orderStatus] || 'badge-gray'}>{order.orderStatus}</span>
                    </div>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)} · {order.items.length} item(s)</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
