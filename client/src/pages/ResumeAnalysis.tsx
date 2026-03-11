import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Cpu, Briefcase, Code, ArrowRight } from 'lucide-react';
import api from '../services/api';

const ResumeAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const text = location.state?.text || '';
  
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (!text) {
      navigate('/resume-upload');
      return;
    }

    const analyzeText = async () => {
      try {
        const res = await api.post('/resume/analyze', { text });
        setAnalysis(res.data.resumeData);
      } catch (err) {
        console.error("Error analyzing resume", err);
      } finally {
        setLoading(false);
      }
    };

    analyzeText();
  }, [text, navigate]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-4">Resume Analysis</h1>
          <p className="text-[var(--color-brand-text-secondary)]">
            We've extracted your core strengths from your resume.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--color-brand-primary)] mb-4"></div>
            <p className="text-xl font-bold animate-pulse text-[var(--color-brand-primary)]">AI processing resume...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-6 rounded-2xl glow-panel">
                <div className="flex items-center gap-3 mb-6 border-b border-[#2A2A35] pb-4">
                  <Code size={24} className="text-blue-400" />
                  <h2 className="text-2xl font-bold">Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills?.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-6 rounded-2xl glow-panel">
                <div className="flex items-center gap-3 mb-6 border-b border-[#2A2A35] pb-4">
                  <Cpu size={24} className="text-purple-400" />
                  <h2 className="text-2xl font-bold">Technologies</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.technologies?.map((tech: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-6 rounded-2xl glow-panel md:col-span-2">
                <div className="flex items-center gap-3 mb-6 border-b border-[#2A2A35] pb-4">
                  <Briefcase size={24} className="text-green-400" />
                  <h2 className="text-2xl font-bold">Experience Focus</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.experienceKeywords?.map((exp: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-sm font-medium">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-[var(--color-brand-primary)]/20 to-[var(--color-brand-secondary)]/20 p-8 rounded-2xl border border-[var(--color-brand-primary)]/30 text-center relative overflow-hidden">
               <div className="relative z-10 flex flex-col items-center">
                 <CheckCircle size={48} className="text-[var(--color-brand-success)] mb-4" />
                 <h3 className="text-2xl font-bold mb-2">Profile Updated</h3>
                 <p className="text-lg text-[var(--color-brand-text-secondary)] mb-6 max-w-xl">
                   Your future interviews will now incorporate relevant questions based on these extracted skills.
                 </p>
                 <button 
                   onClick={() => navigate('/dashboard')}
                   className="bg-gradient-primary hover:opacity-90 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transform transition hover:scale-105"
                 >
                   Continue to Dashboard <ArrowRight size={20} />
                 </button>
               </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-red-400">
            <p>Failed to analyze resume. Please try again.</p>
            <button onClick={() => navigate('/resume-upload')} className="mt-4 underline">Go Back</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ResumeAnalysis;
