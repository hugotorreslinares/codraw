<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { Chrome } from '@ckpack/vue-color';
import { io } from 'socket.io-client';
import UserNamePrompt from './UserNamePrompt.vue';

const canvasRef = ref(null);
const isDrawing = ref(false);
const context = ref(null);
const color = ref({ hex: '#000000', rgba: { r: 0, g: 0, b: 0, a: 1 } }); // Default color is black
const showColorPicker = ref(false);
const brushSize = ref(5); // Default brush size

const socket = io('http://localhost:3000');

const userName = ref('');
const showNamePrompt = ref(true);

const emit = defineEmits(['userJoined']);

const cursorPosition = ref({ x: 0, y: 0 });
const showCustomCursor = ref(false);

const canvasWidth = ref(800);
const canvasHeight = ref(600);

// Add brush shapes
const brushShapes = [
  { id: 'round', label: 'Round', icon: '●' },
  { id: 'square', label: 'Square', icon: '■' },
  { id: 'star', label: '★', icon: '★' },
  { id: 'triangle', label: 'Triangle', icon: '▲' }
];

const currentBrushShape = ref('round');

const cursorStyle = computed(() => {
  const baseStyle = {
    width: `${brushSize.value}px`,
    height: `${brushSize.value}px`,
    left: `${cursorPosition.value.x}px`,
    top: `${cursorPosition.value.y}px`,
    backgroundColor: `rgba(${color.value.rgba.r}, ${color.value.rgba.g}, ${color.value.rgba.b}, 0.3)`,
    border: `2px solid rgba(${color.value.rgba.r}, ${color.value.rgba.g}, ${color.value.rgba.b}, 1)`,
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none'
  };

  switch (currentBrushShape.value) {
    case 'square':
      return { ...baseStyle, borderRadius: '0' };
    case 'star':
      return { 
        ...baseStyle, 
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        borderRadius: '0'
      };
    case 'triangle':
      return { 
        ...baseStyle, 
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        borderRadius: '0'
      };
    default: // round
      return { ...baseStyle, borderRadius: '50%' };
  }
});

