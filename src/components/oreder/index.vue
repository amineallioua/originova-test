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
          <v-btn v-if="item.status === 'Pending'" color="green" @click="openConfirmDialog(item, 'accept')">Accept</v-btn>
          <v-btn v-if="item.status === 'Pending'" color="red" @click="openConfirmDialog(item, 'cancel')">Cancel</v-btn>
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
  import { ref, computed } from 'vue';
  
  export default {
    name: 'OrdersTable',
    setup() {
      const search = ref('');
      const selectedStatus = ref(null);
      const confirmDialog = ref(false);
      const actionType = ref('');
      const selectedOrder = ref(null);
      
      const dialogTitle = ref('');
      const dialogText = ref('');
  
      // Mock data for orders
      const orders = ref([
        { id: 1, customer: 'John Doe', product: 'Laptop', price: 1200, status: 'Pending' },
        { id: 2, customer: 'Jane Smith', product: 'Smartphone', price: 800, status: 'Accepted' },
        { id: 3, customer: 'Sam Green', product: 'Tablet', price: 500, status: 'Pending' },
        { id: 4, customer: 'Sara Brown', product: 'Headphones', price: 150, status: 'Canceled' },
        { id: 5, customer: 'Michael White', product: 'Smartwatch', price: 300, status: 'Pending' },
      ]);
  
      // Table headers
      const headers = ref([
        { text: 'Order ID', value: 'id' },
        { text: 'Customer', value: 'customer' },
        { text: 'Product', value: 'product' },
        { text: 'Price (DZD)', value: 'price' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ]);
  
      // Filter options for status
      const statusOptions = ref(['Pending', 'Accepted', 'Canceled']);
  
      // Function to get chip color based on order status
      const getStatusColor = (status) => {
        switch (status) {
          case 'Pending':
            return 'orange';
          case 'Accepted':
            return 'green';
          case 'Canceled':
            return 'red';
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
      const confirmAction = () => {
        if (selectedOrder.value && actionType.value) {
          if (actionType.value === 'accept') {
            selectedOrder.value.status = 'Accepted';
          } else if (actionType.value === 'cancel') {
            selectedOrder.value.status = 'Canceled';
          }
          closeConfirmDialog(); // Close the dialog after action
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
  