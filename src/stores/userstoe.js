// stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null, // Initially, the user object is null
  }),
  actions: {
    setUser(userData) {
      this.user = userData; // Set the user object
    },
    clearUser() {
      this.user = null; // Clear the user object
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user, // Check if user is logged in
    userName: (state) => state.user ? state.user.name : '', // Get the user's name
  },
  persist: true,
});
