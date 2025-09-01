import { create } from "zustand";
import { api } from "../lib/api";

export const useCart = create((set, get) => ({
  items: [],
  error: null,
  isLoading: false,

  total: () => {
    return get().items.reduce((sum, { product, qty }) => {
      if (!product) return sum;
      const discountedPrice = (product.price || 0) * (1 - (product.discount || 0) / 100);
      return sum + (discountedPrice * qty);
    }, 0);
  },

  // Helper function to sync cart with localStorage
  syncToLocal: (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
  },

  load: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Try to get cart from localStorage first
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        set({ items: parsedCart });
      }

      // Then try to fetch from server if we have a token
      const token = localStorage.getItem("authToken");
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await api.get('/api/cart');
        if (data && data.products) {
          const cartItems = data.products.map(item => ({
            product: item.productId,
            qty: item.quantity
          }));
          set({ items: cartItems });
          get().syncToLocal(cartItems);
        }
      }
    } catch (err) {
      console.error("Cart load failed:", err);
      set({ error: 'Failed to load cart' });
    } finally {
      set({ isLoading: false });
    }
  },


  add: async (product, qty = 1) => {
    if (!product?._id) return;
    
    set({ isLoading: true, error: null });
    
    try {
      // Check if product already exists in cart
      const existingItem = get().items.find(item => item.product?._id === product._id);
      
      let newItems;
      if (existingItem) {
        // Update quantity if product exists
        newItems = get().items.map(item => 
          item.product._id === product._id 
            ? { ...item, qty: item.qty + qty }
            : item
        );
      } else {
        // Add new item if product doesn't exist
        newItems = [...get().items, { product, qty }];
      }
      
      set({ items: newItems });
      get().syncToLocal(newItems);

      // Sync with server if authenticated
      const token = localStorage.getItem("authToken");
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await api.post('/api/cart/add', {
          productId: product._id,
          quantity: qty
        });
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
      set({ error: 'Failed to add item to cart' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (productId, qty) => {
    if (!productId || qty < 1) return;
    
    set({ isLoading: true, error: null });
    
    try {
      // Update local state
      const newItems = get().items.map(item => 
        item.product?._id === productId 
          ? { ...item, qty } 
          : item
      );
      
      set({ items: newItems });
      get().syncToLocal(newItems);

      // Sync with server if authenticated
      const token = localStorage.getItem("authToken");
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await api.put('/api/cart/update', {
          productId,
          quantity: qty
        });
      }
    } catch (err) {
      console.error("Update cart failed:", err);
      set({ error: 'Failed to update quantity' });
    } finally {
      set({ isLoading: false });
    }
  },

  remove: async (productId) => {
    if (!productId) return;
    
    set({ isLoading: true, error: null });
    
    try {
      // Update local state
      const newItems = get().items.filter(item => item.product?._id !== productId);
      set({ items: newItems });
      get().syncToLocal(newItems);

      // Sync with server if authenticated
      const token = localStorage.getItem("authToken");
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await api.delete('/api/cart/remove', {
          data: { productId }
        });
      }
    } catch (err) {
      console.error("Remove from cart failed:", err);
      set({ error: 'Failed to remove item' });
    } finally {
      set({ isLoading: false });
    }
  },

  clear: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Clear local state
      set({ items: [] });
      localStorage.removeItem('cart');

      // Sync with server if authenticated
      const token = localStorage.getItem("authToken");
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await api.delete('/api/cart/clear');
      }
    } catch (err) {
      console.error("Clear cart failed:", err);
      set({ error: 'Failed to clear cart' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
