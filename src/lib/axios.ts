import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const BASE_URL = process.env.NEXT_BACKEND_API_URL || 'http://localhost:8000/api';

// Create an axios instance with custom config
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true, // Important for handling cookies/sessions
    withXSRFToken: true // Enable XSRF token handling
});

// // Function to get CSRF cookie from Laravel
// export const getCsrfToken = () => {
//     return axios.get('http://localhost:8000/sanctum/csrf-cookie', {
//         withCredentials: true
//     });
// };

// Function to get CSRF cookie from Laravel
export const getCsrfToken = () => {
    return axios.get('https://project-himsog-laravel-backend.onrender.com/sanctum/csrf-cookie', {
        withCredentials: true
    });
};

// This interceptor adds the token to every request
axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;