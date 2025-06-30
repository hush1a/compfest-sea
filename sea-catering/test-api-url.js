// Test script to verify API URL construction
const NEXT_PUBLIC_API_URL = 'https://compfest-sea-production.up.railway.app';
const API_BASE_URL = NEXT_PUBLIC_API_URL 
  ? `${NEXT_PUBLIC_API_URL}/api`
  : 'http://localhost:5000/api';

console.log('NEXT_PUBLIC_API_URL:', NEXT_PUBLIC_API_URL);
console.log('Constructed API_BASE_URL:', API_BASE_URL);
console.log('Example meal-plans URL:', `${API_BASE_URL}/meal-plans`);
