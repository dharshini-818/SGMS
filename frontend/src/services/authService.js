import { apiRequest } from './api';

export const authService = {
  async login(username, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data?.token) {
      localStorage.setItem('sgms_token', data.token);
      localStorage.setItem('sgms_user', JSON.stringify(data));
    }
    return data;
  },

  logout() {
    localStorage.removeItem('sgms_token');
    localStorage.removeItem('sgms_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('sgms_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('sgms_token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

