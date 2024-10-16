<template>
    <v-container >
      <v-card>
        <v-card-title style=" text-align: center; color: blue; font-size: 25px;  " >
          <span class="headline">Login</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="Email"
              required
              prepend-icon="mdi-email"
            ></v-text-field>
  
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="Password"
              required
              type="password"
              prepend-icon="mdi-lock"
            ></v-text-field>
          </v-form>
        </v-card-text>
  
        <v-card-actions>
          <v-btn @click="login" color="primary" :disabled="!valid">Login</v-btn>
          <router-link to="/forget" >
          <span style=" position: absolute; right:20px; bottom: 15px; " > forgot password ? </span>
        </router-link>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useUserStore } from '@/stores/userstoe';
  import { useRouter } from 'vue-router'; 

  export default {
    name:'loGin',
    setup() {
      const router = useRouter();
      const email = ref('');
      const password = ref('');
      const valid = ref(false);
      const form = ref(null);
      const userStore = useUserStore();
  
      const emailRules = [
        (v) => !!v || 'Email is required',
        (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
      ];
  
      const passwordRules = [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 6) || 'Password must be at least 6 characters long',
      ];
  
      const login = async() => {
        try{
            if (form.value.validate()) {
            const response = await axios.post('http://192.168.1.5:8000/api/admin/login' ,{
                email:email.value,
                password:password.value
            } )
            const user = response.data.user
            userStore.setUser(user)
            console.log("welcom" , userStore.user )
            router.push('/home')
         
        }
            
        }catch (error){
            console.log(error)

        }
      
      };
  
      return {
        email,
        password,
        valid,
        emailRules,
        passwordRules,
        login,
        form,
      };
    },
  };
  </script>
  
  <style scoped>
  .v-card {
    max-width: 100%;
    margin: auto;
  }
  </style>
  