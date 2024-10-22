<template>
  <div class="container">
    <v-card flat>
      <template v-slot:text>
        <v-text-field
          @input="searchdebounce"
          v-model="store.search"
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
        :items="filteredItems"
        item-value="id"
      >
        <template #[`item.actions`]="{ item }">
          <v-btn @click="editItem(item)">Edit</v-btn>
          <v-btn color="error" @click="openConfirmDelete(item)">Delete</v-btn>
        </template>
        <template  v-slot:bottom >
  <v-pagination
      v-model="pagination"
      :length="store.lastPage"
      :total-visible="3"
   >

   </v-pagination>
  
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
import { ref, computed, watch } from 'vue';
import { debounce } from 'lodash';
import useProductStore from '@/stores/product'; // Import the Pinia store

export default {
  name: 'IndexS',
  setup() {
    const store = useProductStore(); // Register the store
    const selectedFilter = ref('All');
    const filterOptions = ref(['All', 'Men', 'Women']);
    const headers = [
      { text: 'ID', value: 'id' },
      { text: 'Product Name', value: 'name' },
      { text: 'Category ID', value: 'category_id' },
      { text: 'Actions', value: 'actions', sortable: false }
    ];
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
    const pagination = ref(1)
    // Computed property for filtered items
    const filteredItems = computed(() => store.filteredItems(selectedFilter.value));

    // Function to debounce search
    const searchdebounce = debounce(() => store.fetchData(), 1000);

    // Pagination control


    // Fetch initial data
    store.fetchData();

    const editItem = (item) => {
      editedItem.value = { ...item };
      editDialog.value = true;
    };

    const updateProduct = async () => {
      await store.updateProduct(editedItem.value);
      editDialog.value = false; // Close dialog after update
    };

    const openConfirmDelete = (item) => {
      itemToDelete.value = item;
      confirmDeleteDialog.value = true;
    };

    const deleteItem = async (item) => {
      await store.deleteItem(item);
      confirmDeleteDialog.value = false; // Close the dialog after deletion
    };
    watch(() => pagination.value , () => {
      store.setPagination(pagination.value)
      
    });

    return {
      store,
      selectedFilter,
      filterOptions,
      headers,
      confirmDeleteDialog,
      itemToDelete,
      editDialog,
      editedItem,
      filteredItems,
      pagination,
      searchdebounce,
      editItem,
      updateProduct,
      openConfirmDelete,
      deleteItem,
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
  