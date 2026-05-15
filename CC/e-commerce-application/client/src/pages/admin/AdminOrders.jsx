import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { PageSpinner } from '../../components/ui/Spinner';

const STATUSES = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Placed: 'badge-primary',
  Processing: 'badge-warning',
  Shipped: 'badge bg-blue-100 text-blue-700',
  Delivered: 'badge-success',
  Cancelled: 'badge-danger',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await getAllOrders({ page, limit: 20 });
      setOrders(data.orders);
      setTotal(data.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [page]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    } catch {}
    setUpdatingId(null);
  };

  return (
    <div className="container-custom py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin" className="btn-ghost p-2"><ArrowLeft className="w-4 h-4" /></Link>
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="text-gray-500 text-sm">{total} orders total</p>
        </div>
      </div>

      {loading ? <PageSpinner /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-gray-700">#{order._id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{order.userId?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{order.userId?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{order.items?.length} item(s)</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-500 text-xs">{formatDate(order.createdAt)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative inline-block">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                          className={`appearance-none pr-7 pl-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer border-0 focus:ring-2 focus:ring-primary-500/30 focus:outline-none transition-opacity ${
                            updatingId === order._id ? 'opacity-50' : ''
                          } ${
                            order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                            order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                            order.orderStatus === 'Processing' ? 'bg-amber-100 text-amber-700' :
                            'bg-primary-100 text-primary-700'
                          }`}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-70" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-12">No orders found</p>
          )}
        </div>
      )}
    </div>
  );
}
