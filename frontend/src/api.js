import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // IMPORTANT: Allows cookies to be sent/received
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
    (config) => {
        // We expect the access token to be in memory (AuthContext)
        // But since `api.js` is outside React, we might rely on the token being passed 
        // OR we can still use localStorage for persistence.
        // However, strictly safely, we should use a variable. 
        // To make this work seamlessly with existing code, let's read from localStorage 
        const user = localStorage.getItem('user');
        if (user) {
            const { token } = JSON.parse(user);
            console.log('Attaching Auth Token:', token); // Debug: Proof of Token Usage
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is 401 and we haven't retried yet
        // AND ensure the failed request was NOT the refresh endpoint itself to avoid infinite loops
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
            originalRequest._retry = true;

            try {
                console.log('Attempting to refresh token...');
                // We use a new axios instance to avoid reusing the interceptors for the refresh call
                // preventing any weird recursion
                const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });

                console.log('Token refreshed success!');

                // Update the localStorage with new token
                // Note: In a pure memory implementation we would update context, 
                // but here we sync storage to keep it compatible with existing 'user' object structure
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    user.token = data.token;
                    localStorage.setItem('user', JSON.stringify(user));
                }

                // Update the header for the *retry* request
                originalRequest.headers.Authorization = `Bearer ${data.token}`;

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                // Logout if refresh fails
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const getTasks = (params) => api.get('/tasks', { params });
export const createTask = (task) => api.post('/tasks', task);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;
