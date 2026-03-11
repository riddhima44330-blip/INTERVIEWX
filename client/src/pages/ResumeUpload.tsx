import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, ArrowRight } from 'lucide-react';
import api from '../services/api';

const ResumeUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const uploadRes = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const parsedText = uploadRes.data.text;
      
      // Navigate to analysis page passing the raw text to trigger analysis
      navigate('/resume-analysis', { state: { text: parsedText } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error uploading resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-4">Analyze Your Resume</h1>
          <p className="text-[var(--color-brand-text-secondary)]">
            Upload your resume (PDF/DOCX) to generate personalized interview questions based on your actual experience.
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

          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-3 transition-all ${
                !file || loading
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white shadow-lg glow-primary'
              }`}
            >
              {loading ? 'Uploading & Parsing...' : 'Analyze Resume'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeUpload;
