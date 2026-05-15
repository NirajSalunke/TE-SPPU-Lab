import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency, getDiscountPercent } from '../../utils/formatCurrency';
import StarRating from './StarRating';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const discount = getDiscountPercent(product.price, product.discountedPrice);
  const displayPrice = product.discountedPrice || product.price;
  const image = imgError
    ? `https://picsum.photos/seed/${product._id}/400/400`
    : product.images?.[0] || `https://picsum.photos/seed/${product._id}/400/400`;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login');
    setAdded(true);
    await addToCart(product._id, 1);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="card group overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden aspect-square bg-gray-100">
        <img
          src={image}
          alt={product.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 badge bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {product.featured && (
          <span className="absolute top-2 right-2 badge bg-primary-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            Featured
          </span>
        )}
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
          <Link
            to={`/products/${product._id}`}
            className="mx-1 bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <span className="badge-gray text-xs mb-2 inline-block">{product.category}</span>
        <Link to={`/products/${product._id}`}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 hover:text-primary-600 transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>

        <StarRating rating={product.rating} numReviews={product.numReviews} />

        <div className="flex items-center gap-2 mt-2 mb-3">
          <span className="text-base font-bold text-gray-900">{formatCurrency(displayPrice)}</span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">{formatCurrency(product.price)}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full btn text-xs py-2 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
            product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : added
              ? 'bg-emerald-600 text-white'
              : 'btn-primary'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {product.stock === 0 ? 'Out of Stock' : added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
