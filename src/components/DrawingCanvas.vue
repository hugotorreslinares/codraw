<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Chrome } from '@ckpack/vue-color';
import socket from '../socket';

const canvasRef = ref(null);
const isDrawing = ref(false);
const context = ref(null);
const color = ref({ hex: '#000000', rgba: { r: 0, g: 0, b: 0, a: 1 } }); // Default color is black
const showColorPicker = ref(false);

const startDrawing = (event) => {
  isDrawing.value = true;
  context.value.strokeStyle = `rgba(${color.value.rgba.r}, ${color.value.rgba.g}, ${color.value.rgba.b}, ${color.value.rgba.a})`; // Set the stroke color
  context.value.beginPath();
  context.value.moveTo(event.offsetX, event.offsetY);
  socket.emit('startDrawing', { offsetX: event.offsetX, offsetY: event.offsetY, color: color.value.rgba });
};

const draw = (event) => {
  if (!isDrawing.value) return;
  const { offsetX, offsetY } = event;
  context.value.lineTo(offsetX, offsetY);
  context.value.stroke();
  socket.emit('drawing', { offsetX, offsetY, color: color.value.rgba });
};

const stopDrawing = () => {
  isDrawing.value = false;
  context.value.closePath();
  socket.emit('stopDrawing');
};
const clearCanvas = () => {
  console.log("Clearing canvas");
  context.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  context.value.fillStyle = 'white';
  context.value.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  socket.emit('clearCanvas');
};

const downloadCanvas = () => {
  const link = document.createElement('a');
  link.download = 'co-draw.png';
  link.href = canvasRef.value.toDataURL('image/png');
  link.click();
};

socket.on('clearCanvas', () => {
  clearCanvas();
});

defineExpose({ clearCanvas, downloadCanvas });

const startDrawingFromData = (data) => {
  context.value.strokeStyle = `rgba(${data.color.r}, ${data.color.g}, ${data.color.b}, ${data.color.a})`; // Set the stroke color from data
  context.value.beginPath();
  context.value.moveTo(data.offsetX, data.offsetY);
};

const drawFromData = (data) => {
  context.value.strokeStyle = `rgba(${data.color.r}, ${data.color.g}, ${data.color.b}, ${data.color.a})`; // Set the stroke color from data
  context.value.lineTo(data.offsetX, data.offsetY);
  context.value.stroke();
};

const stopDrawingFromData = () => {
  context.value.closePath();
};

const toggleColorPicker = () => {
  showColorPicker.value = !showColorPicker.value;
};

onMounted(() => {
  const canvas = canvasRef.value;
  context.value = canvas.getContext('2d');
  context.value.fillStyle = 'white';
  context.value.fillRect(0, 0, canvas.width, canvas.height);
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  socket.on('startDrawing', startDrawingFromData);
  socket.on('drawing', drawFromData);
  socket.on('stopDrawing', stopDrawingFromData);
});

onBeforeUnmount(() => {
  const canvas = canvasRef.value;
  canvas.removeEventListener('mousedown', startDrawing);
  canvas.removeEventListener('mousemove', draw);
  canvas.removeEventListener('mouseup', stopDrawing);
  canvas.removeEventListener('mouseout', stopDrawing);

  socket.off('startDrawing', startDrawingFromData);
  socket.off('drawing', drawFromData);
  socket.off('stopDrawing', stopDrawingFromData);
});
</script>

<template>
  <div class="flex flex-col items-center">
    <canvas ref="canvasRef" width="800" height="600" class="border border-gray-300 shadow-lg mb-4"></canvas>
    <button @click="toggleColorPicker" class="bg-blue-500 text-white px-4 py-2 rounded">Change Color</button>
    <div v-if="showColorPicker" class="mt-4">
      <Chrome v-model="color" :disableAlpha="true" @change="showColorPicker = false" /> <!-- Vue Color Picker without alpha selector -->
    </div>
  </div>
</template>

<style scoped>
.drawing-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background-color: #f0f0f0;
}

canvas {
    border: 1px solid #000;
    background-color: white;
  cursor: crosshair;
}
</style>