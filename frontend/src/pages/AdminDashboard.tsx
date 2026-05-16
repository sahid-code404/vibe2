import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Utensils, Star, FileText, AlertTriangle, Shield, BarChart3, CheckCircle, UserX, ArrowLeft } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [tab, setTab] = useState<'overview' | 'users' | 'reviews' | 'reports'>('overview');

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/'); return; }
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/admin/users?limit=50').then(r => setUsers(r.data.items || [])).catch(() => {});
    api.get('/admin/reports').then(r => setReports(r.data || [])).catch(() => {});
    api.get('/admin/reviews/pending').then(r => setPendingReviews(r.data || [])).catch(() => {});
  }, [user]);

  const toggleUser = async (id: number) => {
    await api.put(`/admin/users/${id}/toggle-active`);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u));
  };

  const approveReview = async (id: number) => {
    await api.put(`/admin/reviews/${id}/approve`);
    setPendingReviews(prev => prev.filter(r => r.id !== id));
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'reviews', label: 'Reviews', icon: Star },
    { key: 'reports', label: 'Reports', icon: AlertTriangle },
  ] as const;

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/5"><ArrowLeft size={18} className="text-white/50" /></button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Shield size={24} className="text-purple-400" /> Admin</h1>
          <p className="text-white/30 text-sm">Manage your platform</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium shrink-0 transition-colors ${tab === t.key ? 'bg-purple-500/20 text-purple-400' : 'glass text-white/40'}`}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Users', value: stats.total_users || 0, icon: Users, color: 'blue' },
            { label: 'Foods', value: stats.total_foods || 0, icon: Utensils, color: 'orange' },
            { label: 'Reviews', value: stats.total_reviews || 0, icon: Star, color: 'amber' },
            { label: 'Itineraries', value: stats.total_itineraries || 0, icon: FileText, color: 'green' },
            { label: 'Pending Reports', value: stats.pending_reports || 0, icon: AlertTriangle, color: 'red' },
            { label: 'Pending Reviews', value: stats.pending_reviews || 0, icon: CheckCircle, color: 'purple' },
          ].map(s => (
            <motion.div key={s.label} variants={staggerItem} className="glass rounded-2xl p-4 text-center">
              <s.icon size={20} className={`mx-auto mb-2 text-${s.color}-400`} />
              <p className="text-white font-bold text-2xl font-display">{s.value}</p>
              <p className="text-white/30 text-xs">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="glass rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">{u.display_name || u.email}</p>
                <p className="text-white/30 text-xs">{u.email} • {u.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${u.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{u.is_active ? 'Active' : 'Banned'}</span>
                <button onClick={() => toggleUser(u.id)} className="p-1.5 rounded-lg hover:bg-white/5"><UserX size={14} className="text-white/30" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Reviews */}
      {tab === 'reviews' && (
        <div className="space-y-2">
          {pendingReviews.length > 0 ? pendingReviews.map(r => (
            <div key={r.id} className="glass rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm">{r.content?.slice(0, 60) || 'No content'}</p>
                <p className="text-white/30 text-xs">Rating: {r.rating} • {r.entity_type}</p>
              </div>
              <button onClick={() => approveReview(r.id)} className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs">Approve</button>
            </div>
          )) : <p className="text-white/30 text-center py-8 text-sm">No pending reviews</p>}
        </div>
      )}

      {/* Reports */}
      {tab === 'reports' && (
        <div className="space-y-2">
          {reports.length > 0 ? reports.map(r => (
            <div key={r.id} className="glass rounded-2xl p-4">
              <p className="text-white text-sm">{r.reason}</p>
              <p className="text-white/30 text-xs mt-1">{r.entity_type} #{r.entity_id} • Status: {r.status}</p>
            </div>
          )) : <p className="text-white/30 text-center py-8 text-sm">No reports</p>}
        </div>
      )}
    </div>
  );
}
