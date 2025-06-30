'use client';
import { useEffect, useState } from 'react';

export default function ApiDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : 'http://localhost:5000/api';

    setDebugInfo({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NODE_ENV: process.env.NODE_ENV,
      API_BASE_URL,
      fullMealPlansUrl: `${API_BASE_URL}/meal-plans`,
      timestamp: new Date().toISOString()
    });

    // Test API call
    const testApiCall = async () => {
      try {
        console.log('🧪 Testing API call to meal-plans...');
        const response = await fetch(`${API_BASE_URL}/meal-plans`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        console.log('🧪 Test response status:', response.status);
        console.log('🧪 Test response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
          const data = await response.json();
          setTestResult({ 
            success: true, 
            status: response.status, 
            dataLength: data?.length || 0,
            firstItem: data?.[0]?.name || 'No items'
          });
        } else {
          const errorText = await response.text();
          setTestResult({ 
            success: false, 
            status: response.status, 
            error: errorText 
          });
        }
      } catch (error: any) {
        console.error('🧪 Test API call failed:', error);
        setTestResult({ 
          success: false, 
          error: error.message 
        });
      }
    };

    testApiCall();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      background: 'black', 
      color: 'white', 
      padding: '10px', 
      fontSize: '11px',
      zIndex: 9999,
      maxWidth: '500px',
      wordBreak: 'break-all',
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <h4>API Debug Info</h4>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
      <h4>Test API Call Result</h4>
      <pre>{JSON.stringify(testResult, null, 2)}</pre>
    </div>
  );
}
