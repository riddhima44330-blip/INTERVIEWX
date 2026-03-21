import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { 
  Monitor, Server, Database, Brain, Network, Users, 
  UploadCloud, FileText, ArrowRight, Shield, Swords, Crown, 
  ChevronRight, BrainCircuit, Loader2
} from 'lucide-react';
import api from '../services/api';
import type { Question } from '../types/Question';

const domains = [
  { id: 'frontend', name: 'Frontend Development', icon: <Monitor size={32} className="text-blue-400" />, desc: 'React, UI/UX, CSS, JS Architecture' },
  { id: 'backend', name: 'Backend Development', icon: <Server size={32} className="text-green-400" />, desc: 'Node.js, APIs, System Architecture' },
  { id: 'data-science', name: 'Data Science', icon: <Database size={32} className="text-yellow-400" />, desc: 'Python, Pandas, SQL, ML Models' },
  { id: 'ai-ml', name: 'AI / Machine Learning', icon: <Brain size={32} className="text-purple-400" />, desc: 'Neural Networks, NLP, Computer Vision' },
  { id: 'system-design', name: 'System Design', icon: <Network size={32} className="text-red-400" />, desc: 'Scalability, Load Balancing, Microservices' },
  { id: 'behavioral', name: 'Behavioral Interviews', icon: <Users size={32} className="text-orange-400" />, desc: 'Leadership, Conflict Resolution, Culture Fit' },
];

const levels = [
  {
    id: 'Beginner',
    title: 'Beginner',
    description: 'New to the domain. Let\'s start with the fundamentals.',
    icon: <Shield size={32} className="text-green-400" />,
  },
  {
    id: 'Intermediate',
    title: 'Intermediate',
    description: 'Comfortable with basics. Ready for a challenge.',
    icon: <Swords size={32} className="text-yellow-400" />,
  },
  {
    id: 'Advanced',
    title: 'Advanced',
    description: 'Expert level. Bring on the tough questions.',
    icon: <Crown size={32} className="text-red-400" />,
  }
];

