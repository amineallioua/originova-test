<template>
    <center>
    <v-container>
      <v-card class="card">
        <v-card-title style="text-align: center; color: blue; font-size: 25px;">
          <span class="headline">Email Form</span>
        </v-card-title>
        <v-form ref="form" v-model="valid"  lazy-validation>
          <v-text-field
          style=" width: 70%; "
            v-model="email"
            :rules="emailRules"
            label="Email"
            prepend-icon="mdi-email"
            required
          ></v-text-field>
  
          <v-btn @click="submitForm" color="primary">Submit</v-btn>
        </v-form>
      </v-card>
    </v-container>
</center>
  </template>
  
  <script>
  import { ref } from 'vue';
import {useUserStore} from  '@/stores/userstoe'
  
  export default {
    name: 'EmailForm',
    setup() {
      const valid = ref(false);
      const email = ref('');
      const userStore = useUserStore();
  

  
      const emailRules = [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ];
  
      const submitForm = async() => {
        if (valid.value) {
          userStore.forget(email.value)
        }
      };
  
      return {
        valid,
        email,
        emailRules,
        submitForm,
      };
    },
  };
  </script>
  
  <style scoped>
 .card{
    width: 50vw;
    height: 200px;
    justify-content: center;
 }
  </style>
  