<template>
  <div id="app">
    <NavBar :clearCanvas="clearCanvas" :downloadCanvas="downloadCanvas"/>
    <DrawingCanvas ref="drawingCanvasRef"/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import DrawingCanvas from './components/DrawingCanvas.vue'

const drawingCanvasRef = ref(null) 

// Method to clear the canvas
const clearCanvas = () => {
  if (drawingCanvasRef.value) {
    drawingCanvasRef.value.clearCanvas()
  }
}
// Method to download the canvas as PNG
const downloadCanvas = () => {
  console.log("downloading")
  if (drawingCanvasRef.value) {
    drawingCanvasRef.value.downloadCanvas()
  }
}
</script>

<style scoped></style>