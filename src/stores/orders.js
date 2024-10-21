import { defineStore } from 'pinia';
import apiClient from '@/services/axios';
import router from '@/router';
export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    pagination: 1,
    lastPage: null,
    selectedOrder: null,
    selectedStatus: 'All', // Added selectedStatus to manage filter
  }),

  actions: {
    async fetchOrders() {
      let url = `/orders/?page=${this.pagination}`;
      
      try {
        const response = await apiClient.get(url);
        this.orders = response.data.data;
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

    async updateOrderStatus(orderId, action) {
      try {
        if (action === 'accept') {
          await apiClient.post(`/orders/${orderId}/update-order`);
        } else if (action === 'cancel') {
          await apiClient.post(`/orders/${orderId}/delete`);
        }
        await this.fetchOrders(); // Refresh after updating the order
      } catch (error) {
        console.error('Error updating order:', error);
      }
    },

    setPagination(page) {
      if (page === 1 && this.pagination < this.lastPage) {
        this.pagination++;
      } else if (page === 2 && this.pagination > 1) {
        this.pagination--;
      }
      this.fetchOrders(); // Fetch orders after changing the pagination
    },

    selectOrder(order) {
      this.selectedOrder = order;
    },

    setStatusFilter(status) {
      this.selectedStatus = status; // Update selected status filter
    }
  },

  getters: {
    filteredOrders: (state) => {
      if (state.selectedStatus === 'All') {
        return state.orders;
      }
      return state.orders.filter(order => order.status === state.selectedStatus);
    },
  },
});
