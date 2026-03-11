import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Swords, Crown, ArrowRight } from 'lucide-react';
import api from '../services/api';

const SkillLevelSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const domain = location.state?.domain || 'frontend';
  
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const levels = [
    {
      id: 'Beginner',
      title: 'Beginner',
      description: 'New to the domain. Let\'s start with the fundamentals.',
      icon: <Shield size={32} className="text-green-400" />,
      colorClass: 'border-green-400 hover:bg-green-400/10'
    },
    {
      id: 'Intermediate',
      title: 'Intermediate',
      description: 'Comfortable with basics. Ready for a challenge.',
      icon: <Swords size={32} className="text-yellow-400" />,
      colorClass: 'border-yellow-400 hover:bg-yellow-400/10'
    },
    {
      id: 'Advanced',
      title: 'Advanced',
      description: 'Expert level. Bring on the tough questions.',
      icon: <Crown size={32} className="text-red-400" />,
      colorClass: 'border-red-400 hover:bg-red-400/10'
    }
  ];

  const handleLevelSelect = async () => {
    if (!selectedLevel) return;
    setLoading(true);
    try {
      await api.post('/user/set-skill-level', { skillLevel: selectedLevel });
      navigate(`/interview/${domain}?level=${selectedLevel}`);
    } catch (error) {
      console.error("Error setting skill level", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">Choose Your Path</h1>
          <p className="text-lg text-[var(--color-brand-text-secondary)]">
            How familiar are you with your chosen domain? We'll adapt the interview difficulty for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {levels.map((level) => (
            <div
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center glow-panel ${
                selectedLevel === level.id 
                  ? `${level.colorClass} bg-[#1A1A22]` 
                  : 'border-[#2A2A35] hover:border-[#A1A1AA] bg-[#0F0F14]'
              }`}
            >
              <div className="mb-4">{level.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{level.title}</h3>
              <p className="text-[var(--color-brand-text-secondary)]">{level.description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleLevelSelect}
            disabled={!selectedLevel || loading}
            className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all ${
              !selectedLevel || loading
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-primary hover:opacity-90 transform hover:scale-105 shadow-[0_0_20px_rgba(255,90,60,0.4)]'
            }`}
          >
            {loading ? 'Saving...' : 'Confirm Level'}
            {!loading && <ArrowRight size={24} />}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SkillLevelSelection;
