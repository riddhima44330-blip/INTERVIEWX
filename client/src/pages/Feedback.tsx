import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import { Award, ChevronLeft, Brain, Cpu, MessageSquare, Zap } from 'lucide-react';

const Feedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data } = await api.get('/user/history');
        const found = data.find((i: any) => i._id === id);
        setInterview(found);
      } catch (error) {
        console.error("Failed to fetch feedback", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [id]);

  if (loading) return <Layout><div className="text-center mt-20">Loading feedback...</div></Layout>;
  if (!interview) return <Layout><div className="text-center mt-20">Interview not found.</div></Layout>;

  const fb = interview.feedback || { confidence: 0, technical: 0, communication: 0, clarity: 0, suggestions: [] };

  const ScoreBar = ({ label, score, icon: Icon, color }: any) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="flex items-center gap-2 font-medium text-[var(--color-brand-text-secondary)]">
          <Icon size={18} className={color} /> {label}
        </span>
        <span className="font-bold text-white">{score}%</span>
      </div>
      <div className="w-full bg-[#2A2A35] rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-1000 bg-current"
          style={{ width: `${score}%`, color: color.replace('text-', '') }}
        ></div>
      </div>
    </div>
  );

  return (
    <Layout>
      <button 
        onClick={() => navigate('/dashboard')} 
        className="flex items-center gap-2 text-[var(--color-brand-text-secondary)] hover:text-white mb-6"
      >
        <ChevronLeft size={20} /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-8 rounded-2xl glow-panel flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full border-4 border-[var(--color-brand-primary)] flex items-center justify-center mb-6 relative shadow-lg glow-primary">
              <span className="text-4xl font-black bg-gradient-primary -webkit-background-clip-text text-transparent bg-clip-text">
                {interview.score}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Overall Score</h2>
            <p className="text-[var(--color-brand-text-secondary)] mb-6">Domain: {interview.domain}</p>
            <div className="w-full border-t border-[#2A2A35] pt-6 text-left">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Award size={20} className="text-yellow-500" /> AI Suggestions
              </h3>
              <ul className="space-y-3">
                {fb.suggestions?.map((suggestion: string, i: number) => (
                  <li key={i} className="text-sm bg-[#0F0F14] p-3 rounded-lg border border-[#2A2A35] text-[var(--color-brand-text-secondary)]">
                    {suggestion}
                  </li>
                )) || <li className="text-sm text-gray-500">No suggestions available.</li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-8 rounded-2xl glow-panel">
            <h3 className="text-xl font-bold mb-6">Skill Breakdown</h3>
            <ScoreBar label="Confidence" score={fb.confidence} icon={Zap} color="text-yellow-400" />
            <ScoreBar label="Technical Accuracy" score={fb.technical} icon={Cpu} color="text-blue-400" />
            <ScoreBar label="Communication" score={fb.communication} icon={MessageSquare} color="text-purple-400" />
            <ScoreBar label="Clarity" score={fb.clarity} icon={Brain} color="text-green-400" />
          </div>

          <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-8 rounded-2xl glow-panel">
            <h3 className="text-xl font-bold mb-6">Interview Transcript</h3>
            <div className="space-y-6">
              {interview.questions.map((q: string, i: number) => (
                <div key={i} className="bg-[#0F0F14] border border-[#2A2A35] p-5 rounded-xl">
                  <p className="font-bold text-[var(--color-brand-primary)] mb-3 flex items-start gap-2">
                    <span className="bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] px-2 py-0.5 rounded text-xs mt-0.5">Q{i + 1}</span>
                    {q}
                  </p>
                  <p className="text-[var(--color-brand-text-secondary)] text-sm leading-relaxed pl-9">
                    {interview.answers[i] || "No answer recorded."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
