import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FolderTree, X } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('men');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    api.get('/categories')
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/categories', { name, gender, description, image });
      setCategories([...categories, data.category]);
      addToast('Category created successfully', 'success');
      setIsModalOpen(false);
      setName('');
      setDescription('');
      setImage('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create category', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
      addToast('Category removed', 'info');
    } catch (err) {
      addToast('Failed to delete category', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">Taxonomy</span>
          <h1 className="font-display text-2xl sm:text-3xl tracking-widest uppercase mt-1">Garment Categories</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-luxury-gold text-black font-display text-xs uppercase tracking-wider font-semibold hover:bg-luxury-gold-light transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-[#111111] border border-white/10 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-luxury-gold">
                  {cat.gender}
                </span>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-white/40 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <h3 className="font-display text-lg uppercase tracking-wider text-white mb-2">{cat.name}</h3>
              <p className="text-xs text-white/60 line-clamp-2">{cat.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-white/40 font-mono">
              Slug: /{cat.gender}/{cat.slug}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#111111] border border-luxury-gold/50 p-6 sm:p-8 z-10 text-white">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
              <h3 className="font-display text-base uppercase tracking-widest text-luxury-gold font-semibold">
                Create Category
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/70 uppercase mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Imperial Tuxedos"
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-white/70 uppercase mb-1">Gender Division</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-white/20 text-white uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-luxury-gold text-black uppercase font-semibold hover:bg-luxury-gold-light"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
