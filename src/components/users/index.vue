<template>
    <v-container>
      <!-- Search bar -->
      <v-text-field
      @input="searchdebounce"
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
      ></v-text-field>
      
      <!-- Filter options -->
      <v-select
        v-model="selectedStatus"
        :items="statusOptions"
        label="Filter by Status"
          variant="outlined"
          hide-details
          single-line
      ></v-select>
     
    

  
      <!-- users Table -->
      <v-data-table
        :headers="headers"
        :items="filteredUsers"
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
      <button style="height: 40px; width: 40px; border-radius: 50%; margin-right: 10px; background-color :#e6fbff; " 
    @click="paginationn(2)"
    > <v-icon>mdi-chevron-left</v-icon></button>
    <span>curent page {{ pagination }} / {{ last }} </span>
  
    <button style="height: 40px; width: 40px; border-radius: 50%;  background-color :#e6fbff; "
        @click="paginationn(1)"
    ><v-icon>mdi-chevron-right</v-icon></button>
    </v-container>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue'; 
import { useUserStoree } from '@/stores/users'; 
import { debounce } from 'lodash'; 

  export default {
    name:'inDex',
    setup() {
  const userStore = useUserStoree();
  const search = ref('');
  const selectedStatus = ref('All');
  const confirmDialog = ref(false);
  const actionType = ref('');
  const selectedOrder = ref(null);

  const dialogTitle = ref('');
  const dialogText = ref('');
  const pagination = computed(() => userStore.pagination);
  const last = computed(() => userStore.lastPage);
  
  const headers = ref([
    { text: 'User ID', value: 'id' },
    { text: 'Name', value: 'name' },
    { text: 'Email', value: 'email' },
    { text: 'Role', value: 'role.name' },
    { text: 'Status', value: 'status' },
    { text: 'Actions', value: 'actions', sortable: false },
  ]);


  const statusOptions = ref(['All', 'active', 'blocked']);

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

  const paginationn = (action) => {
    userStore.setPagination(action);
  };

  const filteredUsers = computed(() => userStore.filteredUsers(selectedStatus.value));

  watch([pagination], () => {
    userStore.fetchUsers(search.value);
  });

  const fetchdata = async () => {
    await userStore.fetchUsers(search.value);
  };

  const searchdebounce = debounce(fetchdata, 1000);

  const openConfirmDialog = (user, action) => {
    selectedOrder.value = user;
    actionType.value = action;
    dialogTitle.value = action === 'active' ? 'Activate User' : 'Block User';
    dialogText.value = `Are you sure you want to ${action} user ${user.name}?`;
    confirmDialog.value = true;
  };

  const closeConfirmDialog = () => {
    confirmDialog.value = false;
    selectedOrder.value = null;
    actionType.value = '';
  };

  const confirmAction = async () => {
    if (selectedOrder.value && actionType.value) {
      const userId = selectedOrder.value.id;
      const action = actionType.value === 'active' ? 'active' : 'block';

      try {
        await userStore.updateUserStatus(userId, action);
        fetchdata();
        closeConfirmDialog();
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    }
  };

  onMounted(() => {
    fetchdata();
    
  });

  return {
    searchdebounce,
    search,
    selectedStatus,
    users: computed(() => userStore.users),
    headers,
    statusOptions,
    filteredUsers,
    getStatusColor,
    openConfirmDialog,
    confirmDialog,
    dialogTitle,
    dialogText,
    confirmAction,
    closeConfirmDialog,
    last,
    pagination,
    fetchdata,
    paginationn,
  };
}

  }
  
</script>

  
  <style scoped>
  /* Add any necessary styles here */
  </style>
  