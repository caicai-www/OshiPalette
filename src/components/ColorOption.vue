<template>
  <template v-for="color in colors" :key="color">
    <v-chip :color="color" class="mx-3 my-2">{{ color }} </v-chip>
  </template>
</template>

<script setup>
defineProps({
  colors: {
    type: Array,
    default: () => ['red', 'pink', 'orange', 'blue', 'green', 'yellow', 'purple', 'white', 'black'],
  },
})
</script>
