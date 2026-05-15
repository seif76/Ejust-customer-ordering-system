// lib/adminAuth.js
const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_DATA_KEY = 'admin_data';

export const setAdminToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    }
  } catch (error) {
    console.error('Error saving admin token:', error);
  }
};

export const getAdminToken = () => {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting admin token:', error);
    return null;
  }
};

export const removeAdminToken = () => {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_DATA_KEY);
  } catch (error) {
    console.error('Error removing admin token:', error);
  }
};

export const setAdminUser = (admin) => {
  try {
    if (admin) {
      localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(admin));
    }
  } catch (error) {
    console.error('Error saving admin data:', error);
  }
};

export const getAdminUser = () => {
  try {
    const admin = localStorage.getItem(ADMIN_DATA_KEY);
    return admin ? JSON.parse(admin) : null;
  } catch (error) {
    console.error('Error getting admin data:', error);
    return null;
  }
};

export const isAdminAuthenticated = () => {
  return !!getAdminToken();
};

export const adminLogout = () => {
  removeAdminToken();
  window.location.href = '/admin/login';
};