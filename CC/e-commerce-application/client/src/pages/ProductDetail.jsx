import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Minus, Plus, Package } from 'lucide-react';
import { getProductById } from '../services/productService';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { formatCurrency, getDiscountPercent } from '../utils/formatCurrency';
import StarRating from '../components/shared/StarRating';
import { PageSpinner } from '../components/ui/Spinner';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data.product);
      } catch { navigate('/products'); }
      setLoading(false);
    };
    fetch();
  }, [id, navigate]);

  if (loading) return <PageSpinner />;
  if (!product) return null;

  const discount = getDiscountPercent(product.price, product.discountedPrice);
  const displayPrice = product.discountedPrice || product.price;
  const currentImage = imgError
    ? `https://picsum.photos/seed/${product._id}/600/600`
    : product.images?.[imgIdx] || `https://picsum.photos/seed/${product._id}/600/600`;

  const handleAddToCart = async () => {
    if (!isAuthenticated) return navigate('/login');
    setAdded(true);
    await addToCart(product._id, qty);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container-custom py-8 animate-fade-in">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={currentImage}
              alt={product.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setImgIdx(i); setImgError(false); }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${imgIdx === i ? 'border-primary-500' : 'border-gray-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-gray">{product.category}</span>
            {product.featured && <span className="badge-primary">Featured</span>}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">{product.title}</h1>

          <div className="mb-4">
            <StarRating rating={product.rating} numReviews={product.numReviews} size="md" />
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-extrabold text-gray-900">{formatCurrency(displayPrice)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatCurrency(product.price)}</span>
                <span className="badge bg-red-100 text-red-700 font-semibold">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          <div className="space-y-4 mb-6">
            {product.brand && (
              <div className="flex gap-2 text-sm">
                <span className="text-gray-500 font-medium w-20">Brand</span>
                <span className="text-gray-900 font-semibold">{product.brand}</span>
              </div>
            )}
            <div className="flex gap-2 text-sm">
              <span className="text-gray-500 font-medium w-20">Stock</span>
              <span className={product.stock > 0 ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
              </span>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-gray-600 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-semibold border-x border-gray-300">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 btn py-3 text-sm font-semibold ${
                product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : added ? 'bg-emerald-600 text-white' : 'btn-primary'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {product.stock === 0 ? 'Out of Stock' : added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <Link to="/cart" className="flex-1 btn-secondary py-3 text-sm font-semibold justify-center">
              <Package className="w-4 h-4" /> Go to Cart
            </Link>
          </div>

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {product.tags.map((tag) => (
                <span key={tag} className="badge-gray text-xs">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
