<template>
  <v-container>
    <v-form ref="form" @submit.prevent="submitForm">
      <!-- Product Name Field -->
      <v-text-field
        v-model="name"
        label="Product Name"
        outlined
        required
      ></v-text-field>

      <!-- Description Field -->
      <v-text-field
        v-model="description"
        label="Description"
        outlined
        required
      ></v-text-field>

      <!-- Quantity Field -->
      <v-text-field
        v-model="quantity"
        label="Quantity"
        type="number"
        outlined
        required
      ></v-text-field>

      <!-- Price Field -->
      <v-text-field
        v-model="price"
        label="Price"
        type="number"
        outlined
        required
        prefix="DZD"
      ></v-text-field>

      <!-- Category Selection -->
      <v-select
        v-model="category"
        :items="categoryOptions"
        label="Category"
        outlined
        required
      ></v-select>

      <!-- File Upload Field -->
      <v-file-input
        v-model="file"
        label="Upload Images"
        multiple
        show-size
        outlined
        accept="image/*"
        required
      ></v-file-input>

      <!-- Submit Button -->
      <v-btn color="primary" type="submit" class="mt-3">Create Product</v-btn>
    </v-form>

    <!-- Dialog for Confirmation -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Product Created</v-card-title>
        <v-card-text>
          Your product has been created successfully!
        </v-card-text>
        <v-card-actions>
          <v-btn color="green darken-1" text to='/home' >Go to Home</v-btn>
          <v-btn color="grey" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userstoe';


export default {
  name: 'addProduct',
  setup() {
    const userstore = useUserStore();
 

    const name = ref('');
    const description = ref('');
    const quantity = ref(null);
    const price = ref(null);
    const category = ref(null); // New category ref
    const file = ref([]);
    const dialog = ref(false); // For dialog visibility
    const categoryOptions = ref(['Men', 'Women']);

    const submitForm = async () => {
      try {
        const categoryId = category.value === 'Men' ? '1' : '2'; // Assign category ID based on selection

        const formData = new FormData(); // Use FormData for file uploads
        formData.append('name', name.value);
        formData.append('description', description.value);
        formData.append('quantity', quantity.value);
        formData.append('price', price.value);
        formData.append('category_id', categoryId); // Add category ID here

        // Append files to formData
        file.value.forEach((f) => {
          formData.append('file[]', f); // Assuming the backend expects file array
        });
       console.log(formData)
        const response = await axios.post(
          'http://192.168.1.5:8000/api/admin/create-product',
          formData,
          {
            headers: {
              Authorization: `Bearer ${userstore.user.token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        // Log the response or handle it as necessary
        console.log("hjhjkhj" , response.data);

        
        dialog.value = true; // Show the dialog after successful creation
      } catch (error) {
        console.error(error);
      }
    };

   

    return {
      name,
      description,
      quantity,
      price,
      category,
      file,
      categoryOptions,
      submitForm,
      dialog,

    };
  },
};
</script>

<style scoped>
/* Add any necessary styles here */
</style>
