import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, Flame, Award, PlayCircle, Trophy } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [{ data: statsData }, { data: historyData }, { data: leadData }] = await Promise.all([
          api.get('/user/stats'),
          api.get('/user/history'),
          api.get('/leaderboard')
        ]);
        setStats(statsData);
        setHistory(historyData);
        setLeaderboard(leadData);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchDashboardData();
  }, []);

  const chartData = history.slice(0, 5).reverse().map((h, i) => ({
    name: `Int ${i + 1}`,
    score: h.score || 0
  }));

  if (chartData.length === 0) {
    chartData.push({ name: 'Start', score: 0 });
  }

  return (
    <Layout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome back, <span className="text-[var(--color-brand-primary)]">{user?.name?.split(' ')[0]}</span>!</h2>
          <p className="text-[var(--color-brand-text-secondary)]">Ready to level up your interviewing skills?</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/domain-selection')}
            className="bg-gradient-primary hover:opacity-90 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transform transition hover:scale-105 shadow-lg glow-primary"
          >
            <PlayCircle size={20} />
            Start Interview
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-6 rounded-2xl flex items-center gap-4 glow-panel relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--color-brand-primary)]/10 rounded-full blur-xl group-hover:bg-[var(--color-brand-primary)]/20 transition-colors"></div>
          <div className="bg-yellow-500/20 p-4 rounded-xl text-yellow-500 z-10">
            <Zap size={28} />
          </div>
          <div className="z-10">
            <p className="text-sm text-[var(--color-brand-text-secondary)] font-medium">Total XP</p>
            <p className="text-3xl font-black">{stats?.xp ?? 0}</p>
          </div>
        </div>

        <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-6 rounded-2xl flex items-center gap-4 glow-panel relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-colors"></div>
          <div className="bg-orange-500/20 p-4 rounded-xl text-orange-500 z-10">
            <Flame size={28} />
          </div>
          <div className="z-10">
            <p className="text-sm text-[var(--color-brand-text-secondary)] font-medium">Day Streak</p>
            <p className="text-3xl font-black">{stats?.streak ?? 0}</p>
          </div>
        </div>

        <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-6 rounded-2xl flex items-center gap-4 glow-panel relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors"></div>
          <div className="bg-purple-500/20 p-4 rounded-xl text-purple-400 z-10">
            <Award size={28} />
          </div>
          <div className="z-10">
            <p className="text-sm text-[var(--color-brand-text-secondary)] font-medium">Level</p>
            <p className="text-3xl font-black">{stats?.level ?? 1}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Chart */}
          <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-6 rounded-2xl glow-panel">
            <h3 className="text-xl font-bold mb-6">Performance Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF5A3C" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FF5A3C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" vertical={false} />
                  <XAxis dataKey="name" stroke="#A1A1AA" tick={{fill: '#A1A1AA'}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#A1A1AA" tick={{fill: '#A1A1AA'}} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A22', borderColor: '#2A2A35', borderRadius: '8px' }}
                    itemStyle={{ color: '#FF5A3C', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#FF5A3C" strokeWidth={3} dot={{ fill: '#FF5A3C', r: 4 }} activeDot={{ r: 6, fill: '#FF5A3C', stroke: '#1A1A22', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent history */}
          <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-6 rounded-2xl glow-panel">
            <h3 className="text-xl font-bold mb-4">Recent Interviews</h3>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.slice(0, 3).map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-4 bg-[#0F0F14] rounded-xl border border-[#2A2A35] hover:border-[var(--color-brand-primary)]/50 transition-colors">
                    <div>
                      <p className="font-bold">{item.domain}</p>
                      <p className="text-sm text-[var(--color-brand-text-secondary)]">{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-[var(--color-brand-success)]">{item.score} / 100</div>
                      <button onClick={() => navigate(`/feedback/${item._id}`)} className="text-xs text-[var(--color-brand-primary)] hover:underline mt-1">View Feedback</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--color-brand-text-secondary)]">
                <p className="mb-4">No interviews yet. Time to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard side panel */}
        <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-6 rounded-2xl glow-panel h-max">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="text-yellow-500" size={24} />
            <h3 className="text-xl font-bold">Top Candidates</h3>
          </div>
          <div className="space-y-4">
            {leaderboard.length > 0 ? leaderboard.map((l, idx) => (
              <div key={l._id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-yellow-500/20 text-yellow-500' : idx === 1 ? 'bg-gray-300/20 text-gray-300' : idx === 2 ? 'bg-orange-700/20 text-orange-400' : 'bg-[#2A2A35] text-white'}`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{l.userId?.name || 'Unknown'}</p>
                  <p className="text-xs text-[var(--color-brand-text-secondary)]">Lvl {l.userId?.level || 1}</p>
                </div>
                <div className="font-bold text-[var(--color-brand-primary)] text-sm">{l.xp} XP</div>
              </div>
            )) : (
              <p className="text-sm text-[var(--color-brand-text-secondary)]">Leaderboard empty. Claim the top spot!</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
