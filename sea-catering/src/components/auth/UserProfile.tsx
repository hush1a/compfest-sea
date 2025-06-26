'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // Redirect is handled by AuthContext
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-orange-100 mb-4">
          <svg className="h-12 w-12 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <div className="space-y-4">
        {/* Role Badge */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Role:</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.role === 'admin' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {user.role === 'admin' ? '👑 Admin' : '👤 User'}
          </span>
        </div>

        {/* Account Status */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {user.isActive ? '✅ Active' : '❌ Inactive'}
          </span>
        </div>

        {/* Member Since */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Member Since:</span>
          <span className="text-sm text-gray-600">
            {formatDate(user.createdAt)}
          </span>
        </div>

        {/* Last Login */}
        {user.lastLogin && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Last Login:</span>
            <span className="text-sm text-gray-600">
              {formatDate(user.lastLogin)}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {isLoggingOut ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing Out...
            </>
          ) : (
            'Sign Out'
          )}
        </button>
        
        {user.role === 'admin' && (
          <button
            className="w-full flex justify-center py-2 px-4 border border-orange-300 rounded-lg shadow-sm text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
          >
            👑 Admin Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
