import React from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { Monitor, Server, Database, Brain, Network, Users } from 'lucide-react';

const domains = [
  { id: 'frontend', name: 'Frontend Development', icon: <Monitor size={32} className="text-blue-400" />, desc: 'React, UI/UX, CSS, JS Architecture' },
  { id: 'backend', name: 'Backend Development', icon: <Server size={32} className="text-green-400" />, desc: 'Node.js, APIs, System Architecture' },
  { id: 'data-science', name: 'Data Science', icon: <Database size={32} className="text-yellow-400" />, desc: 'Python, Pandas, SQL, ML Models' },
  { id: 'ai-ml', name: 'AI / Machine Learning', icon: <Brain size={32} className="text-purple-400" />, desc: 'Neural Networks, NLP, Computer Vision' },
  { id: 'system-design', name: 'System Design', icon: <Network size={32} className="text-red-400" />, desc: 'Scalability, Load Balancing, Microservices' },
  { id: 'behavioral', name: 'Behavioral Interviews', icon: <Users size={32} className="text-orange-400" />, desc: 'Leadership, Conflict Resolution, Culture Fit' },
];

const DomainSelection = () => {
  const navigate = useNavigate();

  const handleSelect = (domainId: string) => {
    navigate('/skill-level', { state: { domain: domainId } });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Select Interview Domain</h2>
          <p className="text-[var(--color-brand-text-secondary)] text-lg">
            Choose your area of expertise. The AI will generate specialized questions for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => handleSelect(domain.id)}
              className="bg-[var(--color-brand-panel)] border border-[#2A2A35] hover:border-[var(--color-brand-primary)] p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 glow-panel group"
            >
              <div className="bg-[#0F0F14] p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                {domain.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{domain.name}</h3>
              <p className="text-sm text-[var(--color-brand-text-secondary)]">{domain.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DomainSelection;
