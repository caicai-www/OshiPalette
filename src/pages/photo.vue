<template>
  <v-container>
    <v-banner class="bg-info mb-5" height="450px">BANNER什麼時候會做好呢</v-banner>
    <v-divider></v-divider>
    <color-option></color-option>
    <v-divider></v-divider>

    <!-- <masonry :cols="3" :gutter="30">
      <template v-for="post in posts" :key="post._id">
        <post-card v-bind="post"></post-card>
      </template>
    </masonry> -->

    <v-row class="mt-5">
      <v-col v-for="post in posts" :key="post._id" cols="12" md="4" lg="3">
        <post-card v-bind="post"></post-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useAxios } from '@/composables/axios'
import PostCard from '@/components/PostCard.vue'
import ColorOption from '@/components/ColorOption.vue'

const { api } = useAxios()
const posts = ref([])

const getPost = async () => {
  try {
    const { data } = await api.get('/post/all')
    posts.value.push(...data.result)
    // console.log(data.result)
  } catch (error) {
    console.log('pages.photo.getPost', error)
  }
}

getPost()
</script>

<style scoped></style>

<route lang="yaml">
meta:
  login: false
  admin: false
  title: '照片牆'
</route>
