import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('intellmeet_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  requestOTP: async (email) => {
    const response = await api.post('/auth/request-otp', { email });
    return response.data;
  },
  verifyOTP: async (email, otp, name) => {
    const response = await api.post('/auth/verify-otp', { email, otp, name });
    if (response.data.token) {
      localStorage.setItem('intellmeet_token', response.data.token);
      localStorage.setItem('intellmeet_user', JSON.stringify(response.data));
    }
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('intellmeet_token', response.data.token);
      localStorage.setItem('intellmeet_user', JSON.stringify(response.data));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('intellmeet_token', response.data.token);
      localStorage.setItem('intellmeet_user', JSON.stringify(response.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('intellmeet_token');
    localStorage.removeItem('intellmeet_user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('intellmeet_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export const meetingService = {
  createMeeting: async (title, scheduledAt = null) => {
    const response = await api.post('/meetings/create', { title, scheduledAt });
    return response.data;
  },
  joinMeeting: async (code) => {
    const response = await api.post(`/meetings/join/${code}`);
    return response.data;
  },
  getUserMeetings: async () => {
    const response = await api.get('/meetings/my-meetings');
    return response.data;
  },
  getMeetingDetails: async (id) => {
    const response = await api.get(`/meetings/${id}`);
    return response.data;
  }
};

export const aiService = {
  getWorkspace: async (meetingId) => {
    const response = await api.get(`/ai/workspace/${meetingId}`);
    return response.data;
  },
  summarizeMeeting: async (meetingId, transcriptText) => {
    const response = await api.post('/ai/summarize', { meetingId, transcriptText });
    return response.data;
  },
  askAI: async (meetingId, question) => {
    const response = await api.post('/ai/ask', { meetingId, question });
    return response.data;
  }
};

export const taskService = {
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

export default api;
