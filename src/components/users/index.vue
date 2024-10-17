<template>
    <v-container>
      <!-- Search bar -->
      <v-text-field
        v-model="search"
        label="Search users"
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
  
      <!-- users Table -->
      <v-data-table
        :headers="headers"
        :items="filteredusers"
        :search="search"
        item-value="id"
        class="elevation-1"
      >
        <!-- Status chip -->
        <template #[`item.status`]="{ item }">
          <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
        </template>
  
        <!-- Actions for each item -->
        <!-- Actions for each item -->
<template #[`item.actions`]="{ item }">
  <v-btn 
    v-if="item.status === 'blocked' && item.role.name !== 'Admin'" 
    color="green" 
    @click="openConfirmDialog(item, 'active')"
  >
    Activate
  </v-btn>
  
  <v-btn 
    v-if="item.status === 'active' && item.role.name !== 'Admin'" 
    color="red" 
    @click="openConfirmDialog(item, 'block')"
  >
    Block
  </v-btn>

  <!-- Optional: Add a message or indication that the admin cannot be modified -->
  <v-chip 
    v-if="item.role.name === 'Admin'" 
    color="grey" 
    dark
  >
    Admin users cannot be modified
  </v-chip>
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
  import { ref, computed, onMounted } from 'vue';
  import { useUserStore } from '@/stores/userstoe'; // Corrected the typo in the import


  import axios from 'axios';
  import Pusher from 'pusher-js';
Pusher.logToConsole = true;
  
  export default {
    name: 'usersPage',
    setup() {
      const search = ref('');
      const selectedStatus = ref(null);
      const confirmDialog = ref(false);
      const actionType = ref('');
      const selectedOrder = ref(null);
      const userStore = useUserStore();
      const dialogTitle = ref('');
      const dialogText = ref('');
      const pusher = new Pusher('1a9e1b88fcbdd25d7a99', {
  cluster: 'eu',
  // Add any other options you need
});
const channel = pusher.subscribe('originova-channel');
      
  
      const users = ref([]);
  
      const headers = ref([
  { text: 'User ID', value: 'id' },
  { text: 'Name', value: 'name' },
  { text: 'Email', value: 'email' },
  { text: 'Role', value: 'role.name' }, // Accessing the nested role name
  { text: 'Status', value: 'status' },
  { text: 'Actions', value: 'actions', sortable: false }, // For buttons like "block" or "activate"
]);

  
      const statusOptions = ref(['active', 'blocked']);
  
      const getStatusColor = (status) => {
        switch (status) {
          case 'blocked':
            return 'red';
          case 'active':
            return 'green';
          default:
            return 'grey';
        }
      };
      const subscribeToNotifications =  () => {
  
  channel.bind('user-logout', function(data) {
    
    alert("The account is blocked"); 
    console.log(data); 
  });
}

  
      const filteredusers = computed(() => {
        if (!selectedStatus.value) {
          return users.value;
        }
        return users.value.filter((order) => order.status === selectedStatus.value);
      });
  
      const fetchdata = async () => {
        try {
          const response = await axios.get(`http://192.168.1.5:8000/api/admin/users/?page=3`,   {
            headers: {
                Authorization: `Bearer ${userStore.user.token}`, 
                'Content-Type': 'application/json',},})
          const result = response.data.data; 
         users.value =result
        } catch (error) {
          console.log(error);
        }
      };
  
      const openConfirmDialog = (order, action) => {
        selectedOrder.value = order;
        actionType.value = action;
        dialogTitle.value = action === 'active' ? 'Activate User' : 'Block User';
        dialogText.value = `Are you sure you want to ${action} user ${order.customer}?`;
        confirmDialog.value = true;
      };
  
      const closeConfirmDialog = () => {
        confirmDialog.value = false;
        selectedOrder.value = null;
        actionType.value = '';
      };
  
      const confirmAction = async () => {
  if (selectedOrder.value && actionType.value) {
    const userId = selectedOrder.value.id; // Assuming the user object has an 'id' field
    const action = actionType.value === 'active' ? 'active' : 'block'; // Determine the action
  
   
    try {
      // Make the API request to block or activate the user
      await axios.post(`http://192.168.1.5:8000/api/admin/users/${userId}/${action}`, {}, {
        headers: {
          Authorization: `Bearer ${userStore.user.token}`, // Include the token in the headers
          'Content-Type': 'application/json',
        },
      });
      subscribeToNotifications();
     fetchdata();

    
      closeConfirmDialog();
    } catch (error) {
      console.error('Error updating user status:', error);
      // Optionally, you could show an error message to the user here
    }
  }
};

  
      // Call fetchdata on component mount
      onMounted(() => {
        fetchdata();
      });
  
      return {
        search,
        selectedStatus,
        users,
        headers,
        statusOptions,
        filteredusers,
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
  