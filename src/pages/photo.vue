<template>
  <v-container>
    <swiper
      :slides-per-view="'auto'"
      :space-between="50"
      :pagination="{
        clickable: true,
      }"
      :autoplay="{
        delay: 2500,
        disableOnInteraction: false,
      }"
      :modules="modules"
      class="mySwiper py-10 mt-5 mb-10"
    >
      <swiper-slide v-for="post in swiperPosts" :key="post._id">
        <img :src="post.image" cover height="100%" />
      </swiper-slide>
    </swiper>

    <v-divider></v-divider>
    <v-row>
      <v-col class="d-flex justify-center" cols="12">
        <color-option @color-selected="filterPostsByColor"></color-option>
      </v-col>
    </v-row>

    <v-divider></v-divider>
    <!--- 瀑布流布局 使用 CSS Grid -->
    <div class="column-layout mt-10 pa-5">
      <post-card
        v-for="post in filteredPosts"
        v-show="post.display"
        :key="post._id"
        v-bind="post"
        class="column-item"
      />
    </div>

    <!-- <v-row class="mt-5 justify-center">
      <v-col
        v-for="post in filteredPosts"
        v-show="post.display"
        :key="post._id"
        cols="12"
        md="2"
        class="ma-3"
      >
        <post-card v-bind="post"></post-card>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useAxios } from '@/composables/axios'
import PostCard from '@/components/PostCardMasonry.vue'
import ColorOption from '@/components/ColorOption.vue'

import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'

import { Autoplay, Pagination } from 'swiper/modules'

const modules = [Autoplay, Pagination]

const { api } = useAxios()
const posts = ref([])
const filteredPosts = ref([])

const getPost = async () => {
  try {
    const { data } = await api.get('/post/all')
    posts.value.push(...data.result)
    filteredPosts.value.push(...data.result)
    swiperPosts.value = getRandomPosts(posts.value)
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
  } else if (color === 'all') {
    filteredPosts.value = [...posts.value]
  } else {
    filteredPosts.value = posts.value.filter(
      (post) => post.colors?.toLowerCase() === color.toLowerCase(),
    )
  }
  // console.log('過濾後的貼文:', filteredPosts.value) // 檢查過濾後的結果
}

const swiperPosts = ref([])

const getRandomPosts = (posts) => {
  const shuffledPosts = []
  while (shuffledPosts.length < 30 && posts.length > 0) {
    const randomIndex = Math.floor(Math.random() * posts.length)
    const randomPost = posts[randomIndex]

    // 確保不會重複選擇同一篇
    if (!shuffledPosts.includes(randomPost)) {
      shuffledPosts.push(randomPost)
    }
  }
  return shuffledPosts
}
</script>

<style scoped>
.swiper {
  width: 100%;
  height: 500px; /* 可以根據需求調整 */
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: auto; /* 根據圖片的大小自動調整寬度 */
}

.swiper-slide img {
  display: block;
  height: 100%; /* 保證圖片會根據容器的寬度縮放 */
  width: auto; /* 保持圖片的比例 */
  object-fit: cover; /* 讓圖片以適合的方式顯示 */
}

/* 確保容器的寬度設置為100% */

.column-layout {
  column-count: 5; /* 設為3列 */
  column-gap: 50px; /* 設置列與列之間的間距 */
  width: 100%;
  overflow: hidden; /* 確保子項目不會溢出容器 */
}

.column-item {
  break-inside: avoid; /* 防止元素在列中间被分割 */
  margin-bottom: 30px;
  min-height: 300px;
}

.column-layout::after {
  content: '';
  display: table;
  clear: both;
}

@media (max-width: 1800px) {
  .column-layout {
    column-count: 4;
  }
}
@media (max-width: 1280px) {
  .column-layout {
    column-count: 3;
  }
}

@media (max-width: 768px) {
  .column-layout {
    column-count: 2;
  }
}

@media (max-width: 480px) {
  .column-layout {
    column-count: 1;
  }
}
</style>

<route lang="yaml">
meta:
  login: false
  admin: false
  title: '照片牆'
</route>