const updateCursorPosition = (event) => {
  if (!canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  cursorPosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

// Add this function to draw different shapes
const drawShape = (x, y) => {
  if (!context.value) return;
  
  switch (currentBrushShape.value) {
    case 'square':
      context.value.fillRect(
        x - brushSize.value / 2,
        y - brushSize.value / 2,
        brushSize.value,
        brushSize.value
      );
      break;
    case 'star':
      drawStar(x, y, brushSize.value / 2);
      break;
    case 'triangle':
      drawTriangle(x, y, brushSize.value / 2);
      break;
    default: // round
      context.value.beginPath();
      context.value.arc(x, y, brushSize.value / 2, 0, Math.PI * 2);
      context.value.fill();
  }
};

// Helper function to draw a star
const drawStar = (x, y, size) => {
  const spikes = 5;
  const outerRadius = size;
  const innerRadius = size / 2;

  context.value.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const pointX = x + radius * Math.cos(angle);
    const pointY = y + radius * Math.sin(angle);
    
    if (i === 0) {
      context.value.moveTo(pointX, pointY);
    } else {
      context.value.lineTo(pointX, pointY);
    }
  }
  context.value.closePath();
  context.value.fill();
};

// Helper function to draw a triangle
const drawTriangle = (x, y, size) => {
  context.value.beginPath();
  context.value.moveTo(x, y - size);
  context.value.lineTo(x - size, y + size);
  context.value.lineTo(x + size, y + size);
  context.value.closePath();
  context.value.fill();
};

// Modify the draw function
const draw = (event) => {
  if (!isDrawing.value) return;
  const { offsetX, offsetY } = event;
  
  // Set fill style for shapes
  context.value.fillStyle = `rgba(${color.value.rgba.r}, ${color.value.rgba.g}, ${color.value.rgba.b}, ${color.value.rgba.a})`;
  drawShape(offsetX, offsetY);

  // Emit the shape data
  socket.emit('draw', {
    offsetX,
    offsetY,
    color: color.value.rgba,
    brushSize: brushSize.value,
    brushShape: currentBrushShape.value,
    type: 'draw'
  });
};

const startDrawing = (event) => {
  isDrawing.value = true;
  context.value.strokeStyle = `rgba(${color.value.rgba.r}, ${color.value.rgba.g}, ${color.value.rgba.b}, ${color.value.rgba.a})`;
  context.value.lineWidth = brushSize.value;
  context.value.beginPath();
  context.value.moveTo(event.offsetX, event.offsetY);
  socket.emit('draw', {
    offsetX: event.offsetX,
    offsetY: event.offsetY,
    color: color.value.rgba,
    brushSize: brushSize.value,
    type: 'start'
  });
};

const stopDrawing = () => {
  if (!isDrawing.value) return;
  isDrawing.value = false;
  context.value.closePath();
  socket.emit('draw', { type: 'stop' });
};

const clearCanvas = () => {
  if (!context.value || !canvasRef.value) return;
  context.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  context.value.fillStyle = 'white';
  context.value.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  socket.emit('draw', { type: 'clear' });
};

const downloadCanvas = () => {
  const link = document.createElement('a');
  link.download = 'co-draw.png';
  link.href = canvasRef.value.toDataURL('image/png');
  link.click();
};

defineExpose({ clearCanvas, downloadCanvas });

const handleNameSubmit = (name) => {
  userName.value = name;
  showNamePrompt.value = false;
  emit('userJoined', name);
};

const updateCanvasSize = () => {
  const container = document.querySelector('.canvas-container');
  if (container) {
    canvasWidth.value = container.clientWidth;
    canvasHeight.value = Math.min(window.innerHeight * 0.7, 600); // 70% of viewport height, max 600px
    
    // If canvas exists, copy current content before resizing
    if (canvasRef.value && context.value) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvasRef.value.width;
      tempCanvas.height = canvasRef.value.height;
      const tempContext = tempCanvas.getContext('2d');
      tempContext.drawImage(canvasRef.value, 0, 0);
      
      // Update canvas size
      canvasRef.value.width = canvasWidth.value;
      canvasRef.value.height = canvasHeight.value;
      
      // Restore content
      context.value.fillStyle = 'white';
      context.value.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
      context.value.drawImage(tempCanvas, 0, 0);
    }
  }
};

const updateColor = (newColor) => {
  color.value = newColor;
  if (context.value) {
    context.value.strokeStyle = `rgba(${newColor.rgba.r}, ${newColor.rgba.g}, ${newColor.rgba.b}, ${newColor.rgba.a})`;
  }
};

const toggleColorPicker = () => {
  showColorPicker.value = !showColorPicker.value;
};

const setBrushSize = (size) => {
  brushSize.value = parseInt(size);
  if (context.value) {
    context.value.lineWidth = brushSize.value;
  }
};

const setBrushShape = (shape) => {
  currentBrushShape.value = shape;
  // Update canvas context properties if needed
  if (context.value) {
    // You might want to add specific drawing behavior for each shape
    context.value.lineCap = shape === 'square' ? 'square' : 'round';
    context.value.lineJoin = shape === 'square' ? 'miter' : 'round';
  }
};

onMounted(() => {
  const canvas = canvasRef.value;
  context.value = canvas.getContext('2d');
  context.value.fillStyle = 'white';
  context.value.fillRect(0, 0, canvas.width, canvas.height);
  context.value.lineWidth = brushSize.value;
  
  // Drawing event listeners
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', (e) => {
    updateCursorPosition(e);
    draw(e);
  });
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
  canvas.addEventListener('mouseenter', () => {
    showCustomCursor.value = true;
  });
  canvas.addEventListener('mouseleave', () => {
    showCustomCursor.value = false;
  });

  socket.on('draw', (data) => {
    if (!context.value) return;

    context.value.fillStyle = `rgba(${data.color.r}, ${data.color.g}, ${data.color.b}, ${data.color.a})`;
    context.value.strokeStyle = `rgba(${data.color.r}, ${data.color.g}, ${data.color.b}, ${data.color.a})`;
    context.value.lineWidth = data.brushSize;

    if (data.type === 'draw' && data.brushShape) {
      drawShape(data.offsetX, data.offsetY);
    }
  });

  window.addEventListener('resize', updateCanvasSize);
  updateCanvasSize(); // Initial size setup
});

