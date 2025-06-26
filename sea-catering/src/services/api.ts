// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

// Generic fetch function with error handling
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
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

  getStats: async () => {
    return await apiFetch('/subscriptions/stats/overview');
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
