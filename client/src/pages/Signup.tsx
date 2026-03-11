import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import api from '../services/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--color-brand-panel)] rounded-2xl p-8 glow-panel">
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mb-4 glow-primary">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-[var(--color-brand-text-secondary)]">Join InterviewX to level up</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-brand-text-secondary)] mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0F0F14] border border-[#2A2A35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-brand-text-secondary)] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0F0F14] border border-[#2A2A35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-brand-text-secondary)] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0F0F14] border border-[#2A2A35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-[var(--color-brand-text-secondary)]">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-brand-primary)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
