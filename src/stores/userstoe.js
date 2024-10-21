// stores/userStore.js
import { defineStore } from 'pinia';
import apiClient from '@/services/axios'; // Import your API client
import router from '@/router';
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null, // Initially, the user object is null
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await apiClient.post('/login', { email, password });
        const user = response.data.user; // Assume user data is returned in this format
        this.setUser(user);
        return user; // Return user data if needed
      } catch (error) {
        const statusCode = error.response.status
        if(statusCode == 401 ){
          alert('this account does not exist \n maybe your password or email is inccorect')
        } 
       console.log(error.status) 
      }
    },
    setUser(userData) {
      this.user = userData; 
    },
    clearUser() {
      this.user = null; 
    },
    async register(name, email, password, password_confirmation ){
        try {
          const response = await apiClient.post('/register', {
            name,
            email,
            password,
            password_confirmation 
          });
          const result = response.data;
          console.log('Registration successful:', result);
        } catch (error) {
          console.log('Error during registration:', error);
        }
    },
    async forget(email){
      try{
        const response = await apiClient.post('/forgot-password',{email})
        const result = response.data
        console.log(result)
        



      }catch(error){
        console.log(error)
      }

    },
    async reset(payload){
      try {
        const response = await apiClient.post('/password-reset', payload);
        const result = response.data;
        console.log(result);

        // Show dialog and redirect after 5 seconds
        // Show the dialog
        setTimeout(() => {
       
          router.push('/'); // Redirect to home
        }, 2000);
      } catch (error) {
        console.log(error.response.data); // Log error response for better debugging
      }
    }
    





  },
  getters: {
    isLoggedIn: (state) => !!state.user, 
    userName: (state) => state.user ? state.user.name : '', 
  },
  persist: true,
});
