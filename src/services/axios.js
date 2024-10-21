import axios from 'axios';
import { useUserStore } from '@/stores/userstoe'; // Assuming you're using Pinia for state management

const apiClient = axios.create({
    baseURL: 'http://192.168.1.5:8000/api/admin',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const userStore = useUserStore(); // Access the user store
        const token = userStore.user?.token; // Get the token from the store, if available

        // Define URLs or conditions where the token should NOT be included
        const noAuthRequiredRoutes = ['/password-reset', '/register' , '/login', 'forgot-password' ];

        // Check if the request URL matches any route that doesn't need a token
        if (!noAuthRequiredRoutes.includes(config.url) && token) {
            config.headers.Authorization = `Bearer ${token}`; // Include token only if required
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
