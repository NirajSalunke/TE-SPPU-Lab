import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { getProducts } from '../../services/productService';
import { getAllOrders } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatCurrency';
import { PageSpinner } from '../../components/ui/Spinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [pRes, oRes] = await Promise.all([
          getProducts({ limit: 1 }),
          getAllOrders({ limit: 5 }),
        ]);
        const revenue = oRes.data.orders.reduce((sum, o) => sum + o.totalAmount, 0);
        setStats({ products: pRes.data.total, orders: oRes.data.total, revenue });
        setRecentOrders(oRes.data.orders);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  const STAT_CARDS = [
    { label: 'Total Products', value: stats.products, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', link: '/admin/products' },
    { label: 'Total Orders', value: stats.orders, icon: Package, color: 'bg-emerald-50 text-emerald-600', link: '/admin/orders' },
    { label: 'Revenue (Recent)', value: formatCurrency(stats.revenue), icon: TrendingUp, color: 'bg-purple-50 text-purple-600', link: '/admin/orders' },
  ];

  if (loading) return <PageSpinner />;

  return (
    <div className="container-custom py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your store</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {STAT_CARDS.map((s) => (
          <Link key={s.label} to={s.link} className="card p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link to="/admin/products" className="card p-5 flex items-center justify-between hover:shadow-md transition-all hover:border-primary-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Manage Products</p>
              <p className="text-xs text-gray-500">Add, edit, delete products</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </Link>
        <Link to="/admin/orders" className="card p-5 flex items-center justify-between hover:shadow-md transition-all hover:border-primary-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Manage Orders</p>
              <p className="text-xs text-gray-500">View and update order status</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </Link>
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order._id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{order.userId?.name} · {order.items?.length} item(s)</p>
                </div>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                <span className={`badge text-xs ${order.orderStatus === 'Delivered' ? 'badge-success' : order.orderStatus === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                  {order.orderStatus}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
