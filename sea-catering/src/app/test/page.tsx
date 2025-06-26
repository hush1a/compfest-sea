'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'SecurePassword123!'
        }),
      });

      const data = await response.json();
      
      setResult(`
        Status: ${response.status}
        Success: ${data.success}
        Message: ${data.message}
        User: ${JSON.stringify(data.data?.user, null, 2)}
        Token: ${data.data?.accessToken ? 'Received' : 'Not received'}
      `);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuthContext = async () => {
    setLoading(true);
    setResult('Testing Auth Context...');
    
    try {
      // Test the same logic as AuthContext
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'SecurePassword123!'
        }),
      });

      const data = await response.json();
      
      setResult(`
        API URL: ${API_BASE_URL}
        Status: ${response.status}
        Response OK: ${response.ok}
        Success: ${data.success}
        Message: ${data.message}
        Data exists: ${!!data.data}
        User: ${JSON.stringify(data.data?.user, null, 2)}
        Token: ${data.data?.accessToken ? 'Received' : 'Not received'}
      `);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : '';
      setResult(`Error: ${errorMessage}\nStack: ${errorStack}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="space-y-4">
        <button
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Direct API Call
        </button>
        
        <button
          onClick={testAuthContext}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test AuthContext Logic
        </button>
      </div>
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Result:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
          {result || 'Click a button to test'}
        </pre>
      </div>
    </div>
  );
}
