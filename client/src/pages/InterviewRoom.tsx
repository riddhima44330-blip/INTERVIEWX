import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, Square, ChevronRight, Loader2, CheckCircle } from 'lucide-react';

const InterviewRoom = () => {
  const { domain } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [isAnswering, setIsAnswering] = useState(false);
  const [timer, setTimer] = useState(60);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    const initInterview = async () => {
      try {
        const { data: aiData } = await api.post('/ai/generate-questions', { domain });
        const generatedQs = aiData.questions;
        setQuestions(generatedQs);
        
        const { data: interviewData } = await api.post('/interview/start', {
          domain,
          questions: generatedQs,
        });
        setInterviewId(interviewData._id);
      } catch (error) {
        console.error("Failed to start interview", error);
      } finally {
        setLoading(false);
      }
    };
    initInterview();
  }, [domain]);

  useEffect(() => {
    let interval: any;
    if (isAnswering && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0 && isAnswering) {
      stopRecording();
    }
    return () => clearInterval(interval);
  }, [isAnswering, timer]);

  const startRecording = () => {
    resetTranscript();
    setTimer(60);
    setIsAnswering(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopRecording = () => {
    setIsAnswering(false);
    SpeechRecognition.stopListening();
  };

  const submitAnswer = async () => {
    if (!interviewId) return;
    
    stopRecording();
    
    // Save answer to backend
    await api.post('/interview/answer', {
      interviewId,
      answer: transcript || 'No answer recorded',
      transcript: transcript || '',
    });

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetTranscript();
      setTimer(60);
    } else {
      finishInterview();
    }
  };

  const finishInterview = async () => {
    setLoading(true);
    try {
      const { data: feedbackData } = await api.post('/ai/generate-feedback', { interviewId });
      await api.post('/interview/finish', {
        interviewId,
        score: feedbackData.score,
        feedback: feedbackData.feedback
      });
      navigate(`/feedback/${interviewId}`);
    } catch (error) {
      console.error("Failed to fetch feedback", error);
      setLoading(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <Layout>
        <div className="text-center text-red-500">
          Browser doesn't support speech recognition. Please use Google Chrome.
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-[var(--color-brand-primary)] w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold">AI is preparing your interview...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-[var(--color-brand-text-secondary)] mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(((currentIndex) / questions.length) * 100)}% Completed</span>
          </div>
          <div className="w-full bg-[#2A2A35] rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-500 shadow-lg glow-primary" 
              style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-[var(--color-brand-panel)] border border-[var(--color-brand-primary)]/30 rounded-2xl p-8 mb-8 relative glow-primary">
          <div className="absolute top-0 right-0 p-4 font-mono text-[var(--color-brand-primary)] font-bold">
            {timer}s
          </div>
          <h2 className="text-2xl font-bold mb-6 text-white leading-relaxed">
            {questions[currentIndex]}
          </h2>
          
          <div className="bg-[#0F0F14] rounded-xl p-4 min-h-[150px] border border-[#2A2A35] mb-6 relative">
            {transcript ? (
              <p className="text-gray-300 leading-relaxed">{transcript}</p>
            ) : (
              <p className="text-gray-500 italic flex items-center justify-center h-full">
                Your transcribed answer will appear here...
              </p>
            )}
            {listening && (
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Recording</span>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-between">
            <div className="flex gap-4">
              {!isAnswering ? (
                <button
                  onClick={startRecording}
                  className="bg-gradient-primary hover:opacity-90 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2"
                >
                  <Mic size={20} />
                  Start Answering
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2"
                >
                  <Square size={20} />
                  Stop Recording
                </button>
              )}
            </div>

            <button
              onClick={submitAnswer}
              disabled={isAnswering}
              className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors ${
                !isAnswering && transcript 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-[#2A2A35] text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentIndex === questions.length - 1 ? (
                <>Finish Interview <CheckCircle size={20} /></>
              ) : (
                <>Next Question <ChevronRight size={20} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InterviewRoom;
