<template>
  <router-link :to="'/post/' + _id">
    <v-card :style="{ border: `1px solid ${colors}` }" class="mx-auto" height="100%">
      <v-img :src="image" cover class="mx-5 mt-7 mb-2 polaroid"></v-img>
      <v-card-title>{{ title }}</v-card-title>
      <v-chip v-for="tag in tags" :key="tag" class="ma-2">{{ tag }}</v-chip>
    </v-card>
  </router-link>
</template>

<script setup>
defineProps({
  // eslint-disable-next-line vue/prop-name-casing
  _id: {
    type: String,
    default: '',
  },
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

<style scoped>
.polaroid {
  border-radius: 2px;
  box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.2);
}
</style>
