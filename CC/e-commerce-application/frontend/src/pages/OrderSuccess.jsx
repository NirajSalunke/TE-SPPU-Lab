import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  if (!orderId) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="mb-8">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Thank You For Your Order!</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Your order has been successfully placed. We're getting it ready and will ship it out as soon as possible.
      </p>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10 w-full max-w-md">
        <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Order Reference Number</p>
        <p className="text-2xl font-mono font-bold text-indigo-600">{orderId}</p>
      </div>

      <Link
        to="/"
        className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition transform hover:-translate-y-1 shadow-lg"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;
