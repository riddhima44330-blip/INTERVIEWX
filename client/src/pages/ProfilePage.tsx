import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Edit2, Save, User as UserIcon, Calendar, Target, Award, Zap } from 'lucide-react';
import Badge from '../components/Badge';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  xp: number;
  streak: number;
  badges: string[];
  level: number;
  skillLevel: string;
  createdAt: string;
}

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/user/profile');
      setProfile(res.data);
      setFormData({ name: res.data.name, email: res.data.email });
    } catch (err) {
      console.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await api.put('/user/profile', formData);
      setProfile(res.data);
      setEditing(false);
      // Update local storage name if changed
      if (user) {
        login({ ...user, name: res.data.name, email: res.data.email });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-brand-primary)]"></div>
        </div>
      </Layout>
    );
  }

  if (!profile) return (
    <Layout>
      <div className="text-center py-20 text-red-500">Failed to load profile.</div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 xl:px-0">
        <h1 className="text-3xl font-black mb-8 border-b border-[#2A2A35] pb-4">User Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#2A2A35] to-[var(--color-brand-panel)] border-b border-[#2A2A35]"></div>
              
              <div className="flex flex-col items-center relative z-10 pt-8">
                <div className="relative w-32 h-32 mb-4">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-[#2A2A35] shadow-lg bg-[#1A1A22]" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#1A1A22] flex items-center justify-center border-4 border-[#2A2A35] shadow-lg">
                       <UserIcon size={48} className="text-[var(--color-brand-text-secondary)]" />
                    </div>
                  )}
                </div>

                {editing ? (
                  <div className="w-full space-y-4 bg-[#1A1A22] p-4 rounded-2xl border border-[#2A2A35]">
                    <div>
                      <label className="text-xs font-bold text-[var(--color-brand-text-secondary)] mb-1 block uppercase tracking-wider">Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#0F0F14] border border-[#2A2A35] rounded-lg px-3 py-2 text-white outline-none focus:border-[var(--color-brand-primary)] transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--color-brand-text-secondary)] mb-1 block uppercase tracking-wider">Email</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#0F0F14] border border-[#2A2A35] rounded-lg px-3 py-2 text-white outline-none focus:border-[var(--color-brand-primary)] transition-all font-medium"
                      />
                    </div>
                    {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => setEditing(false)}
                        className="flex-1 py-2 rounded-lg border border-[#2A2A35] hover:bg-[#2A2A35] text-white font-bold transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-2 rounded-lg bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white font-bold transition-all flex items-center justify-center gap-2"
                      >
                        {saving ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span> : <><Save size={16} /> Save</>}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full text-center">
                    <h2 className="text-2xl font-black text-white mb-1 group-hover:text-[var(--color-brand-primary)] transition-colors">{profile.name}</h2>
                    <p className="text-[var(--color-brand-text-secondary)] mb-4">{profile.email}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--color-brand-panel)] border border-[var(--color-brand-primary)] rounded-full text-sm mb-6 font-bold text-[var(--color-brand-primary)]">
                      <Target size={14} />
                      <span>{profile.skillLevel || 'Level Not Set'}</span>
                    </div>
                    <button 
                      onClick={() => setEditing(true)}
                      className="w-full py-2.5 rounded-xl border border-[#2A2A35] hover:border-[var(--color-brand-primary)] hover:bg-[#1A1A22] hover:text-[var(--color-brand-primary)] text-white font-bold transition-all flex items-center justify-center gap-2 group"
                    >
                      <Edit2 size={16} className="group-hover:rotate-12 transition-transform" /> Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] rounded-3xl p-6 mt-6 shadow-xl flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-[#1A1A22] rounded-full flex items-center justify-center border border-[#2A2A35]">
                   <Calendar size={18} className="text-[var(--color-brand-text-secondary)]" />
                 </div>
                 <div>
                   <h3 className="text-xs font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider">Member Since</h3>
                   <p className="font-bold text-white">{new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column: Stats & Badges */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[var(--color-brand-primary)] transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Award size={64} />
                </div>
                <div className="w-14 h-14 bg-[#1A1A22] border border-[#2A2A35] rounded-2xl flex items-center justify-center mb-4 relative z-10 shadow-lg group-hover:scale-110 transition-transform">
                  <Award className="text-[var(--color-brand-primary)]" size={28} />
                </div>
                <h3 className="text-[var(--color-brand-text-secondary)] text-sm font-bold uppercase tracking-wider mb-1 relative z-10">Level</h3>
                <p className="text-4xl font-black relative z-10">{profile.level}</p>
              </div>
              
              <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-yellow-500 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Zap size={64} />
                </div>
                <div className="w-14 h-14 bg-[#1A1A22] border border-[#2A2A35] rounded-2xl flex items-center justify-center mb-4 relative z-10 shadow-lg group-hover:scale-110 transition-transform">
                  <Zap className="text-yellow-400" size={28} />
                </div>
                <h3 className="text-[var(--color-brand-text-secondary)] text-sm font-bold uppercase tracking-wider mb-1 relative z-10">XP Points</h3>
                <p className="text-4xl font-black relative z-10">{profile.xp}</p>
              </div>
              
              <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[var(--color-brand-secondary)] transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Target size={64} />
                </div>
                <div className="w-14 h-14 bg-[#1A1A22] border border-[#2A2A35] rounded-2xl flex items-center justify-center mb-4 relative z-10 shadow-lg group-hover:scale-110 transition-transform">
                  <Target className="text-[var(--color-brand-secondary)]" size={28} />
                </div>
                <h3 className="text-[var(--color-brand-text-secondary)] text-sm font-bold uppercase tracking-wider mb-1 relative z-10">Day Streak</h3>
                <p className="text-4xl font-black relative z-10">{profile.streak}</p>
              </div>
            </div>

            <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] rounded-3xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-8 border-b border-[#2A2A35] pb-4">
                <h3 className="text-xl font-black flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1A1A22] rounded-xl flex items-center justify-center border border-[#2A2A35]">
                    <Award size={20} className="text-[var(--color-brand-primary)]" />
                  </div>
                  Badges & Achievements
                </h3>
                <span className="text-sm font-bold bg-[#1A1A22] px-3 py-1 rounded-full text-[var(--color-brand-text-secondary)] border border-[#2A2A35]">
                  {profile.badges ? profile.badges.length : 0} Earned
                </span>
              </div>
              
              {profile.badges && profile.badges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                  {profile.badges.map((badge, idx) => (
                    <Badge key={idx} name={badge} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-[#2A2A35] rounded-2xl p-6 bg-[#0F0F14]">
                  <div className="w-20 h-20 bg-[#1A1A22] rounded-full flex items-center justify-center mx-auto mb-5 border border-[#2A2A35]">
                    <Award size={36} className="text-gray-600" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">No Badges Yet</h4>
                  <p className="text-[var(--color-brand-text-secondary)] max-w-sm mx-auto">Complete your first mock interview or maintain a streak to start earning badges!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
