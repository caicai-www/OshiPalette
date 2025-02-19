<template>
  <v-container>
    <v-banner class="bg-info mb-5" height="450px">BANNER什麼時候會做好呢</v-banner>
    <v-divider></v-divider>
    <color-option @color-selected="filterPostsByColor"></color-option>
    <v-divider></v-divider>

    <v-row class="mt-5">
      <v-col v-for="post in filteredPosts" :key="post._id" cols="12" md="4" lg="3">
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
const filteredPosts = ref([])

const getPost = async () => {
  try {
    const { data } = await api.get('/post/all')
    posts.value.push(...data.result)
    filteredPosts.value.push(...data.result)
    console.log(data.result)
  } catch (error) {
    console.log('pages.photo.getPost', error)
  }
}

getPost()

const filterPostsByColor = (color) => {
  // console.log('選擇的顏色:', color) // 確保選擇顏色有傳進來
  // console.log('所有貼文', posts.value)
  if (!color) {
    filteredPosts.value = posts.value // 沒選擇顏色時顯示所有貼文
  } else {
    filteredPosts.value = posts.value.filter(
      (post) => post.colors?.toLowerCase() === color.toLowerCase(),
    )
  }
  // console.log('過濾後的貼文:', filteredPosts.value) // 檢查過濾後的結果
}
</script>

<style scoped></style>

<route lang="yaml">
meta:
  login: false
  admin: false
  title: '照片牆'
</route>
