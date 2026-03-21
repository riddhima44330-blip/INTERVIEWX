import { useState } from 'react';
import api from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async <T>(fn: () => Promise<{ data: T }>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fn();
      return response.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Request failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    get: <T>(url: string) => request<T>(() => api.get(url)),
    post: <T>(url: string, body?: unknown) => request<T>(() => api.post(url, body)),
    put: <T>(url: string, body?: unknown) => request<T>(() => api.put(url, body)),
  };
};
