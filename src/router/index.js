import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/product/indexs.vue'; // Adjust the path according to your project structure
import Login from '../components/login&register/login.vue'; // Fixed quote and naming convention
import Register from '../components/login&register/register.vue';
import forGet from '../components/login&register/forget.vue';
import addProduct from '../components/product/addProduct.vue'; 
import orDer from'../components/oreder/index.vue';
import usersPage from '../components/users/index.vue';
import reSet from '../components/login&register/reset.vue';

const routes = [
  { path: '/home', component: HomePage },
  { path: '/', component: Login }, // Updated component name
  { path: '/register', component: Register }, // Updated component name
  { path: '/forget', component: forGet }, 
  { path:'/addProduct', component:addProduct  },
  {path:'/order' ,  component:orDer  },
  {path:'/users' , component:usersPage },
  {path:'/password-reset/:token' , component:reSet },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
