<template>
    <v-container>
      <!-- Search bar -->
      <v-text-field
        v-model="search"
        label="Search orders"
        prepend-icon="mdi-magnify"
        outlined
        clearable
      ></v-text-field>
  
      <!-- Filter options -->
      <v-select
        v-model="selectedStatus"
        :items="statusOptions"
        label="Filter by Status"
        prepend-icon="mdi-filter"
        outlined
        clearable
      ></v-select>
  
      <!-- Orders Table -->
      <v-data-table
        :headers="headers"
        :items="filteredOrders"
        :search="search"
        item-value="id"
        class="elevation-1"
      >
        <!-- Status chip -->
        <template #[`item.status`]="{ item }">
          <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
        </template>
  
        <!-- Actions for each item -->
        <template #[`item.actions`]="{ item }">
          <v-btn v-if="item.status === 'pending'" color="green" @click="openConfirmDialog(item, 'accept')">Accept</v-btn>
          <v-btn v-if="item.status === 'pending'" color="red" @click="openConfirmDialog(item, 'cancel')">Cancel</v-btn>
        </template>
      </v-data-table>
  
      <!-- Confirmation Dialog -->
      <v-dialog v-model="confirmDialog" max-width="400px">
        <v-card>
          <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
          <v-card-text>{{ dialogText }}</v-card-text>
          <v-card-actions>
            <v-btn color="green darken-1" text @click="confirmAction">Confirm</v-btn>
            <v-btn color="grey" text @click="closeConfirmDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import { ref, computed,onMounted } from 'vue';
  import axios from 'axios';
  import { useUserStore } from '@/stores/userstoe';
  
  export default {
    name: 'OrdersTable',
    setup() {
      const search = ref('');
      const selectedStatus = ref(null);
      const confirmDialog = ref(false);
      const actionType = ref('');
      const selectedOrder = ref(null);
      const userStore = useUserStore();
      const dialogTitle = ref('');
      const dialogText = ref('');
  

      const orders = ref([]);
  
      // Table headers
      const headers = ref([
        { text: 'Order ID', value: 'id' , title:'id'},
        { text: 'Customer', value: 'customer' , title:'name'},
        { text: 'Product', value: 'product' , title:'product'},
        { text: 'Price (DZD)', value: 'price' , title:'price'},
        { text: 'Status', value: 'status' , title:'status'},
        { text: 'Actions', value: 'actions', sortable: false , title:'actions' },
      ]);
  
      // Filter options for status
      const statusOptions = ref(['Pending', 'Accepted', 'Canceled']);
  
      // Function to get chip color based on order status
      const getStatusColor = (status) => {
        switch (status) {
          case 'Pending':
            return 'orange';
          case 'accepted':
            return 'green';
          default:
            return 'grey';
        }
      };
  
      // Computed property to filter orders by status
      const filteredOrders = computed(() => {
        if (!selectedStatus.value) {
          return orders.value;
        }
        return orders.value.filter((order) => order.status === selectedStatus.value);
      });
      
      const fetchData= async()=>{
        try{
            const response = await axios.get('http://192.168.1.5:8000/api/admin/orders' , {
                headers: {
            Authorization: `Bearer ${userStore.user.token}`,
            'Content-Type': 'application/json',
          }
            } )

            const result = await response.data.data
            orders.value=result
            console.log(result)
        }
        catch(error){
            console.log(error)
        }


      }
      onMounted(() => {

      fetchData();
    });

  
      // Open confirmation dialog for accept/cancel action
      const openConfirmDialog = (order, action) => {
        selectedOrder.value = order;
        actionType.value = action;
        if (action === 'accept') {
          dialogTitle.value = 'Accept Order';
          dialogText.value = `Are you sure you want to accept order #${order.id}?`;
        } else if (action === 'cancel') {
          dialogTitle.value = 'Cancel Order';
          dialogText.value = `Are you sure you want to cancel order #${order.id}?`;
        }
        confirmDialog.value = true;
      };
  
      // Close the dialog
      const closeConfirmDialog = () => {
        confirmDialog.value = false;
        selectedOrder.value = null;
        actionType.value = '';
      };
  
      // Confirm the action (accept/cancel)
      const confirmAction = async () => {
  if (selectedOrder.value && actionType.value) {
    const orderId = selectedOrder.value.id; // Get the order ID

    try {
      if (actionType.value === 'accept') {
        // API request to accept the order
        await axios.post(`http://192.168.1.5:8000/api/admin/orders/${orderId}/update-order`, {}, {
          headers: {
            Authorization: `Bearer ${userStore.user.token}`,
            'Content-Type': 'application/json',
          }
        });
        selectedOrder.value.status = 'Accepted'; // Update the local status
      } else if (actionType.value === 'cancel') {
        // API request to cancel the order
        await axios.post(`http://192.168.1.5:8000/api/admin/orders/${orderId}/delete`, {}, {
          headers: {
            Authorization: `Bearer ${userStore.user.token}`,
            'Content-Type': 'application/json',
          }
        });
        
      }
      
      // Close the dialog after action
      closeConfirmDialog(); 
      fetchData()

    } catch (error) {
      console.error('Error updating order status:', error);
      // Handle any errors here (e.g., show a notification)
    }
  }
};

  
      return {
        search,
        selectedStatus,
        orders,
        headers,
        statusOptions,
        filteredOrders,
        getStatusColor,
        openConfirmDialog,
        confirmDialog,
        dialogTitle,
        dialogText,
        confirmAction,
        closeConfirmDialog,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add any necessary styles here */
  </style>
  