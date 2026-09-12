import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, UserX, UserCheck, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/admin/users')
      .then(({ data }) => setUsers(data.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      addToast(`User role updated to ${newRole}`, 'success');
    } catch (err) {
      addToast('Error updating role', 'error');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const nextState = !user.isActive;
      await api.put(`/admin/users/${user._id}`, { isActive: nextState });
      setUsers(users.map((u) => (u._id === user._id ? { ...u, isActive: nextState } : u)));
      addToast(`Account ${nextState ? 'activated' : 'deactivated'}`, 'info');
    } catch {
      addToast('Error modifying account status', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-6 border-b border-white/10">
        <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">Authentication Directory</span>
        <h1 className="font-display text-2xl sm:text-3xl tracking-widest uppercase mt-1">Patron & Staff Directory</h1>
      </div>

      <div className="bg-[#111111] border border-white/10 overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider bg-black/40">
              <th className="py-3 px-4">Patron Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Role Privileges</th>
              <th className="py-3 px-4">Account Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/80">
            {loading ? (
              <tr><td colSpan={6} className="py-12 text-center text-luxury-gold">Loading directory...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-white/40">No patrons registered yet.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-white/5">
                  <td className="py-3.5 px-4 font-semibold text-white">{u.name}</td>
                  <td className="py-3.5 px-4 text-white/70">{u.email}</td>
                  <td className="py-3.5 px-4 font-mono text-white/50">{u.phone || 'N/A'}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="bg-black/60 border border-white/20 text-luxury-gold uppercase text-[11px] p-1 focus:outline-none focus:border-luxury-gold cursor-pointer"
                    >
                      <option value="customer">VIP Client</option>
                      <option value="staff">Staff Concierge</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 uppercase text-[10px] font-semibold border ${
                      u.isActive ? 'border-emerald-700 text-emerald-400 bg-emerald-950/60' : 'border-red-800 text-red-300 bg-red-950/60'
                    }`}>
                      {u.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className="px-2.5 py-1 border border-white/20 text-white/70 hover:text-white hover:border-white text-[10px] uppercase tracking-wider"
                    >
                      {u.isActive ? 'Suspend' : 'Reactivate'}
                    </button>
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
