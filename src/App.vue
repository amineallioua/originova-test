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
import Pusher from 'pusher-js';
Pusher.logToConsole = true;
import eventBus from '@/eventBus';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userstoe'; 
import { useRouter } from 'vue-router';


export default {
  components: {
    SideBar,
    navBar
  },
  setup(){

onMounted(() => {
  
eventBus.on('alert', ()=>{
  const userStore = useUserStore();
 
  const id = userStore.user.id
  const router = useRouter();
    const pusher = new Pusher('1a9e1b88fcbdd25d7a99', {
    cluster: 'eu',});
    const channel = pusher.subscribe('originova-channel');
    console.log( userStore.user)
  channel.bind('user-logout' , (data)=>{
    
    if( data.name ==  id  ){
      localStorage.clear()
      router.push('/');
      window.location.reload();

    
      
    }

    
  } )
});
  
})

},
};

     

</script>

<style>
/* Add any global styles here */
</style>
