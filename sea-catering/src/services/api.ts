// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Generic API error handler
const handleApiError = (error: any) => {
  if (error.response?.data?.error) {
    throw new Error(error.response.data.error);
  } else if (error.message) {
    throw new Error(error.message);
  } else {
    throw new Error('An unexpected error occurred');
  }
};

// Helper function to get CSRF token from cookies
const getCSRFToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrf-token=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

// Helper function to sanitize input on client side
const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '') // Remove < and > characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove on* event handlers
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        sanitized[key] = sanitizeInput(input[key]);
      }
    }
    return sanitized;
  }
  
  return input;
};

// Generic fetch function with error handling
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    // Add credentials for CORS
    credentials: 'include',
  };

  // Add CSRF token for non-GET requests
  if (options.method && !['GET', 'HEAD'].includes(options.method)) {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'X-CSRF-Token': csrfToken
      };
    }
  }

  const config = { ...defaultOptions, ...options };

  // Sanitize request body if present
  if (config.body && typeof config.body === 'string') {
    try {
      const bodyData = JSON.parse(config.body);
      const sanitizedData = sanitizeInput(bodyData);
      config.body = JSON.stringify(sanitizedData);
    } catch {
      // If not JSON, sanitize as string
      config.body = sanitizeInput(config.body);
    }
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API error for ${url}:`, error);
    handleApiError(error);
  }
};

// Subscription API functions
export const subscriptionApi = {
  create: async (subscriptionData: any) => {
    return await apiFetch('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
  },

  getAll: async (params?: { page?: number; limit?: number; plan?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.plan) queryParams.append('plan', params.plan);
    if (params?.status) queryParams.append('status', params.status);
    
    const endpoint = queryParams.toString() ? `/subscriptions?${queryParams}` : '/subscriptions';
    return await apiFetch(endpoint);
  },

  getById: async (id: string) => {
    return await apiFetch(`/subscriptions/${id}`);
  },

  updateStatus: async (id: string, status: string) => {
    return await apiFetch(`/subscriptions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  pause: async (id: string, startDate: string, endDate: string, reason?: string) => {
    return await apiFetch(`/subscriptions/${id}/pause`, {
      method: 'PATCH',
      body: JSON.stringify({ startDate, endDate, reason }),
    });
  },

  cancel: async (id: string, reason?: string) => {
    return await apiFetch(`/subscriptions/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },

  reactivate: async (id: string) => {
    return await apiFetch(`/subscriptions/${id}/reactivate`, {
      method: 'PATCH',
    });
  },

  getUserSubscriptions: async () => {
    return await apiFetch('/subscriptions');
  },

  getStats: async () => {
    return await apiFetch('/subscriptions/stats/overview');
  }
};

// Admin API functions
export const adminApi = {
  getAnalyticsOverview: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const endpoint = params.toString() ? `/admin/analytics/overview?${params}` : '/admin/analytics/overview';
    return await apiFetch(endpoint);
  },

  getRevenueAnalytics: async (startDate?: string, endDate?: string, groupBy?: 'day' | 'week' | 'month') => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (groupBy) params.append('groupBy', groupBy);
    
    const endpoint = params.toString() ? `/admin/analytics/revenue?${params}` : '/admin/analytics/revenue';
    return await apiFetch(endpoint);
  },

  getSubscriptionAnalytics: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const endpoint = params.toString() ? `/admin/analytics/subscriptions?${params}` : '/admin/analytics/subscriptions';
    return await apiFetch(endpoint);
  },

  getUsers: async (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    role?: string 
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    
    const endpoint = queryParams.toString() ? `/admin/users?${queryParams}` : '/admin/users';
    return await apiFetch(endpoint);
  }
};

// Meal Plans API functions
export const mealPlansApi = {
  getAll: async (params?: { 
    planType?: string; 
    minPrice?: number; 
    maxPrice?: number; 
    active?: boolean 
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.planType) queryParams.append('planType', params.planType);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    
    const endpoint = queryParams.toString() ? `/meal-plans?${queryParams}` : '/meal-plans';
    return await apiFetch(endpoint);
  },

  getById: async (id: string) => {
    return await apiFetch(`/meal-plans/${id}`);
  },

  getByType: async (planType: string) => {
    return await apiFetch(`/meal-plans/type/${planType}`);
  },

  create: async (mealPlanData: any) => {
    return await apiFetch('/meal-plans', {
      method: 'POST',
      body: JSON.stringify(mealPlanData),
    });
  }
};

// Testimonials API functions
export const testimonialsApi = {
  getApproved: async (params?: { 
    limit?: number; 
    rating?: number; 
    plan?: string 
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.rating) queryParams.append('rating', params.rating.toString());
    if (params?.plan) queryParams.append('plan', params.plan);
    
    const endpoint = queryParams.toString() ? `/testimonials/approved?${queryParams}` : '/testimonials/approved';
    return await apiFetch(endpoint);
  },

  create: async (testimonialData: any) => {
    return await apiFetch('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    });
  },

  getAll: async (params?: { 
    page?: number; 
    limit?: number; 
    approved?: boolean;
    rating?: number;
    plan?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.approved !== undefined) queryParams.append('approved', params.approved.toString());
    if (params?.rating) queryParams.append('rating', params.rating.toString());
    if (params?.plan) queryParams.append('plan', params.plan);
    
    const endpoint = queryParams.toString() ? `/testimonials?${queryParams}` : '/testimonials';
    return await apiFetch(endpoint);
  },

  approve: async (id: string) => {
    return await apiFetch(`/testimonials/${id}/approve`, {
      method: 'PATCH',
    });
  },

  reject: async (id: string) => {
    return await apiFetch(`/testimonials/${id}/reject`, {
      method: 'PATCH',
    });
  },

  getStats: async () => {
    return await apiFetch('/testimonials/stats/overview');
  }
};

// Health check
export const healthCheck = async () => {
  return await apiFetch('/health', { method: 'GET' });
};

export default {
  subscriptionApi,
  mealPlansApi,
  testimonialsApi,
  healthCheck
};
