// stores/userStore.js
import { defineStore } from 'pinia';
import apiClient from '@/services/axios'; // Import your API client

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
  },
  getters: {
    isLoggedIn: (state) => !!state.user, 
    userName: (state) => state.user ? state.user.name : '', 
  },
  persist: true,
});
