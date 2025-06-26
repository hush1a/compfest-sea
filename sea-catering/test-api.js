// Test script to verify frontend-backend connectivity
const API_BASE_URL = 'http://localhost:5000/api';

async function testLogin() {
  try {
    console.log('Testing login API...');
    
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
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (response.ok && data.success) {
      console.log('✅ Login test successful!');
      console.log('User:', data.data.user);
      console.log('Token received:', !!data.data.accessToken);
    } else {
      console.log('❌ Login test failed:', data.message || data.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Run the test
testLogin();
