<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar 
      :downloadCanvas="downloadCanvas"
      :currentUser="currentUser"
    />
    
    <!-- Main content -->
    <main class="w-full py-8">
      <DrawingCanvas 
        ref="drawingCanvasRef"
        @userJoined="handleUserJoined" 
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import DrawingCanvas from './components/DrawingCanvas.vue'

const drawingCanvasRef = ref(null)
const currentUser = ref('')

// Method to download the canvas as PNG
const downloadCanvas = () => {
  if (drawingCanvasRef.value) {
    drawingCanvasRef.value.downloadCanvas()
  }
}

const handleUserJoined = (username) => {
  currentUser.value = username
}
</script>

<style>
/* Add to your global styles */
body {
  overscroll-behavior: none; /* Prevent pull-to-refresh on mobile */
}
</style>