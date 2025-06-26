'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // Still checking authentication status
      return;
    }

    if (!isAuthenticated) {
      // User is not authenticated, redirect to login
      router.push(redirectTo);
      return;
    }

    if (requireAdmin && user?.role !== 'admin') {
      // User is authenticated but not admin, redirect to unauthorized page
      router.push('/unauthorized');
      return;
    }

    // User is authenticated and has required permissions
    setShouldRender(true);
  }, [isAuthenticated, isLoading, user, requireAdmin, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading || !shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
