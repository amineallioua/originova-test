<template>
    <v-container>
      <h1>Password Reset {{ emailL }}</h1>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="New Password"
          type="password"
          required
        ></v-text-field>
  
        <v-text-field
          v-model="passwordConfirmation"
          :rules="confirmPasswordRules"
          label="Confirm Password"
          type="password"
          required
        ></v-text-field>
  
        <v-btn color="success" @click="submitForm">Reset Password</v-btn>
      </v-form>
  
      <!-- Dialog for success message -->
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Success</v-card-title>
          <v-card-text>Your password has been updated.</v-card-text>
          <v-card-actions>
            <v-btn color="green darken-1" text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import apiClient from '@/services/axios';
  
  export default {
    name: 'PasswordReset',
    setup() {
      const route = useRoute();
      const router = useRouter(); // Access the router
      const valid = ref(false);
      const emailL = ref(''); // Holds the email value
      const password = ref('');
      const passwordConfirmation = ref('');
      const resetToken = ref('');
      const dialog = ref(false); // Control dialog visibility
  
      const passwordRules = [
        v => !!v || 'Password is required',
        v => v.length >= 10 || 'Password must be at least 10 characters',
      ];
  
      const confirmPasswordRules = [
        v => !!v || 'Password confirmation is required',
        v => v === password.value || 'Passwords must match',
      ];
  
      onMounted(() => {
        // Extract token from path
        const tokenPath = route.path.split('/')[2]; // Assuming the path is /password-reset/token=<token>
        resetToken.value = tokenPath.split('=')[1]; // Get the token part after '='
  
        // Get email from query parameters
        emailL.value = route.query.email; // Access email from query parameters
      });
  
      const submitForm = async () => {
        if (valid.value) {
          const payload = {
            token: resetToken.value,
            email: emailL.value, // Use emailL instead of email
            password: password.value,
            password_confirmation: passwordConfirmation.value,
          };
  
          try {
            const response = await apiClient.post('/password-reset', payload);
            const result = response.data;
            console.log(result);
  
            // Show dialog and redirect after 5 seconds
            dialog.value = true; // Show the dialog
            setTimeout(() => {
              dialog.value = false; // Close the dialog
              router.push('/'); // Redirect to home
            }, 2000);
          } catch (error) {
            console.log(error.response.data); // Log error response for better debugging
          }
        }
      };
  
      return {
        valid,
        emailL, // Return emailL for template binding
        password,
        passwordConfirmation,
        resetToken,
        passwordRules,
        confirmPasswordRules,
        submitForm,
        dialog, // Return dialog for template binding
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add any necessary styles here */
  </style>
  