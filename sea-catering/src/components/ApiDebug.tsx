'use client';
import { useEffect, useState } from 'react';

export default function ApiDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});

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
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      background: 'black', 
      color: 'white', 
      padding: '10px', 
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '400px',
      wordBreak: 'break-all'
    }}>
      <h4>API Debug Info</h4>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
}
