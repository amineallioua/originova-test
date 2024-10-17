<template>
  <div class="sidebar" v-if="isLoggedIn" >
   
    
      <ul class="list" >
        <div class="routContainer" >
          <router-link to="/users" >
      <li><v-icon>mdi-account</v-icon> <p>  users</p></li>
    </router-link>
    </div>
        <div class="routContainer" >
          <router-link to="/home" >
      <li><v-icon>mdi-cart</v-icon> <p>  product</p></li>
    </router-link>
    </div>
    <div class="routContainer" >
          <router-link to="/order" >
      <li><v-icon>mdi-receipt</v-icon> <p>  order</p></li>
    </router-link>
    </div>
    
    </ul>

  </div>
    
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  import { useUserStore } from '../stores/userstoe'; // Adjust the path as necessary
  import { computed } from 'vue';

  export default {
    name: 'SideBar',
    setup() {
      const router = useRouter(); // Access the router instance
      const userStore = useUserStore();
      const isLoggedIn = computed(() => userStore.isLoggedIn);
   
  
      // Method to navigate to a route
      const navigateTo = (link) => {
        router.push(link); // Navigate to the specified link
      };
  
      return {
        isLoggedIn,
        navigateTo, // Expose the method for use in the template
      };
    },
  };
  </script>
  
  <style scoped>
  .sidebar{
    width: 65px;
    height: 100vh;
    overflow:hidden;
    position: fixed;
    z-index: 10;
    transition: 300ms ease-in-out;
    border-right: 1px solid rgb(196, 196, 196);
    background-color: white;
    margin-top: 55px;

    overflow: hidden;
    

  }
  .sidebar:hover{
    width: 260px;
  }
  .list{
  list-style: none;
    text-decoration: none;
    font-size: 20px;
    margin-top: 10px;
  }
  .list li {
    display: flex;
    text-decoration: none;
   
  }
  .list p{
    margin-left:45px ;
  }
  .routContainer{
    border: 1px solid rgb(233, 229, 229);
    padding:10px;
    padding-left: 18px;
    
  }
  a{
    text-decoration: none;
  }
  </style>
  