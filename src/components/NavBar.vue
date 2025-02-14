<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <div class="text-xl font-bold text-gray-800">CoDraw</div>
          <div v-if="currentUser" class="ml-4 text-gray-600">
            | <span class="ml-2">{{ currentUser }}</span>
          </div>
        </div>
        <div>
          <button
            @click="downloadCanvas"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          ><VIcon name="bi-download" class="h-6 w-6" />
            Download
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { addIcons, OhVueIcon as VIcon } from 'oh-vue-icons'
import { BiDownload, MdDeleteRound } from 'oh-vue-icons/icons'
import { defineProps } from 'vue'

addIcons(BiDownload, MdDeleteRound)

const props = defineProps({
  downloadCanvas: {
    type: Function,
    required: true
  },
  currentUser: {
    type: String,
    required: false,
    default: ''
  }
})
</script>

<style scoped></style>