const DomainSelection = () => {
  const navigate = useNavigate();
  
  // STEP 8: STATE MANAGEMENT
  const [step, setStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [detectedLevel, setDetectedLevel] = useState('');
  const [testScore, setTestScore] = useState(0);

  const finalLevel = selectedLevel || detectedLevel || 'Beginner';

  // Step 3 (Resume Upload) States
  const [file, setFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Step 4 (Test) States
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testSubmitting, setTestSubmitting] = useState(false);

  // --- HANDLERS ---
  
  // Step 1: Handle Domain Selection
  const handleDomainSelect = (domainId: string) => {
    setSelectedDomain(domainId);
    setStep(2);
  };

  // Step 2: Manual Level Selection
  const handleManualLevelSelect = (levelId: string) => {
    setSelectedLevel(levelId);
    setStep(7);
  };

  // Step 3: Resume Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadLoading(true);
    setUploadError('');
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const uploadRes = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (uploadRes.data.detectedLevel) {
        setDetectedLevel(uploadRes.data.detectedLevel);
      } else {
        setDetectedLevel('Intermediate'); 
      }
      setStep(7);
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Error uploading resume. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  // Step 4: Take Test Flow
  const startTestFlow = async () => {
    setStep(4);
    setTestLoading(true);
    try {
      const res = await api.post('/test/start', { domain: selectedDomain });
      setQuestions(res.data.questions);
    } catch (err) {
      console.error('Failed to load placement test', err);
    } finally {
      setTestLoading(false);
    }
  };

  const getCorrectIndex = (q: Question): number => {
    if (typeof q.correctAnswerIndex === 'number') return q.correctAnswerIndex;
    const map: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    return map[(q.correctAnswer || 'A').trim().toUpperCase()] ?? 0;
  };

  const handleNextQuestion = () => {
    let currentScore = testScore;
    if (selectedOption !== null && questions[currentQuestionIndex]) {
      if (selectedOption === getCorrectIndex(questions[currentQuestionIndex])) {
        currentScore += 1;
        setTestScore(currentScore);
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      finishTest(currentScore);
    }
  };

  // Step 5: Test Level Calculation
  const finishTest = (finalScore: number) => {
     setTestSubmitting(true);
     // Calculate level based on score out of 10
     let calcLevel = 'Beginner';
     if (finalScore >= 7) calcLevel = 'Advanced';
     else if (finalScore >= 4) calcLevel = 'Intermediate';
     
     setDetectedLevel(calcLevel);
     
     // Simulate slight delay for effect
     setTimeout(() => {
       setTestSubmitting(false);
       setStep(7);
     }, 1000);
  };

  // Step 7: Final Interview Start
  const startInterview = () => {
    navigate(`/interview/${selectedDomain}?level=${finalLevel}`);
  };

  // --- RENDER STEPS ---

  if (step === 1) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12">
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
                onClick={() => handleDomainSelect(domain.id)}
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
  }

  if (step === 2) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4">Determine Your Level</h1>
            <p className="text-lg text-[var(--color-brand-text-secondary)]">
              Choose how you would like us to evaluate your expertise for {domains.find(d => d.id === selectedDomain)?.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <button 
              onClick={() => setStep(3)} 
              className="bg-[var(--color-brand-panel)] border border-[#2A2A35] hover:border-[var(--color-brand-primary)] p-8 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 glow-panel group"
            >
               <UploadCloud size={48} className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
               <h3 className="text-2xl font-bold mb-2 text-white">Resume Upload</h3>
               <p className="text-[var(--color-brand-text-secondary)]">AI will detect your level from your resume experience.</p>
            </button>
            <button 
              onClick={startTestFlow} 
              className="bg-[var(--color-brand-panel)] border border-[#2A2A35] hover:border-[var(--color-brand-primary)] p-8 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 glow-panel group"
            >
               <BrainCircuit size={48} className="text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
               <h3 className="text-2xl font-bold mb-2 text-white">Take Test</h3>
               <p className="text-[var(--color-brand-text-secondary)]">Answer 10 MCQs to dynamically evaluate your level.</p>
            </button>
          </div>

          <div className="text-center mb-8">
             <h2 className="text-2xl font-bold text-[var(--color-brand-text-secondary)]">OR Select Your Level Manually</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {levels.map((level) => (
              <div
                key={level.id}
                onClick={() => handleManualLevelSelect(level.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center glow-panel border-[#2A2A35] hover:border-[#A1A1AA] bg-[#0F0F14]`}
              >
                <div className="mb-4">{level.icon}</div>
                <h3 className="text-2xl font-bold mb-2 text-white">{level.title}</h3>
                <p className="text-[var(--color-brand-text-secondary)]">{level.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (step === 3) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-16">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black mb-4">Analyze Your Resume</h1>
            <p className="text-[var(--color-brand-text-secondary)]">
              Upload your resume (PDF/DOCX) to automatically detect your interview level.
            </p>
          </div>

          <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-8 rounded-3xl glow-panel">
            <div className="border-2 border-dashed border-[#2A2A35] hover:border-[var(--color-brand-primary)] transition-colors rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer relative">
              <input 
                type="file" 
                accept=".pdf,.docx" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              {file ? (
                <>
                  <FileText size={48} className="text-[var(--color-brand-primary)] mb-4" />
                  <p className="text-xl font-bold text-white mb-2">{file.name}</p>
                  <p className="text-[var(--color-brand-text-secondary)] text-sm">Click to select a different file</p>
                </>
              ) : (
                <>
                  <UploadCloud size={48} className="text-[var(--color-brand-text-secondary)] mb-4" />
                  <p className="text-xl font-bold text-white mb-2">Drag & Drop your resume</p>
                  <p className="text-[var(--color-brand-text-secondary)] text-sm">Or click to browse files (PDF, DOCX)</p>
                </>
              )}
            </div>

            {uploadError && <p className="text-red-400 mt-4 text-center">{uploadError}</p>}

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleUpload}
                disabled={!file || uploadLoading}
                className={`px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-3 transition-all ${
                  !file || uploadLoading
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white shadow-lg glow-primary'
                }`}
              >
                {uploadLoading ? 'Uploading & Parsing...' : 'Analyze Resume'}
                {!uploadLoading && <ArrowRight size={20} />}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (step === 4) {
    if (testLoading) {
      return (
        <Layout>
          <div className="min-h-[70vh] flex flex-col items-center justify-center">
            <Loader2 size={64} className="text-[var(--color-brand-primary)] animate-spin mb-6" />
            <h2 className="text-3xl font-bold animate-pulse text-white">Generating placement test...</h2>
          </div>
        </Layout>
      );
    }
    
    if (!questions.length) {
      return (
        <Layout>
          <div className="text-center py-20">
            <h2 className="text-2xl text-red-500">Failed to load test. Please try again.</h2>
            <button onClick={() => setStep(2)} className="mt-4 underline text-white">Go Back Options</button>
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
              <span>Difficulty: <span className="text-purple-400">{currentQuestion.difficulty || 'Mixed'}</span></span>
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
              <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-white">{currentQuestion.text}</h2>
            </div>

            <div className="space-y-4 mb-10">
              {currentQuestion.options.map((option, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer flex items-center gap-4 transition-all duration-200 ${
                    selectedOption === idx 
                      ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 text-white shadow-[0_0_15px_rgba(255,90,60,0.15)] transform scale-[1.02]' 
                      : 'border-[#2A2A35] hover:border-[#A1A1AA] bg-[#0F0F14] text-white'
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
                onClick={handleNextQuestion}
                disabled={selectedOption === null || testSubmitting}
                className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all ${
                  selectedOption === null || testSubmitting
                    ? 'bg-[#2A2A35] text-gray-400 cursor-not-allowed border border-[#3A3A45]'
                    : 'bg-white text-black hover:bg-gray-200 transform hover:scale-105 shadow-lg'
                }`}
              >
                {testSubmitting ? 'Analyzing...' : currentQuestionIndex === questions.length - 1 ? 'Submit Test' : 'Next Question'} 
                {!testSubmitting && <ChevronRight size={20} />}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Step 7: Final Page
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="bg-[var(--color-brand-panel)] border border-[#2A2A35] p-12 rounded-3xl glow-panel relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-brand opacity-10"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-[#1A1A22] p-6 rounded-full mb-8 relative">
                <div className="absolute inset-0 bg-gradient-brand rounded-full blur-xl opacity-30"></div>
                <Crown size={64} className="text-yellow-400 relative z-10" />
              </div>
              
              <h1 className="text-5xl font-black mb-4 text-white">Level Assigned!</h1>
              <div className="mb-6">
                <span className="inline-block px-6 py-2 rounded-full bg-white/10 text-xl font-bold border border-white/20 text-white">
                  {finalLevel}
                </span>
              </div>
              <p className="text-xl text-[var(--color-brand-text-secondary)] mb-10 max-w-md mx-auto">
                {selectedLevel 
                  ? "You have manually selected this expertise level." 
                  : (step === 7 && detectedLevel && !selectedLevel && questions.length > 0 
                      ? `Based on your test score (${testScore}/10), we assigned you this difficulty.` 
                      : `Based on your resume, we detected this expertise level.`)}
              </p>
              
              <button
                onClick={startInterview}
                className="bg-gradient-primary hover:opacity-90 px-10 py-4 rounded-xl font-bold text-xl flex items-center gap-3 transition transform hover:scale-105 shadow-xl text-white"
              >
                Start Interview
                <ChevronRight size={24} />
              </button>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default DomainSelection;
