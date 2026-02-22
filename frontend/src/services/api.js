import axios from 'axios';

const API_BASE_URL = "https://fixl-hr-system.vercel.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  getStats: () => api.get('/users/stats/overview')
};

export const attendanceAPI = {
  mark: () => api.post('/attendance'),
  getMy: (params) => api.get('/attendance', { params }),
  checkToday: () => api.get('/attendance/today'),
  getAll: (params) => api.get('/attendance/all', { params }),
  getStats: () => api.get('/attendance/stats')
};

export const leavesAPI = {
  apply: (data) => api.post('/leaves', data),
  getMy: () => api.get('/leaves'),
  update: (id, data) => api.put(`/leaves/${id}`, data),
  cancel: (id) => api.delete(`/leaves/${id}`),
  getAll: (params) => api.get('/leaves/all', { params }),
  updateStatus: (id, data) => api.put(`/leaves/${id}/status`, data),
  getStats: () => api.get('/leaves/stats')
};

export default api;
