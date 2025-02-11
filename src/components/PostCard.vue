<template>
  <v-card :style="{ border: `2px solid ${colors}` }" class="mx-auto">
    <v-img :src="image" cover class="ma-2"></v-img>
    <v-card-title>{{ title }}</v-card-title>
    <v-chip v-for="tag in tags" :key="tag" class="ma-2">{{ tag }}</v-chip>
  </v-card>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  tags: {
    type: Array,
    default: () => [],
  },
  colors: {
    type: String,
    default: '',
  },
})
</script>
