<script setup>
import { ref, onMounted, onBeforeUnmount, defineExpose } from 'vue';

const canvasRef = ref(null);
const isDrawing = ref(false);
const context = ref(null);

const startDrawing = (event) => {
  isDrawing.value = true;
  context.value.beginPath();
  context.value.moveTo(event.offsetX, event.offsetY);
};

const draw = (event) => {
  if (!isDrawing.value) return;
  context.value.lineTo(event.offsetX, event.offsetY);
  context.value.stroke();
};

const stopDrawing = () => {
  isDrawing.value = false;
  context.value.closePath();
};

const clearCanvas = () => {
  console.log("Clearing canvas");
  context.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  context.value.fillStyle = 'white';
  context.value.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
};

const downloadCanvas = () => {
    console.log("canvas download")
  const link = document.createElement('a');
  link.download = 'co-draw.png';
  link.href = canvasRef.value.toDataURL('image/png');
  link.click();
};

defineExpose({ clearCanvas, downloadCanvas });

onMounted(() => {
  const canvas = canvasRef.value;
  context.value = canvas.getContext('2d');
  context.value.fillStyle = 'white';
  context.value.fillRect(0, 0, canvas.width, canvas.height);
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
});

onBeforeUnmount(() => {
  const canvas = canvasRef.value;
  canvas.removeEventListener('mousedown', startDrawing);
  canvas.removeEventListener('mousemove', draw);
  canvas.removeEventListener('mouseup', stopDrawing);
  canvas.removeEventListener('mouseout', stopDrawing);
});
</script>

<template>
  <div class="drawing-container">
    <canvas ref="canvasRef" width="800" height="600"></canvas>
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
}
</style>