import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LabelList 
} from 'recharts';

const Analytics = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/user/history');
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history for analytics", error);
      }
    };
    fetchHistory();
  }, []);

  // Compute Skill Radar
  const radarData = [
    { subject: 'Confidence', A: 0, fullMark: 100 },
    { subject: 'Technical', A: 0, fullMark: 100 },
    { subject: 'Communication', A: 0, fullMark: 100 },
    { subject: 'Clarity', A: 0, fullMark: 100 },
  ];

  const domainScores: any = {};

  if (history.length > 0) {
    let totals = { confidence: 0, technical: 0, communication: 0, clarity: 0 };
    let counts = { confidence: 0, technical: 0, communication: 0, clarity: 0 };

    history.forEach((h: any) => {
      if (h.feedback) {
        totals.confidence += h.feedback.confidence || 0;
        totals.technical += h.feedback.technical || 0;
        totals.communication += h.feedback.communication || 0;
        totals.clarity += h.feedback.clarity || 0;
        
        counts.confidence += 1;
        counts.technical += 1;
        counts.communication += 1;
        counts.clarity += 1;
      }
      
      if (!domainScores[h.domain]) {
        domainScores[h.domain] = { name: h.domain, score: 0, count: 0 };
      }
      domainScores[h.domain].score += h.score || 0;
      domainScores[h.domain].count += 1;
    });

    radarData[0].A = counts.confidence ? Math.round(totals.confidence / counts.confidence) : 0;
    radarData[1].A = counts.technical ? Math.round(totals.technical / counts.technical) : 0;
    radarData[2].A = counts.communication ? Math.round(totals.communication / counts.communication) : 0;
    radarData[3].A = counts.clarity ? Math.round(totals.clarity / counts.clarity) : 0;
  }

  const barData = Object.values(domainScores).map((d: any) => ({
    name: d.name,
    score: Math.round(d.score / d.count)
  }));

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Performance Analytics</h2>
        <p className="text-[var(--color-brand-text-secondary)]">Deep dive into your interview progress and skill matrix.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-6 rounded-2xl glow-panel">
          <h3 className="text-xl font-bold mb-6 text-center">Skill Breakdown Matrix</h3>
          <div className="h-80 w-full flex justify-center">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#2A2A35" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#A1A1AA', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="A" stroke="#FF5A3C" fill="#FF5A3C" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-[var(--color-brand-text-secondary)]">
                Not enough data. Complete an interview first!
              </div>
            )}
          </div>
        </div>

        <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-6 rounded-2xl glow-panel">
          <h3 className="text-xl font-bold mb-6 text-center">Average Score by Domain</h3>
          <div className="h-80 w-full">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" vertical={false} />
                  <XAxis dataKey="name" stroke="#A1A1AA" tick={{ fill: '#A1A1AA', fontSize: 12 }} />
                  <YAxis stroke="#A1A1AA" tick={{ fill: '#A1A1AA' }} domain={[0, 100]} />
                  <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1A1A22', borderColor: '#2A2A35', borderRadius: '8px' }} />
                  <Bar dataKey="score" fill="url(#colorBarScore)" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="score" position="top" fill="#FFFFFF" />
                  </Bar>
                  <defs>
                    <linearGradient id="colorBarScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4ADE80" stopOpacity={1} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-[var(--color-brand-text-secondary)]">
                Not enough data. Complete an interview first!
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
