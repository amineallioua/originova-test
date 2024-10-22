import axios from 'axios';
import { useUserStore } from '@/stores/userstoe'; // Import your user store for token management

// Set the base URL globally
axios.defaults.baseURL = 'http://192.168.1.5:8000/api/admin';

// Set the default content type for all requests
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add a request interceptor globally
axios.interceptors.request.use(
    (config) => {
        const userStore = useUserStore(); // Access the user store
        const token = userStore.user?.token; // Get the token from the store, if available
        // Attach token if the request requires authentication
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);



export default axios;
