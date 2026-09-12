import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const { addToast } = useToast();

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gender: 'men',
    category: 'Sherwanis',
    subcategory: '',
    price: '',
    salePrice: '',
    sku: '',
    images: '',
    sizes: ['S', 'M', 'L', 'XL', 'Custom'],
    fabric: 'Pure Silk & Handloom Zari',
    stock: 10,
    featured: false,
    trending: false,
    newArrival: true,
  });

  useEffect(() => {
    fetchProducts();
    api.get('/categories').then(({ data }) => setCategories(data.categories || []));
  }, [genderFilter]);

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (genderFilter) params.set('gender', genderFilter);
    if (search) params.set('search', search);

    api.get(`/products?limit=100&${params.toString()}`)
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      gender: 'men',
      category: categories[0]?.name || 'Sherwanis',
      subcategory: '',
      price: '',
      salePrice: '',
      sku: `DT-${Date.now().toString().slice(-4)}`,
      images: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
      sizes: ['S', 'M', 'L', 'XL', 'Custom'],
      fabric: 'Pure Silk & Handloom Zari',
      stock: 10,
      featured: false,
      trending: false,
      newArrival: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description,
      gender: prod.gender,
      category: prod.category,
      subcategory: prod.subcategory || '',
      price: prod.price,
      salePrice: prod.salePrice || '',
      sku: prod.sku || '',
      images: (prod.images || []).join('\n'),
      sizes: prod.sizes || ['M', 'L'],
      fabric: prod.fabric || '',
      stock: prod.stock || 0,
      featured: prod.featured || false,
      trending: prod.trending || false,
      newArrival: prod.newArrival || false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this luxury piece from catalog?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      addToast('Product successfully removed from catalog', 'info');
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : null,
        stock: Number(formData.stock),
        images: formData.images.split('\n').map((s) => s.trim()).filter(Boolean),
      };

      if (editingProduct) {
        const { data } = await api.put(`/products/${editingProduct._id}`, payload);
        setProducts(products.map((p) => (p._id === editingProduct._id ? data.product : p)));
        addToast('Product updated successfully', 'success');
      } else {
        const { data } = await api.post('/products', payload);
        setProducts([data.product, ...products]);
        addToast('New product created successfully', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Error saving product', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">Inventory & Catalog</span>
          <h1 className="font-display text-2xl sm:text-3xl tracking-widest uppercase mt-1">Product Suite</h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-luxury-gold text-black font-display text-xs uppercase tracking-wider font-semibold hover:bg-luxury-gold-light transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Creation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[#111111] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            placeholder="Search catalog by name or SKU..."
            className="w-full bg-[#181818] border border-white/15 pl-9 pr-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-[#181818] border border-white/15 text-white px-3 py-2 text-xs focus:outline-none focus:border-luxury-gold"
          >
            <option value="">All Genders</option>
            <option value="men">Men's Wardrobe</option>
            <option value="women">Women's Couture</option>
          </select>
          <span className="text-white/40">Total: {products.length}</span>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-[#111111] border border-white/10 overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider bg-black/40">
              <th className="py-3 px-4">Garment</th>
              <th className="py-3 px-4">Gender & Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Status / Flags</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/80">
            {loading ? (
              <tr><td colSpan={6} className="py-12 text-center text-luxury-gold">Loading creations...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-white/40">No matching creations found.</td></tr>
            ) : (
              products.map((prod) => (
                <tr key={prod._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={(prod.images && prod.images[0]) || '/logo.png'}
                      alt=""
                      className="w-10 h-14 object-cover object-top border border-white/10 shrink-0"
                    />
                    <div>
                      <span className="font-display font-medium text-white block line-clamp-1">{prod.name}</span>
                      <span className="text-[10px] text-white/40 font-mono">{prod.sku || 'No SKU'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="uppercase text-[10px] tracking-wider text-luxury-gold block">{prod.gender}</span>
                    <span>{prod.category}</span>
                  </td>
                  <td className="py-3 px-4 font-serif">
                    <span className="font-semibold text-luxury-gold">₹{prod.price.toLocaleString('en-IN')}</span>
                    {prod.salePrice && (
                      <span className="text-[11px] text-white/40 line-through block">₹{prod.salePrice.toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 font-mono text-[11px] font-bold border ${prod.stock <= 3 ? 'border-red-700 bg-red-950/60 text-red-300' : 'border-white/20 text-white'}`}>
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {prod.featured && <span className="text-[9px] bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 px-1">Featured</span>}
                      {prod.trending && <span className="text-[9px] bg-purple-950/60 text-purple-300 border border-purple-700 px-1">Trending</span>}
                      {prod.newArrival && <span className="text-[9px] bg-emerald-950/60 text-emerald-300 border border-emerald-700 px-1">New</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 border border-white/20 text-white/70 hover:text-luxury-gold hover:border-luxury-gold transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="p-1.5 border border-white/20 text-white/70 hover:text-red-400 hover:border-red-400 transition-colors"
                        title="Delete Product"
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-3xl bg-[#111111] border border-luxury-gold/50 p-6 sm:p-8 z-10 text-white max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
              <h3 className="font-display text-base uppercase tracking-widest text-luxury-gold font-semibold">
                {editingProduct ? 'Edit Catalog Creation' : 'Register New Luxury Creation'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/70 uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Sovereign Ivory Wedding Sherwani"
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-white/70 uppercase mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="Sherwanis">Sherwanis</option>
                    <option value="Bridal Lehengas">Bridal Lehengas</option>
                    <option value="Tuxedos">Tuxedos</option>
                    <option value="Designer Sarees">Designer Sarees</option>
                    <option value="Gowns">Gowns</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 uppercase mb-1">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-white/70 uppercase mb-1">Standard Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-white/70 uppercase mb-1">Sale Price (Optional)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-white/70 uppercase mb-1">Inventory Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 uppercase mb-1">Fabric & Craftsmanship Details</label>
                <input
                  type="text"
                  value={formData.fabric}
                  onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                  placeholder="e.g. Pure Mulberry Silk & Certified Silver Zari"
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-white/70 uppercase mb-1">Editorial Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-white/70 uppercase mb-1">Image URLs (One per line)</label>
                <textarea
                  rows={3}
                  required
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span>Featured Collection</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.trending}
                    onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                  />
                  <span>Trending Spotlight</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-white/20 text-white uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-luxury-gold text-black uppercase tracking-wider font-semibold hover:bg-luxury-gold-light transition-colors"
                >
                  Save Creation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
