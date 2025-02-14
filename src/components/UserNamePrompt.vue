<script setup>
import { ref } from 'vue';

const emit = defineEmits(['nameSubmitted']);
const username = ref('');
const error = ref('');

const submitName = () => {
  if (username.value.trim().length < 2) {
    error.value = 'Name must be at least 2 characters long';
    return;
  }
  emit('nameSubmitted', username.value.trim());
};
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-xl w-96">
      <h2 class="text-xl font-bold mb-4">Enter your name</h2>
      <input
        type="text"
        v-model="username"
        @keyup.enter="submitName"
        placeholder="Your name"
        class="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:border-blue-500"
        autofocus
      />
      <p v-if="error" class="text-red-500 text-sm mb-2">{{ error }}</p>
      <button
        @click="submitName"
        class="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Join Drawing Room
      </button>
    </div>
  </div>
</template> 