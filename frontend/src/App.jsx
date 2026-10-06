import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProfileSetup from './pages/ProfileSetup';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Trackers from './pages/Trackers';
import MedicationSearch from './pages/MedicationSearch';
import Nutrition from './pages/Nutrition';
import Exercise from './pages/Exercise';
import DietPlanner from './pages/DietPlanner';
import WorkoutPlanner from './pages/WorkoutPlanner';
import HealthChat from './pages/HealthChat';
import MedicationAlertManager from './components/MedicationAlertManager';
import { Loader } from 'lucide-react';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c1530] flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-green-400" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Onboarding Guard - makes sure user fills profile first
function ProfileOnboardingGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c1530] flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-green-400" />
      </div>
    );
  }

  if (user && !user.hasProfile) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MedicationAlertManager />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Profile Onboarding Wizard */}
          <Route 
            path="/profile-setup" 
            element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            } 
          />

          {/* App Core Pages */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <ProfileOnboardingGuard>
                  <Dashboard />
                </ProfileOnboardingGuard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trackers" 
            element={
              <ProtectedRoute>
                <ProfileOnboardingGuard>
                  <Trackers />
                </ProfileOnboardingGuard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/medications" 
            element={
              <ProtectedRoute>
                <ProfileOnboardingGuard>
                  <MedicationSearch />
                </ProfileOnboardingGuard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/nutrition" 
            element={
              <ProtectedRoute>
                <ProfileOnboardingGuard>
                  <Nutrition />
                </ProfileOnboardingGuard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/exercise" 
            element={
              <ProtectedRoute>
                <ProfileOnboardingGuard>
                  <Exercise />
                </ProfileOnboardingGuard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfileOnboardingGuard>
                  <Profile />
                </ProfileOnboardingGuard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/diet" 
            element={
              <ProtectedRoute>
                <ProfileOnboardingGuard>
                  <DietPlanner />
                </ProfileOnboardingGuard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/workout" 
            element={
              <ProtectedRoute>
                <ProfileOnboardingGuard>
                  <WorkoutPlanner />
                </ProfileOnboardingGuard>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ProfileOnboardingGuard>
                  <HealthChat />
                </ProfileOnboardingGuard>
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
