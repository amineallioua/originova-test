    import { defineStore } from 'pinia';
    import apiClient from '@/services/axios'; // Ensure the API client is imported
    import router from '@/router';
    export const useUserStoree = defineStore('userr', {
    state: () => ({
        users: [],
        pagination: 1,
        lastPage: null,
        selectedUser: null,
    }),
    
    actions: {
        async fetchUsers(search = '') {
        let url = `users/?page=${this.pagination}`;
        if (search) {
            url += `&search=${search}`;
        }

        try {
            const response = await apiClient.get(url);
            this.users = response.data.data;
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

        async updateUserStatus(userId, action) {
        try {
            await apiClient.post(`users/${userId}/${action}`, {});
            await this.fetchUsers(); // Refresh the user list after the update
        } catch (error) {
            console.error('Error updating user status:', error);
        }
        },

        setPagination(page) {
        if (page === 1 && this.pagination < this.lastPage) {
            this.pagination++;
        } else if (page === 2 && this.pagination > 1) {
            this.pagination--;
        }
        },
        
        selectUser(user) {
        this.selectedUser = user;
        },
    },

    getters: {
        filteredUsers: (state) => (selectedStatus) => {
        if (selectedStatus === 'All') {
            return state.users;
        }
        return state.users.filter(user => user.status === selectedStatus);
        },
    },
    });
