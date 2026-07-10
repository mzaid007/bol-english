import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import AppHeader from './components/layout/AppHeader';
import BottomNav from './components/layout/BottomNav';
import RouteGuard from './components/layout/RouteGuard';

// Routes
import OnboardingRoute from './routes/OnboardingRoute';
import AssessmentRoute from './routes/AssessmentRoute';
import DashboardRoute from './routes/DashboardRoute';
import LessonRoute from './routes/LessonRoute';
import ProfileRoute from './routes/ProfileRoute';

function Layout() {
  return (
    <>
      <AppHeader />
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public/Onboarding route */}
            <Route path="/onboarding" element={<OnboardingRoute />} />

            {/* Assessment Route (requires name/goal onboarding, but not placement assessment completion) */}
            <Route
              path="/assessment"
              element={
                <RouteGuard requireAssessment={false}>
                  <AssessmentRoute />
                </RouteGuard>
              }
            />

            {/* Core learning layout (requires full onboarding and assessment) */}
            <Route
              element={
                <RouteGuard requireAssessment={true}>
                  <Layout />
                </RouteGuard>
              }
            >
              <Route path="/" element={<DashboardRoute />} />
              <Route path="/dashboard" element={<DashboardRoute />} />
              <Route path="/profile" element={<ProfileRoute />} />
            </Route>

            {/* Immersive standalone lesson player (requires assessment, but no header/footer to avoid distraction) */}
            <Route
              path="/lesson/:id"
              element={
                <RouteGuard requireAssessment={true}>
                  <LessonRoute />
                </RouteGuard>
              }
            />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ToastProvider>
  );
}
