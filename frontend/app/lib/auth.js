// // lib/auth.js
// const TOKEN_KEY = 'access_token';
// const USER_KEY = 'user_data';

// // Token management
// export const setToken = (token) => {
//   if (typeof window !== 'undefined') {
//     localStorage.setItem(TOKEN_KEY, token);
//   }
// };

// export const getToken = () => {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem(TOKEN_KEY);
//   }
//   return null;
// };

// export const removeToken = () => {
//   if (typeof window !== 'undefined') {
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem(USER_KEY);
//   }
// };

// // User data management
// export const setUser = (user) => {
//   if (typeof window !== 'undefined') {
//     localStorage.setItem(USER_KEY, JSON.stringify(user));
//   }
// };

// export const getUser = () => {
//   if (typeof window !== 'undefined') {
//     const user = localStorage.getItem(USER_KEY);
//     return user ? JSON.parse(user) : null;
//   }
//   return null;
// };

// // Check if user is authenticated
// export const isAuthenticated = () => {
//   return !!getToken();
// };

// // Logout function
// export const logout = () => {
//   removeToken();
//   window.location.href = '/login';
// };


export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('access_token', token);
    }
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getToken = () => {
  try {
    return localStorage.getItem('access_token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const setUser = (user) => {
  try {
    if (user) {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getUser = () => {
  try {
    const user = localStorage.getItem('user_data');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  removeToken();
  window.location.href = '/login';
};