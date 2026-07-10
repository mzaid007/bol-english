import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/**
 * Wraps routes that require the user to be onboarded (and optionally assessed).
 * Redirects to /onboarding otherwise, preserving the intended destination.
 *
 * props:
 *  - requireAssessment: boolean  (also require assessmentCompleted)
 *  - children
 */
export default function RouteGuard({ requireAssessment = false, children }) {
  const { profile, loaded } = useApp();
  const location = useLocation();

  if (!loaded) return null; // first paint — wait for localStorage read

  if (!profile.onboarded) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }
  if (requireAssessment && !profile.assessmentCompleted) {
    return <Navigate to="/assessment" state={{ from: location }} replace />;
  }

  return children;
}
