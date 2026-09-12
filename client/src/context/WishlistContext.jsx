import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { token } = useAuth();
  const { addToast } = useToast();

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('dt_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (token) {
      api.get('/wishlist')
        .then(({ data }) => {
          if (data.products) {
            setWishlist(data.products);
          }
        })
        .catch(() => {});
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('dt_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  const toggleWishlist = async (product) => {
    const isPresent = isInWishlist(product._id);

    if (token) {
      try {
        if (isPresent) {
          const { data } = await api.delete(`/wishlist/${product._id}`);
          setWishlist(data.products);
          addToast(`Removed from your wishlist`, 'info');
        } else {
          const { data } = await api.post('/wishlist', { productId: product._id });
          setWishlist(data.products);
          addToast(`Added to your wishlist`, 'success');
        }
        return;
      } catch (err) {}
    }

    // Local wishlist
    if (isPresent) {
      setWishlist((prev) => prev.filter((it) => (it._id || it) !== product._id));
      addToast(`Removed from your wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast(`Added to your wishlist`, 'success');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        count: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
