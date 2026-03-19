import React, { useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { Save, Lock, Bell, Moon, Sun, AlertTriangle } from 'lucide-react';

const SettingsPage = () => {
  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Preferences State
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    emailNotifications: true,
    interviewReminders: true
  });
  const [prefsLoading, setPrefsLoading] = useState(false);
  const [prefsMessage, setPrefsMessage] = useState({ type: '', text: '' });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });
    
    try {
      await api.put('/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMessage({ type: 'success', text: 'Password successfully updated' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPasswordMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to change password' 
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePreferencesSave = async () => {
    setPrefsLoading(true);
    // Mock save preferences (could add to /api/user/profile if schema supported it)
    setTimeout(() => {
      setPrefsLoading(false);
      setPrefsMessage({ type: 'success', text: 'Preferences updated successfully' });
      setTimeout(() => setPrefsMessage({ type: '', text: '' }), 3000);
    }, 1000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 xl:px-0">
        <h1 className="text-3xl font-black mb-8 border-b border-[#2A2A35] pb-4">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1 space-y-2">
            <button className="w-full text-left px-4 py-3 bg-[var(--color-brand-panel)] border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] font-bold rounded-xl transition-all">
              Account Security
            </button>
            <button className="w-full text-left px-4 py-3 bg-transparent hover:bg-[#1A1A22] text-[var(--color-brand-text-secondary)] font-medium rounded-xl transition-all">
              Preferences
            </button>
            <button className="w-full text-left px-4 py-3 bg-transparent hover:bg-[#1A1A22] text-[var(--color-brand-text-secondary)] font-medium rounded-xl transition-all">
              Subscription
            </button>
          </div>

          <div className="md:col-span-2 space-y-8">
            {/* Change Password Section */}
            <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#1A1A22] rounded-xl flex items-center justify-center border border-[#2A2A35]">
                  <Lock size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-black">Change Password</h2>
              </div>

              {passwordMessage.text && (
                <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${
                  passwordMessage.type === 'error' ? 'bg-red-500/10 border border-red-500/50 text-red-500' : 'bg-green-500/10 border border-green-500/50 text-green-500'
                }`}>
                  <AlertTriangle size={18} />
                  <p className="font-medium text-sm">{passwordMessage.text}</p>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-[var(--color-brand-text-secondary)] mb-1 block uppercase tracking-wider">Current Password</label>
                  <input 
                    type="password" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    className="w-full bg-[#0F0F14] border border-[#2A2A35] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-brand-primary)] transition-all font-medium"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--color-brand-text-secondary)] mb-1 block uppercase tracking-wider">New Password</label>
                  <input 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                    className="w-full bg-[#0F0F14] border border-[#2A2A35] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-brand-primary)] transition-all font-medium"
                    placeholder="Create new password"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--color-brand-text-secondary)] mb-1 block uppercase tracking-wider">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                    className="w-full bg-[#0F0F14] border border-[#2A2A35] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-brand-primary)] transition-all font-medium"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={passwordLoading}
                    className="py-3 px-6 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {passwordLoading ? <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span> : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>

            {/* Preferences Section */}
            <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#1A1A22] rounded-xl flex items-center justify-center border border-[#2A2A35]">
                  <Bell size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-black">Preferences</h2>
              </div>

              {prefsMessage.text && (
                <div className="p-4 rounded-xl mb-6 bg-green-500/10 border border-green-500/50 text-green-500 text-sm font-medium">
                  {prefsMessage.text}
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#0F0F14] border border-[#2A2A35] rounded-xl">
                  <div>
                    <h3 className="font-bold text-white mb-1">Theme</h3>
                    <p className="text-sm text-[var(--color-brand-text-secondary)]">Choose your preferred appearance</p>
                  </div>
                  <div className="flex p-1 bg-[#1A1A22] border border-[#2A2A35] rounded-lg">
                    <button 
                      onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                      className={`p-2 rounded-md flex items-center gap-2 text-sm font-bold transition-all ${preferences.theme === 'dark' ? 'bg-[#2A2A35] text-white' : 'text-gray-500 hover:text-white'}`}
                    >
                      <Moon size={16} /> Dark
                    </button>
                    <button 
                      onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                      className={`p-2 rounded-md flex items-center gap-2 text-sm font-bold transition-all ${preferences.theme === 'light' ? 'bg-[#2A2A35] text-white' : 'text-gray-500 hover:text-white'}`}
                    >
                      <Sun size={16} /> Light
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0F0F14] border border-[#2A2A35] rounded-xl">
                  <div>
                    <h3 className="font-bold text-white mb-1">Email Notifications</h3>
                    <p className="text-sm text-[var(--color-brand-text-secondary)]">Receive updates about new features and activities</p>
                  </div>
                  <button 
                    onClick={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
                    className={`w-12 h-6 rounded-full p-1 transition-colors relative ${preferences.emailNotifications ? 'bg-[var(--color-brand-primary)]' : 'bg-gray-600'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${preferences.emailNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handlePreferencesSave}
                    disabled={prefsLoading}
                    className="py-3 px-6 rounded-xl border border-[#2A2A35] hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] text-white font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {prefsLoading ? <span className="w-5 h-5 rounded-full border-2 border-[var(--color-brand-primary)] border-t-transparent animate-spin"></span> : <><Save size={18} /> Save Preferences</>}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
