import { defineStore } from 'pinia';
import apiClient from '@/services/axios'; // Ensure the API client is imported
import router from '@/router';
const useProductStore = defineStore('product', {
  state: () => ({
    items: [],
    lastPage: null,
    pagination: 1,
    search: '',
  }),
  
  actions: {
    async fetchData() {
      let url = '';
      if (this.search === '') {
        url = `/products/?page=${this.pagination}`;
      } else {
        url = `/products/?page=${this.pagination}&search=${this.search}`;
      }
      try {
        const response = await apiClient.get(url);
        this.items = response.data.data;
        this.lastPage = response.data.pagination.lastPage;
      } catch (error) {
        const statusCode = error.response.status
        if(statusCode == 401 ){
          localStorage.clear()
          
          setTimeout(() => {
            window.location.reload();
            
          }, 1000);
          router.push('/');   
          
        }

        
      }
    },

    async updateProduct(editedItem) {
      const formData = new FormData();
      formData.append('name', editedItem.name);
      formData.append('description', editedItem.description);
      formData.append('quantity', editedItem.quantity);
      formData.append('price', editedItem.price);
      formData.append('category_id', editedItem.category_id === 'men' ? '1' : '2');

      try {
        const response = await apiClient.post(`/products/${editedItem.id}/update-product`, formData);
        console.log('Update Response:', response.data);
        await this.fetchData(); // Refresh the list after updating
      } catch (error) {
        console.error(error.status );
      }
    },

    async deleteItem(item) {
      try {
        await apiClient.post(`/products/${item.id}/delete-product`);
        await this.fetchData(); // Refresh the list after deleting
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    },

    // You can add more actions like pagination, search, etc. here
    setPagination(page) {
      this.pagination = page;
    },

    setSearch(query) {
      this.search = query;
    },
  },

  getters: {
    filteredItems: (state) => (selectedFilter) => {
      let filtered = state.items;
      if (selectedFilter !== 'All') {
        filtered = filtered.filter(item => item.category_id === (selectedFilter === 'Women' ? 1 : 2));
      }
      return filtered;
    },
  },
});

export default useProductStore;
