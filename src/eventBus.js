import { reactive } from 'vue';

const eventBus = reactive({
  events: {},
  
  // Method to emit an event
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  },

  // Method to listen for an event
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },

  // Method to remove an event listener
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
});

export default eventBus;
