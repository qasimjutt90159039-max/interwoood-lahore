import axios, { AxiosResponse } from 'axios';
import { handleLocalRequest } from './localBackend.js';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 6000
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('interwood_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    // When Vercel serves index.html for unhandled /api paths
    if (typeof response.data === 'string' && (response.data.includes('<!DOCTYPE') || response.data.includes('<html'))) {
      const localResult = handleLocalRequest(
        response.config.method || 'get',
        response.config.url || '',
        response.config.data ? (typeof response.config.data === 'string' ? JSON.parse(response.config.data) : response.config.data) : undefined
      );
      return {
        ...response,
        status: localResult.status,
        data: localResult.data
      };
    }
    return response;
  },
  async (error) => {
    const config = error.config;
    if (config) {
      try {
        const reqData = config.data
          ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data)
          : undefined;
        const localResult = handleLocalRequest(config.method || 'get', config.url || '', reqData);
        if (localResult.status >= 200 && localResult.status < 300) {
          return {
            data: localResult.data,
            status: localResult.status,
            statusText: 'OK',
            headers: {},
            config
          } as AxiosResponse;
        }
      } catch (fallbackErr) {
        console.warn('Fallback handler error:', fallbackErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
