<template>
  <nav class="bg-gray-800 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white text-lg">MyApp</div>
      <div class="flex space-x-4">
        <a href="#" class="text-gray-300 hover:text-white">
          <VIcon name="md-delete-round" class="h-6 w-6" />
        </a>
        <a href="#" class="text-gray-300 hover:text-white">
          <VIcon name="bi-download" class="h-6 w-6" />
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { addIcons, OhVueIcon as VIcon } from 'oh-vue-icons'
import { BiXCircle, BiDownload } from 'oh-vue-icons/icons'
import { MdDeleteRound } from "oh-vue-icons/icons";
addIcons(BiXCircle, BiDownload,MdDeleteRound)
</script>

<style scoped></style>