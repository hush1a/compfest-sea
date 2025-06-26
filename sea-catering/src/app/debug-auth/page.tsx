'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function DebugAuthPage() {
  const auth = useAuth();
  const [debugInfo, setDebugInfo] = useState('');
  const [testEmail] = useState('test@example.com');
  const [testPassword] = useState('SecurePassword123!');

  useEffect(() => {
    const info = `
Auth Context State:
- isAuthenticated: ${auth.isAuthenticated}
- isLoading: ${auth.isLoading}
- error: ${auth.error}
- user: ${auth.user ? JSON.stringify(auth.user, null, 2) : 'null'}

Environment:
- NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL}
- window.location: ${typeof window !== 'undefined' ? window.location.href : 'undefined'}
`;
    setDebugInfo(info);
  }, [auth]);

  const handleTestLogin = async () => {
    console.log('=== DEBUG: Starting login test ===');
    try {
      const success = await auth.login(testEmail, testPassword);
      console.log('=== DEBUG: Login result:', success);
    } catch (error) {
      console.error('=== DEBUG: Login error:', error);
    }
  };

  const handleTestLogout = () => {
    console.log('=== DEBUG: Testing logout ===');
    auth.logout();
  };

  const handleClearError = () => {
    console.log('=== DEBUG: Clearing error ===');
    auth.clearError();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Page</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={handleTestLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Login ({testEmail})
        </button>
        
        <button
          onClick={handleTestLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Test Logout
        </button>
        
        <button
          onClick={handleClearError}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Clear Error
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Debug Info:</h2>
        <pre className="text-sm whitespace-pre-wrap">{debugInfo}</pre>
      </div>
      
      <div className="mt-4 bg-blue-50 p-4 rounded">
        <h3 className="font-semibold">Instructions:</h3>
        <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
          <li>Open browser console (F12)</li>
          <li>Click &quot;Test Login&quot; button</li>
          <li>Watch console logs for API calls</li>
          <li>Check if any errors appear</li>
        </ol>
      </div>
    </div>
  );
}
