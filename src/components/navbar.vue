<template>
  <v-app-bar app class="w-100" style="position: fixed;">
    <v-toolbar-title>My Application</v-toolbar-title>
    <v-spacer></v-spacer>

    <!-- Conditional rendering based on user's authentication status -->
    <template v-if="!isLoggedIn">
      <v-btn color="primary" class="mr-2" @click="goToLogin">Login</v-btn>
      <v-btn color="secondary" @click="goToRegister">Create Account</v-btn>
    </template>

    <template v-else>
      <span>{{ userName }}</span>
      <v-btn color="secondary" @click="logout">Logout</v-btn>
    </template>
  </v-app-bar>
</template>

<script>
import { useUserStore } from '../stores/userstoe'; // Adjust the path as necessary
import { computed } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter for navigation

export default {
  name: 'navBar',
  setup() {
    const userStore = useUserStore();
    const router = useRouter();

    const isLoggedIn = computed(() => userStore.isLoggedIn);
    const userName = computed(() => userStore.userName);

    const goToLogin = () => {
      router.push('/'); // Adjust this path to your login route
    };

    const goToRegister = () => {
      router.push('/register'); // Adjust this path to your register route
    };

    const logout = () => {
      userStore.clearUser();
      router.push('/'); // Redirect to the login page or home page
    };

    return {
      isLoggedIn,
      userName,
      goToLogin,
      goToRegister,
      logout,
    };
  },
};
</script>

<style scoped>
.v-app-bar {
  max-width: 100%;
  margin: auto;
}
</style>
