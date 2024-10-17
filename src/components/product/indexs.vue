<template>
  <div class="container">
    <v-card flat>
      <template v-slot:text>
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </template>
      <div class="filterContainer">
        <v-select
          class="select"
          v-model="selectedFilter"
          :items="filterOptions"
          label="Filter by Type"
          variant="outlined"
          hide-details
          single-line
        ></v-select>
        <v-btn
          style="background-color: blue; color: white; max-width: 200px; min-width: 30px; position: absolute; right: 15px" 
          to="/addProduct"
        >
          CREATE PRODUCT
        </v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="filtereditems"
        :search="search"
        item-value="id"
      >
        <template #[`item.actions`]="{ item }">
          <v-btn @click="editItem(item)">Edit</v-btn>
          <v-btn color="error" @click="openConfirmDelete(item)">Delete</v-btn>
        </template>
      </v-data-table>

      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="confirmDeleteDialog" max-width="290">
        <v-card>
          <v-card-title class="text-h6">Confirm Delete</v-card-title>
          <v-card-text>
            Are you sure you want to delete this item?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="confirmDeleteDialog = false">Cancel</v-btn>
            <v-btn color="red" text @click="deleteItem(itemToDelete)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Edit Product Dialog -->
      <v-dialog v-model="editDialog" max-width="600">
        <v-card>
          <v-card-title class="text-h6">Edit Product</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="editedItem.name"
              label="Product Name"
              outlined
              required
            ></v-text-field>
            <v-text-field
              v-model="editedItem.description"
              label="Description"
              outlined
              required
            ></v-text-field>
            <v-text-field
              v-model="editedItem.quantity"
              label="Quantity"
              type="number"
              outlined
              required
            ></v-text-field>
            <v-text-field
              v-model="editedItem.price"
              label="Price"
              type="number"
              outlined
              required
              prefix="DZD"
            ></v-text-field>
            <v-select
              v-model="editedItem.category_id"
              :items="filterOptions"
              label="Category"
              outlined
              required
            ></v-select>
        
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="editDialog = false">Cancel</v-btn>
            <v-btn color="primary" text @click="updateProduct">Update</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userstoe';

export default {
  name: 'IndexS',
  setup() {
    const search = ref('');
    const selectedFilter = ref('All');
    const filterOptions = ref(['All', 'Men', 'Women']);
    const userStore = useUserStore();
    const headers = [
      { text: 'ID', value: 'id' },
      { text: 'Product Name', value: 'name' },
      { text: 'Category ID', value: 'category_id' },
      { text: 'Actions', value: 'actions', sortable: false }
    ];

    const items = ref([]);
    const confirmDeleteDialog = ref(false);
    const itemToDelete = ref(null);
    const editDialog = ref(false);
    const editedItem = ref({
      id: null,
      name: '',
      description: '',
      quantity: null,
      price: null,
      category_id: null,

    });

    const filtereditems = computed(() => {
      let filtered = items.value;
      if (search.value) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(search.value.toLowerCase())
        );
      }
      if (selectedFilter.value !== 'All') {
        filtered = filtered.filter(item => item.category_id === (selectedFilter.value === 'women' ? '1' : '2'));
      }
      return filtered;
    });

    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.1.5:8000/api/admin/products', {
          headers: {
            Authorization: `Bearer ${userStore.user.token}`,
            'Content-Type': 'application/json',
          },
        });
        items.value = response.data.data;
      } catch (error) {
        console.error(error);
      }
    };

    const editItem = (item) => {
      editedItem.value = { ...item }; // Copy the item data to editedItem
      editDialog.value = true; // Open the edit dialog
    };

    const handleFileUpload = (event) => {
      editedItem.value.files = Array.from(event.target.files); // Convert FileList to an array
    };

    const updateProduct = async () => {
      const formData = new FormData();
      formData.append('name', editedItem.value.name);
      formData.append('description', editedItem.value.description);
      formData.append('quantity', editedItem.value.quantity);
      formData.append('price', editedItem.value.price);
    if ( editedItem.value.category_id == 'men' ){
      formData.append('category_id', '1');
    }else{
      formData.append('category_id', '2');
    }

   

      console.log('Form Data to Update:', formData); // Log the form data

      try {
        // Send a PUT request instead of POST to update the product
        const response = await axios.post(`http://192.168.1.5:8000/api/admin/products/${editedItem.value.id}/update-product`, formData, {
          headers: {
            Authorization: `Bearer ${userStore.user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Update Response:', response.data); // Log the response for debugging
        editDialog.value = false; // Close the edit dialog
        fetchData(); // Refresh the list
      } catch (error) {
        console.error('Error updating product:', error.response ? error.response.data : error.message);
      }
    };

    const openConfirmDelete = (item) => {
      itemToDelete.value = item;
      confirmDeleteDialog.value = true;
    };

    const deleteItem = async (item) => {
      try {
        await axios.post(`http://192.168.1.5:8000/api/admin/products/${item.id}/delete-product`, {}, {
          headers: {
            Authorization: `Bearer ${userStore.user.token}`,
            'Content-Type': 'application/json',
          },
        });
        confirmDeleteDialog.value = false; // Close the dialog
        fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    };

    fetchData();

    return {
      search,
      selectedFilter,
      filterOptions,
      headers,
      filtereditems,
      confirmDeleteDialog,
      itemToDelete,
      editDialog,
      editedItem,
      fetchData,
      editItem,
      updateProduct,
      openConfirmDelete,
      deleteItem,
      handleFileUpload,
    };
  },
};
</script>

<style scoped>
.container {
  margin-left: 55px;
}

.select {
  width: 38vw;
}

.filterContainer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
}

a {
  text-decoration: none;
  color: white;
}
</style>
