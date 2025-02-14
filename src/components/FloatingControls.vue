<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Chrome } from '@ckpack/vue-color';

const props = defineProps({
  color: {
    type: Object,
    required: true
  },
  brushSize: {
    type: Number,
    required: true
  },
  showColorPicker: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:color', 'update:brushSize', 'update:showColorPicker']);

const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const controlsRef = ref(null);

// Add a ref for the handle element
const handleRef = ref(null);

// Update startDrag to only work when dragging the handle
const startDrag = (event) => {
  // Only start dragging if clicking the handle
  if (event.target.closest('.handle')) {
    isDragging.value = true;
    dragOffset.value = {
      x: event.clientX - position.value.x,
      y: event.clientY - position.value.y
    };
  }
};

// Calculate initial position
const setInitialPosition = () => {
  if (controlsRef.value) {
    const padding = 20; // Padding from window edges
    position.value = {
      x: window.innerWidth - controlsRef.value.offsetWidth - padding,
      y: window.innerHeight - controlsRef.value.offsetHeight - padding
    };
  }
};

// Update onMounted
onMounted(() => {
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  // Set initial position after component is mounted
  setInitialPosition();
  // Also handle window resize
  window.addEventListener('resize', setInitialPosition);
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('resize', setInitialPosition);
});

const onDrag = (event) => {
  if (isDragging.value) {
    position.value = {
      x: event.clientX - dragOffset.value.x,
      y: event.clientY - dragOffset.value.y
    };
  }
};

const stopDrag = () => {
  isDragging.value = false;
};

const updateBrushSize = (size) => {
  emit('update:brushSize', parseInt(size));
};

const toggleColorPicker = () => {
  console.log('Current state:', props.showColorPicker);
  emit('update:showColorPicker', !props.showColorPicker);
  console.log('New state:', !props.showColorPicker);
};

// Update the color picker to handle changes properly
const handleColorChange = (newColor) => {
  emit('update:color', newColor);
  // Don't automatically close the picker when color changes
  // emit('update:showColorPicker', false);
};
</script>

<template>
  <div
    ref="controlsRef"
    class="floating-controls"
    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
  >
    <div 
      ref="handleRef"
      class="handle bg-gray-200 p-2 cursor-move rounded-t-lg"
      @mousedown.stop="startDrag"
    >
      <div class="w-full h-2 bg-gray-400 rounded-full"></div>
    </div>
    
    <div class="controls-content bg-white p-4 rounded-b-lg shadow-lg">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <label for="brushSize" class="text-gray-700 whitespace-nowrap">Size:</label>
          <input
            type="range"
            id="brushSize"
            min="1"
            max="50"
            :value="brushSize"
            @input="updateBrushSize($event.target.value)"
            class="w-32"
          />
          <span class="text-gray-700 min-w-[3ch]">{{ brushSize }}</span>
        </div>
        
        <button 
          @click="toggleColorPicker"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Change Color
        </button>
        
        <div v-show="showColorPicker" class="mt-2">
          <Chrome 
            :value="color"
            @update:modelValue="handleColorChange"
            :disableAlpha="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.floating-controls {
  position: fixed;
  z-index: 1000;
  min-width: 200px;
  max-width: 90vw; /* Prevent overflow on mobile */
  user-select: none;
  transition: left 0.3s, top 0.3s; /* Smooth transition when repositioning */
}

.handle {
  touch-action: none; /* Prevents touch scrolling on mobile */
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
</style> 