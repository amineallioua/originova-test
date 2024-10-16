<template>
  <v-app>
  
    <SideBar />
    <navBar/>
  

    <v-main style=" margin-left: 65px; " >
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import SideBar from './components/sidebar.vue'; // Ensure this path is correct
import navBar from './components/navbar.vue'; // Ensure this path is correct

export default {
  components: {
    SideBar,
    navBar
  },
};
</script>

<style>
/* Add any global styles here */
</style>
