import { Link } from 'react-router-dom';
import { Store, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <Store className="w-5 h-5 text-primary-400" />
              ShopHub
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Your one-stop destination for premium products. Shop with confidence and get the best deals every day.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Shop</h4>
            <ul className="space-y-2 text-sm">
              {['Electronics', 'Clothing', 'Books', 'Sports', 'Beauty'].map((cat) => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`} className="hover:text-white transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© {new Date().getFullYear()} ShopHub. All rights reserved.</p>
          <p className="text-xs">Built with ❤️ using MERN Stack</p>
        </div>
      </div>
    </footer>
  );
}
