<template>
  <v-container>
    <!-- Filter options -->
    <v-select
      v-model="selectedStatus"
      :items="statusOptions"
      label="Filter by Status"
      variant="outlined"
      hide-details
      single-line
      @change="updateStatusFilter"
    ></v-select>

    <!-- Orders Table -->
    <v-data-table
      :headers="headers"
      :items="filteredOrders" 
      item-value="id"
      class="elevation-1"
    >
      <!-- Status chip -->
      <template #[`item.actions`]="{ item }">
        <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
        <v-btn @click="openDetailDialog(item)"> 
          <v-icon>mdi-information</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Details Dialog -->
    <v-dialog v-model="detailDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Order #{{ selectedOrder?.id }}</v-card-title>
        <v-card-text>
          name: {{ selectedOrder?.user.name }} <br>
          email: {{ selectedOrder?.user.email }} <br>
          Status: <v-chip :color="getStatusColor(selectedOrder?.status)" dark>{{ selectedOrder?.status }}</v-chip>
          <br />
          <table  class="custom-table">
            <tr><th>product</th> <th>quantity</th><th>price</th> </tr>
            <tr
            v-for="product in selectedOrder?.products" :key="product.name"
            ><td>{{ product.name }}  </td> <td>{{product.quantity}} </td>  <td>{{ product.price }}</td>  </tr>
          </table>
          
          <br />
          Price: {{ selectedOrder?.price }}
        </v-card-text>
        <v-card-actions v-if="selectedOrder?.status === 'pending'">
          <v-btn color="green" @click="openConfirmDialog(selectedOrder, 'accept')">Accept</v-btn>
          <v-btn color="red" @click="openConfirmDialog(selectedOrder, 'cancel')">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

    <!-- Pagination Controls -->
    <button
      style="height: 40px; width: 40px; border-radius: 50%; margin-right: 10px; background-color: #e6fbff;"
      @click="setPagination(2)"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </button>
    <span>current page {{ pagination }} / {{ lastPage }}</span>
    <button
      style="height: 40px; width: 40px; border-radius: 50%; background-color: #e6fbff;"
      @click="setPagination(1)"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </button>
  </v-container>
</template>

<script>
import { useOrderStore } from '@/stores/orders';
import { ref, computed, watch, onMounted } from 'vue';

export default {
  name: 'OrDers',
  setup() {
    const orderStore = useOrderStore();

    const headers = ref([
      { text: 'Order ID', value: 'id' },
      { text: 'Customer', value: 'customer' },
      { text: 'Product', value: 'product' },
      { text: 'Price (DZD)', value: 'price' },
      { text: 'Status', value: 'status' },
      { text: 'Actions', value: 'actions', sortable: false },
    ]);

    const confirmDialog = ref(false);
    const detailDialog = ref(false);
    const dialogTitle = ref('');
    const dialogText = ref('');
    const statusOptions = ref(['All', 'pending', 'accepted']);
    const selectedStatus = computed({
      get: () => orderStore.selectedStatus,
      set: (value) => orderStore.setStatusFilter(value), // Update the status filter in the store
    });

    const openDetailDialog = (order) => {
      orderStore.selectOrder(order);
      console.log(order)
      detailDialog.value = true;
    };

    const closeDetailDialog = () => {
      detailDialog.value = false;
    };

    const openConfirmDialog = (order, action) => {
      orderStore.selectOrder(order);
      dialogTitle.value = action === 'accept' ? 'Accept Order' : 'Cancel Order';
      dialogText.value = `Are you sure you want to ${action} order #${order.id}?`;
      confirmDialog.value = true;
    };

    const confirmAction = async () => {
      const action = dialogTitle.value.includes('Accept') ? 'accept' : 'cancel';
      await orderStore.updateOrderStatus(orderStore.selectedOrder.id, action);
      closeDetailDialog();
      confirmDialog.value = false;
    };

    const closeConfirmDialog = () => {
      confirmDialog.value = false;
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'pending':
          return 'orange';
        case 'accepted':
          return 'green';
        default:
          return 'grey';
      }
    };

    watch(() => orderStore.pagination, () => {
      orderStore.fetchOrders();
    });

    onMounted(() => {
      orderStore.fetchOrders();
    });

    return {
      headers,
      detailDialog,
      confirmDialog,
      dialogTitle,
      dialogText,
      openDetailDialog,
      closeDetailDialog,
      openConfirmDialog,
      confirmAction,
      closeConfirmDialog,
      getStatusColor,
      pagination: computed(() => orderStore.pagination),
      lastPage: computed(() => orderStore.lastPage),
      filteredOrders: computed(() => orderStore.filteredOrders),
      selectedOrder: computed(() => orderStore.selectedOrder),
      setPagination: orderStore.setPagination,
      statusOptions,
      selectedStatus,
    };
  },
};
</script>
<style scoped>
.custom-table {
  width: 100%;
  border-spacing: 15px; /* Adds space between table cells */
  background-color: #f0f0f0; /* Table background color */
  border-collapse: separate;
  border-radius:10px;
  height: 100px;
  overflow: scroll;
}

.custom-table th, .custom-table td {
  padding: 10px;
  background-color: #87CEEB; /* Background color for cells */
  border-radius:10px;
  text-align: center;
  font-size: 16px;
  color: #fff; /* Text color */
}

.custom-table th {
  font-weight: bold;
  background-color: #4682B4; /* Different color for header */
}
</style>