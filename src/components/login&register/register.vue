<template>
  <v-container>
    <v-card-title style="text-align: center; color: blue; font-size: 25px;">
      <span class="headline">Register</span>
    </v-card-title>
    <v-form ref="form" v-model="formdata.valid" lazy-validation>
      <v-text-field
        v-model="formdata.name"
        :rules="nameRules"
        label="Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="formdata.email"
        :rules="emailRules"
        label="Email"
        required
      ></v-text-field>

      <v-text-field
        v-model="formdata.password"
        :rules="passwordRules"
        label="Password"
        type="password"
        required
      ></v-text-field>

      <v-text-field
        v-model="formdata.password_confirmation"
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
import {ref} from 'vue'
import { useUserStore } from '@/stores/userstoe'; 
export default {
  name: 'reGister',
  setup() {
    const formdata = ref({
      valid: false, // Move this inside formdata
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
    
    const userStore = useUserStore();
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
      v => (v && v.length >= 9) || 'Password must be at least 10 characters',
    ];

    const confirmPasswordRules = [
      v => !!v || 'Password confirmation is required',
      v => v === formdata.value.password || 'Passwords must match',
    ];

    const submitForm = async () => {
      // Validate form
      if (formdata.value.name && formdata.value.email && formdata.value.password && formdata.value.password_confirmation) {
        const { name, email, password, password_confirmation } = formdata.value; // Extract only necessary fields
        userStore.register(name, email, password, password_confirmation )
      } else {
        console.log('Form is invalid, please fill out all required fields.');
      }
    };

    return {
      formdata,
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
