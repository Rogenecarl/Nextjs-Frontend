import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create an axios instance with custom config
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true // Important for handling cookies/sessions
});

// Function to get CSRF cookie from Laravel
// export const getCsrfToken = () => {
//     return axios.get('http://localhost:8000/sanctum/csrf-cookie', {
//         withCredentials: true
//     });
// };

export default axiosInstance;