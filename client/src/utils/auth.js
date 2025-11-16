// client/src/utils/auth.js
export const getAuthToken = () => localStorage.getItem('authToken');
export const getUserRole = () => localStorage.getItem('userRole');
export const getUserId = () => localStorage.getItem('userId');
export const getUsername = () => localStorage.getItem('username');

export const saveAuthData = (token, role, userId, username) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
};

export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
};