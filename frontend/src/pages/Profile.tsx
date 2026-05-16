import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Phone, LogOut, Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ display_name: '', bio: '', location: '', phone: '' });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    api.get('/users/profile').then(r => { setProfile(r.data); setForm({ display_name: r.data.display_name || '', bio: r.data.bio || '', location: r.data.location || '', phone: r.data.phone || '' }); }).catch(() => {});
  }, [isAuthenticated]);

  const save = async () => {
    try {
      const { data } = await api.put('/users/profile', form);
      setProfile(data);
      setEditing(false);
    } catch {}
  };

  const handleLogout = () => { logout(); navigate('/'); };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        {/* Avatar & Name */}
        <motion.div variants={staggerItem} className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
            {(profile?.display_name || user?.email || 'U')[0].toUpperCase()}
          </div>
          <h1 className="text-xl font-bold text-white">{profile?.display_name || user?.display_name || 'User'}</h1>
          <p className="text-white/30 text-sm">{user?.email}</p>
          {user?.role === 'admin' && (
            <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs">
              <Shield size={12} /> Admin
            </span>
          )}
        </motion.div>

        {/* Profile details */}
        <motion.div variants={staggerItem} className="glass rounded-2xl p-5 space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-sm">Profile Details</h2>
            <button onClick={() => editing ? save() : setEditing(true)} className="text-orange-400 text-xs font-medium">
              {editing ? 'Save' : 'Edit'}
            </button>
          </div>

          {[
            { icon: User, label: 'Name', key: 'display_name' },
            { icon: MapPin, label: 'Location', key: 'location' },
            { icon: Phone, label: 'Phone', key: 'phone' },
          ].map(field => (
            <div key={field.key} className="flex items-center gap-3">
              <field.icon size={16} className="text-white/20 shrink-0" />
              {editing ? (
                <input value={(form as any)[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.label} className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-white outline-none" />
              ) : (
                <div>
                  <p className="text-white/20 text-[10px]">{field.label}</p>
                  <p className="text-white text-sm">{(profile as any)?.[field.key] || '—'}</p>
                </div>
              )}
            </div>
          ))}

          {editing && (
            <div>
              <p className="text-white/20 text-[10px] mb-1">Bio</p>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself..." className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-white outline-none resize-none h-20" />
            </div>
          )}
        </motion.div>

        {/* Menu */}
        <motion.div variants={staggerItem} className="space-y-2">
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="w-full glass rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-white/[0.04] transition-colors">
              <Shield size={18} className="text-purple-400" />
              <span className="text-white text-sm font-medium">Admin Dashboard</span>
            </button>
          )}
          <button onClick={() => navigate('/saved-itineraries')} className="w-full glass rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-white/[0.04] transition-colors">
            <Settings size={18} className="text-white/30" />
            <span className="text-white text-sm">Saved Itineraries</span>
          </button>
          <button onClick={handleLogout} className="w-full glass rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-red-500/5 transition-colors">
            <LogOut size={18} className="text-red-400" />
            <span className="text-red-400 text-sm font-medium">Logout</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
