import React, { useState, useEffect } from 'react';
import { Star, Check, EyeOff, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    setLoading(true);
    api.get('/reviews/admin/all')
      .then(({ data }) => setReviews(data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/reviews/admin/${id}`, { status });
      setReviews(reviews.map((r) => (r._id === id ? { ...r, status } : r)));
      addToast(`Review marked as ${status}`, 'success');
    } catch {
      addToast('Error updating review status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete review permanently?')) return;
    try {
      await api.delete(`/reviews/admin/${id}`);
      setReviews(reviews.filter((r) => r._id !== id));
      addToast('Review deleted', 'info');
    } catch {
      addToast('Error deleting review', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-6 border-b border-white/10">
        <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">Patron Feedback</span>
        <h1 className="font-display text-2xl sm:text-3xl tracking-widest uppercase mt-1">Review Moderation</h1>
      </div>

      <div className="bg-[#111111] border border-white/10 overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider bg-black/40">
              <th className="py-3 px-4">Creation</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Editorial Commentary</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/80">
            {loading ? (
              <tr><td colSpan={6} className="py-12 text-center text-luxury-gold">Loading reviews...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-white/40">No customer reviews yet.</td></tr>
            ) : (
              reviews.map((r) => (
                <tr key={r._id} className="hover:bg-white/5">
                  <td className="py-3.5 px-4 font-medium text-white max-w-[180px]">
                    <span className="line-clamp-1">{r.product?.name || 'Garment'}</span>
                  </td>
                  <td className="py-3.5 px-4">{r.userName}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex gap-0.5 text-luxury-gold">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-luxury-gold" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    {r.title && <p className="font-semibold text-white mb-0.5">{r.title}</p>}
                    <p className="text-white/60 line-clamp-2">{r.comment}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 uppercase text-[10px] font-semibold border ${
                      r.status === 'approved' ? 'border-emerald-700 text-emerald-400 bg-emerald-950/60' : 'border-amber-700 text-amber-400'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {r.status !== 'approved' ? (
                        <button
                          onClick={() => handleUpdateStatus(r._id, 'approved')}
                          className="p-1.5 border border-emerald-700 text-emerald-400 hover:bg-emerald-900/40"
                          title="Approve Review"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(r._id, 'hidden')}
                          className="p-1.5 border border-white/20 text-white/60 hover:text-white"
                          title="Hide Review"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="p-1.5 border border-white/20 text-white/60 hover:text-red-400"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
