import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ChevronRight, Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import type { Question } from '../types/Question';

const PlacementTestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const domain = location.state?.domain || 'Software Engineering';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ skillLevel: string; score: number } | null>(null);

  const getCorrectIndex = (q: Question): number => {
    if (typeof q.correctAnswerIndex === 'number') return q.correctAnswerIndex;
    const map: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    return map[(q.correctAnswer || 'A').trim().toUpperCase()] ?? 0;
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.post('/test/start', { domain });
        setQuestions(res.data.questions);
      } catch (err) {
        console.error('Failed to load placement test', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [domain]);

  const handleNext = () => {
    if (selectedOption !== null && questions[currentQuestionIndex]) {
      if (selectedOption === getCorrectIndex(questions[currentQuestionIndex])) {
        setScore((prev) => prev + 1);
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      submitTest();
    }
  };

  const submitTest = async () => {
    setSubmitting(true);
    let finalScore = score;
    if (selectedOption !== null && questions[currentQuestionIndex]) {
      if (selectedOption === getCorrectIndex(questions[currentQuestionIndex])) {
         finalScore += 1;
      }
    }

    try {
      const res = await api.post('/test/submit', { score: finalScore, totalQuestions: questions.length });
      setResult(res.data);
    } catch (err) {
      console.error('Failed to submit test', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <Loader2 size={64} className="text-[var(--color-brand-primary)] animate-spin mb-6" />
          <h2 className="text-3xl font-bold animate-pulse">AI is generating your placement test...</h2>
          <p className="text-[var(--color-brand-text-secondary)] mt-4">Crafting custom questions for {domain}</p>
        </div>
      </Layout>
    );
  }

  if (result) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-20 text-center">
          <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-12 rounded-3xl glow-panel relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-brand opacity-10"></div>
             <div className="relative z-10 flex flex-col items-center">
               <div className="bg-[#1A1A22] p-6 rounded-full mb-8 relative">
                  <div className="absolute inset-0 bg-gradient-brand rounded-full blur-xl opacity-30"></div>
                  <Sparkles size={64} className="text-yellow-400 relative z-10" />
               </div>
               
               <h1 className="text-5xl font-black mb-4">Level Assigned!</h1>
               <div className="mb-6">
                 <span className="inline-block px-6 py-2 rounded-full bg-white/10 text-xl font-bold border border-white/20">
                   {result.skillLevel}
                 </span>
               </div>
               <p className="text-xl text-[var(--color-brand-text-secondary)] mb-10 max-w-md mx-auto">
                 Based on your test ({result.score}%), we have customized your interview difficulty.
               </p>
               
               <button
                 onClick={() => navigate(`/interview/${domain}?level=${result.skillLevel}`)}
                 className="bg-gradient-primary hover:opacity-90 px-10 py-4 rounded-xl font-bold text-xl flex items-center gap-3 transition transform hover:scale-105 shadow-xl"
               >
                 Start Interview
                 <ChevronRight size={24} />
               </button>
             </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!questions.length) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl text-red-500">Failed to load test. Please try again.</h2>
          <button onClick={() => navigate('/skill-level')} className="mt-4 underline">Go Back</button>
        </div>
      </Layout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between text-sm font-bold text-[var(--color-brand-text-secondary)] mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>Difficulty: <span className="text-purple-400">{currentQuestion.difficulty}</span></span>
          </div>
          <div className="w-full bg-[#1A1A22] h-3 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-primary transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-8 md:p-12 rounded-3xl glow-panel">
           <div className="flex items-start gap-4 mb-8">
             <div className="bg-purple-500/20 p-3 rounded-xl mt-1">
               <BrainCircuit className="text-purple-400" size={28} />
             </div>
             <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">{currentQuestion.text}</h2>
           </div>

           <div className="space-y-4 mb-10">
             {currentQuestion.options.map((option, idx) => (
               <div
                 key={idx}
                 onClick={() => setSelectedOption(idx)}
                 className={`p-5 rounded-2xl border-2 cursor-pointer flex items-center gap-4 transition-all duration-200 ${
                   selectedOption === idx 
                     ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 text-white shadow-[0_0_15px_rgba(255,90,60,0.15)] transform scale-[1.02]' 
                     : 'border-[#2A2A35] hover:border-[#A1A1AA] bg-[#0F0F14]'
                 }`}
               >
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                   selectedOption === idx ? 'border-[var(--color-brand-primary)]' : 'border-[#4A4A55]'
                 }`}>
                    {selectedOption === idx && <div className="w-3 h-3 rounded-full bg-[var(--color-brand-primary)]"></div>}
                 </div>
                 <span className="text-lg font-medium">{option}</span>
               </div>
             ))}
           </div>

           <div className="flex justify-end">
             <button
               onClick={handleNext}
               disabled={selectedOption === null || submitting}
               className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all ${
                 selectedOption === null || submitting
                   ? 'bg-[#2A2A35] text-gray-400 cursor-not-allowed border border-[#3A3A45]'
                   : 'bg-white text-black hover:bg-gray-200 transform hover:scale-105 shadow-lg'
               }`}
             >
               {submitting ? 'Analyzing...' : currentQuestionIndex === questions.length - 1 ? 'Submit Test' : 'Next Question'} 
               {!submitting && <ChevronRight size={20} />}
             </button>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default PlacementTestPage;
