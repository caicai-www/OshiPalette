<template>
  <template v-for="color in colors" :key="color">
    <v-chip
      :class="{ 'gradient-chip': color === 'all' }"
      :color="color !== 'all' ? color : ''"
      class="mx-3 my-2 circle"
      variant="elevated"
      @click="selectColor(color)"
    >
    </v-chip>
  </template>
</template>

<script setup>
import { defineEmits } from 'vue'

defineProps({
  colors: {
    type: Array,
    default: () => [
      'red',
      'pink',
      'orange',
      'blue',
      'green',
      'yellow',
      'purple',
      'white',
      'black',
      'all',
    ],
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
.gradient-chip {
  background: linear-gradient(
    130deg,
    #ffa6a6,
    #f9a8d4,
    #decfff,
    #cff9ff,
    #b9ffb3,
    #fffcaf,
    #ffbf95
  ); /* 漸層顏色 */
}
</style>
