import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const { addToast } = useToast();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('dt_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);

  // Sync to database if user is logged in
  useEffect(() => {
    if (token) {
      api.get('/cart')
        .then(({ data }) => {
          if (data.cart && data.cart.items) {
            setCartItems(data.cart.items);
          }
        })
        .catch(() => {});
    }
  }, [token]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('dt_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product, quantity = 1, size = 'M', color = '') => {
    if (token) {
      try {
        const { data } = await api.post('/cart', {
          productId: product._id,
          quantity,
          size,
          color,
        });
        setCartItems(data.cart.items);
        addToast(`Added "${product.name}" (${size}) to your bag`, 'success');
        setIsCartOpen(true);
        return;
      } catch (err) {
        // Fallback to local
      }
    }

    // Guest local cart
    setCartItems((prev) => {
      const idx = prev.findIndex(
        (item) => (item.product._id || item.product) === product._id && item.size === size
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          _id: 'local_' + Date.now() + Math.random().toString(36).substr(2, 4),
          product,
          quantity,
          size,
          color: color || (product.colors?.[0]?.name || ''),
        },
      ];
    });

    addToast(`Added "${product.name}" (${size}) to your bag`, 'success');
    setIsCartOpen(true);
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return removeItem(itemId);

    if (token) {
      try {
        const { data } = await api.put(`/cart/${itemId}`, { quantity });
        setCartItems(data.cart.items);
        return;
      } catch {}
    }

    setCartItems((prev) =>
      prev.map((it) => (it._id === itemId ? { ...it, quantity } : it))
    );
  };

  const removeItem = async (itemId) => {
    if (token) {
      try {
        const { data } = await api.delete(`/cart/${itemId}`);
        setCartItems(data.cart.items);
        addToast('Item removed from your bag', 'info');
        return;
      } catch {}
    }

    setCartItems((prev) => prev.filter((it) => it._id !== itemId));
    addToast('Item removed from your bag', 'info');
  };

  const clearCart = async () => {
    if (token) {
      try {
        await api.delete('/cart');
      } catch {}
    }
    setCartItems([]);
    setCoupon(null);
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, it) => {
    const itemPrice = it.product?.salePrice || it.product?.price || 0;
    return sum + itemPrice * (it.quantity || 1);
  }, 0);

  const discount = coupon ? coupon.discountAmount : 0;
  const shippingCost = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const tax = Math.round((subtotal - discount) * 0.12);
  const total = Math.max(0, subtotal - discount + shippingCost + tax);
  const itemCount = cartItems.reduce((count, it) => count + (it.quantity || 1), 0);

  const applyCoupon = async (code) => {
    try {
      const { data } = await api.post('/coupons/validate', {
        code,
        cartTotal: subtotal,
      });
      setCoupon(data.coupon);
      addToast(`Promo code ${data.coupon.code} applied: ₹${data.coupon.discountAmount.toLocaleString('en-IN')} saved!`, 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid or expired promo code';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    addToast('Promo code removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        discount,
        coupon,
        applyCoupon,
        removeCoupon,
        shippingCost,
        tax,
        total,
        itemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
