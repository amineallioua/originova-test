<template>
    <v-container>
        <v-card-title style=" text-align: center; color: blue; font-size: 25px;  " >
          <span class="headline">register</span>
        </v-card-title>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="name"
          :rules="nameRules"
          label="Name"
          required
        ></v-text-field>
  
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          required
        ></v-text-field>
  
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
          type="password"
          required
        ></v-text-field>
  
        <v-text-field
          v-model="password_confirmation"
          :rules="confirmPasswordRules"
          label="Confirm Password"
          type="password"
          required
        ></v-text-field>
  
        <v-btn @click="submitForm" color="primary">Submit</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  import { ref } from 'vue';
  import axios from 'axios';
  
  export default {
    name:'reGister',
    setup() {
      const valid = ref(false);
       const name=ref('') 
       const email=ref('') 
       const password=ref('') 
       const password_confirmation=ref('') 
      
  
      const nameRules = [
        v => !!v || 'Name is required',
        v => (v && v.length <= 20) || 'Name must be less than 20 characters',
      ];
  
      const emailRules = [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ];
  
      const passwordRules = [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be at least 6 characters',
      ];
  
      const confirmPasswordRules = [
        v => !!v || 'Password confirmation is required',
        v => v === password.value || 'Passwords must match',
      ];
  
      const submitForm = async () => {
        if (valid.value) {
            try{
                const response = await axios.post('http://192.168.1.5:8000/api/admin/register',{
                  name:name.value,
                  email:email.value,
                   password:password.value,
                    password_confirmation:password_confirmation.value 
                } )
                const result=response.data
                console.log(result)
            }
            catch (error) {
          console.log(error);

            }
          
        } 
      };
  
      return {
        valid,
        name,
        password,
        email,
        password_confirmation,
        nameRules,
        emailRules,
        passwordRules,
        confirmPasswordRules,
        submitForm,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add any additional styling here */
  </style>
  