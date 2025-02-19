<template>
  <template v-for="color in colors" :key="color">
    <v-chip :color="color" class="mx-3 my-2 circle" variant="elevated" @click="selectColor(color)">
    </v-chip>
  </template>
</template>

<script setup>
import { defineEmits } from 'vue'

defineProps({
  colors: {
    type: Array,
    default: () => ['red', 'pink', 'orange', 'blue', 'green', 'yellow', 'purple', 'white', 'black'],
  },
})

const emit = defineEmits(['colorSelected'])

const selectColor = (color) => {
  emit('colorSelected', color) // 正確發送事件
  console.log('點擊顏色:', color)
}
</script>

<style scoped>
.circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #d3d3d3;
  filter: drop-shadow(0px 15px 20px rgba(0, 0, 0, 0.1));
}
</style>
