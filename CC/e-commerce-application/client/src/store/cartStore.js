import { create } from 'zustand';
import api from '../services/api';

export const useCartStore = create((set, get) => ({
  cart: null,
  isLoading: false,

  get items() {
    return get().cart?.items || [];
  },

  get itemCount() {
    return (get().cart?.items || []).reduce((sum, i) => sum + i.quantity, 0);
  },

  get totalAmount() {
    return (get().cart?.items || []).reduce((sum, i) => {
      const price = i.productId?.discountedPrice || i.productId?.price || 0;
      return sum + price * i.quantity;
    }, 0);
  },

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/cart');
      set({ cart: data.cart, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const { data } = await api.post('/cart/add', { productId, quantity });
      set({ cart: data.cart });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add to cart' };
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const { data } = await api.put('/cart/update', { productId, quantity });
      set({ cart: data.cart });
    } catch (err) {
      console.error(err);
    }
  },

  removeFromCart: async (productId) => {
    try {
      const { data } = await api.delete(`/cart/remove/${productId}`);
      set({ cart: data.cart });
    } catch (err) {
      console.error(err);
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart/clear');
      set({ cart: null });
    } catch (err) {
      console.error(err);
    }
  },

  resetCart: () => set({ cart: null }),
}));