onBeforeUnmount(() => {
  const canvas = canvasRef.value;
  if (canvas && canvas._cursorHandlers) {
    canvas.removeEventListener('mousemove', canvas._cursorHandlers.move);
    canvas.removeEventListener('mouseenter', canvas._cursorHandlers.enter);
    canvas.removeEventListener('mouseleave', canvas._cursorHandlers.leave);
  }
  canvas.removeEventListener('mousedown', startDrawing);
  canvas.removeEventListener('mousemove', draw);
  canvas.removeEventListener('mouseup', stopDrawing);
  canvas.removeEventListener('mouseout', stopDrawing);
  socket.off('draw');
  window.removeEventListener('resize', updateCanvasSize);
});
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <UserNamePrompt v-if="showNamePrompt" @nameSubmitted="handleNameSubmit" />
    
    <div class="canvas-container relative w-full px-4">
      <canvas 
        ref="canvasRef" 
        :width="canvasWidth"
        :height="canvasHeight"
        class="border border-gray-300 shadow-lg mb-4 max-w-full touch-none"
        @touchstart.prevent="startDrawing"
        @touchmove.prevent="(e) => {
          updateCursorPosition(e.touches[0]);
          draw(e.touches[0]);
        }"
        @touchend.prevent="stopDrawing"
      ></canvas>
      <div 
        v-if="showCustomCursor"
        class="custom-cursor"
        :style="cursorStyle"
      ></div>
    </div>

    <!-- Updated controls section with border and title -->
    <div class="controls-container bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h2 class="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
        Drawing Options
      </h2>
      
      <div class="controls-panel flex flex-wrap gap-4 mb-4">
        <button 
          @click="toggleColorPicker"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Change Color
        </button>
        
        <div class="flex items-center gap-2">
          <label class="text-gray-700">Brush:</label>
          <div class="flex gap-1">
            <button
              v-for="shape in brushShapes"
              :key="shape.id"
              @click="setBrushShape(shape.id)"
              class="w-8 h-8 flex items-center justify-center border rounded"
              :class="{
                'border-blue-500 bg-blue-50': currentBrushShape === shape.id,
                'border-gray-300 hover:bg-gray-50': currentBrushShape !== shape.id
              }"
              :title="shape.label"
            >
              <span class="text-lg">{{ shape.icon }}</span>
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <label for="brushSize" class="text-gray-700">Size:</label>
          <input
            type="range"
            id="brushSize"
            min="1"
            max="50"
            :value="brushSize"
            @input="setBrushSize($event.target.value)"
            class="w-32"
          />
          <span class="text-gray-700">{{ brushSize }}px</span>
        </div>
      </div>

      <div v-show="showColorPicker" class="mt-4 border-t border-gray-200 pt-4">
        <Chrome 
          v-model="color"
          :disableAlpha="true"
          @change="toggleColorPicker"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas-container {
  position: relative;
  cursor: none;
  max-width: 1200px; /* Maximum width for very large screens */
  margin: 0 auto;
}

.custom-cursor {
  position: absolute;
  pointer-events: none;
  z-index: 1000;
  transition: width 0.1s, height 0.1s;
}

canvas {
  border: 1px solid #000;
  background-color: white;
  cursor: none;
  width: 100%;
  height: 100%;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  background: #ddd;
  border-radius: 4px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* Add styles for brush shape buttons */
.brush-shape-button {
  transition: all 0.2s;
}

.brush-shape-button:hover {
  transform: scale(1.1);
}

.controls-container {
  min-width: 300px;
  max-width: 800px;
  width: 90%;
  margin: 0 auto;
}
</style>