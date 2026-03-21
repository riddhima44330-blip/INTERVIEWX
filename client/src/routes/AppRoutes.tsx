import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import DomainSelection from '../pages/DomainSelection';
import InterviewRoom from '../pages/InterviewRoom';
import Feedback from '../pages/Feedback';
import Analytics from '../pages/Analytics';
import SkillLevelSelection from '../pages/SkillLevelSelection';
import ResumeUpload from '../pages/ResumeUpload';
import ResumeAnalysis from '../pages/ResumeAnalysis';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import CommunityPage from '../pages/CommunityPage';
import PlacementTestPage from '../pages/PlacementTestPage';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/domain-selection" element={<ProtectedRoute><DomainSelection /></ProtectedRoute>} />
      <Route path="/interview/:domain" element={<ProtectedRoute><InterviewRoom /></ProtectedRoute>} />
      <Route path="/feedback/:id" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/skill-level" element={<ProtectedRoute><SkillLevelSelection /></ProtectedRoute>} />
      <Route path="/placement-test" element={<ProtectedRoute><PlacementTestPage /></ProtectedRoute>} />
      <Route path="/resume-upload" element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
      <Route path="/resume-analysis" element={<ProtectedRoute><ResumeAnalysis /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
