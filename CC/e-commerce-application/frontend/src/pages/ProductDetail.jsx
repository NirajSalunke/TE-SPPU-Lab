import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = null;
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProductData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = existingCart.findIndex(item => item._id === productData._id);
    
    if (itemIndex > -1) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push({ ...productData, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    navigate('/cart');
  };

  if (loading) return <div className="text-center py-20 text-xl text-gray-500">Loading product details...</div>;
  if (!productData) return <div className="text-center py-20 text-xl text-red-500">Product not found.</div>;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-indigo-600 mb-8 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </button>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center">
          <img
            src={productData.imageUrl}
            alt={productData.name}
            className="max-w-full h-auto rounded-xl object-cover shadow-sm mix-blend-multiply"
          />
        </div>
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold mb-2">Tech Gear</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{productData.name}</h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {productData.description}
          </p>
          <div className="mt-auto">
            <div className="text-4xl font-black text-gray-900 mb-6">
              ${productData.price.toFixed(2)}
            </div>
            <button
              onClick={addToCart}
              className="w-full flex items-center justify-center py-4 px-8 border border-transparent rounded-xl shadow-md text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingCart className="w-6 h-6 mr-3" />
              Add to Cart
            </button>
            {productData.stock < 20 && (
              <p className="text-sm text-orange-500 mt-4 text-center font-medium">
                Only {productData.stock} left in stock - order soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
