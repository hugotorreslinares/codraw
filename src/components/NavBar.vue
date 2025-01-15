<template>
  <nav class="bg-gray-800 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white text-lg">CoDraw</div>
      <div class="flex space-x-4">
        <a href="#" class="text-gray-300 hover:text-white" @click="clearCanvas">
          <VIcon name="md-delete-round" class="h-6 w-6" />
        </a>
        <a href="#" class="text-gray-300 hover:text-white" @click="downloadCanvas">
          <VIcon name="bi-download" class="h-6 w-6" />
        </a>
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
  clearCanvas: Function,
  downloadCanvas: Function
})
</script>

<style scoped></style>