<template>
  <router-link :to="'/post/' + _id">
    <v-card :style="{ boxShadow: `0px 3px 10px ${colors}` }" class="mx-auto polaroid" height="100%">
      <v-img :src="image" cover class="mx-5 mt-7 mb-2 photo"></v-img>
      <v-card-title>{{ title }}</v-card-title>
      <v-chip v-for="tag in tags" :key="tag" class="ma-2" size="s">{{ tag }}</v-chip>
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
  backdrop-filter: blur(10px);
  border-radius: 10px;
}
.photo {
  border-radius: 10px;
  box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.2);
}
</style>
