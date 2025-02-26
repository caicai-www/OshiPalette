<template>
  <v-banner class="banner" height="1100px"> 首頁 INDEX</v-banner>

  <!-- 輪播圖 -->
  <v-container class="my-5 d-flex justify-center">
    <swiper
      v-if="posts.length > 0"
      :effect="'coverflow'"
      :grab-cursor="true"
      :centered-slides="true"
      :slides-per-view="'auto'"
      :coverflow-effect="{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }"
      :modules="modules"
      :autoplay="{ delay: 1500, disableOnInteraction: false, pauseOnMouseEnter: true }"
      loop
      :mousewheel="true"
      class="mySwiper"
    >
      <swiper-slide v-for="post in posts" :key="post._id">
        <img :src="post.image" @click="onEventClick(post)" />
      </swiper-slide>
    </swiper>
  </v-container>

  <!-- 活動月曆 -->

  <h1 class="text-center">活動月曆</h1>
  <EventCalendar @update-events="(events) => (eventsData = events)" />

  <v-container class="bg-blue" fluid>
    <h1 class="text-center">最新活動消息</h1>

    <!-- timeline要做RWD 不然會出事 -->
    <v-card style="max-width: 1200px" class="mx-auto">
      <v-timeline align="start">
        <v-timeline-item v-for="event in latestEvents" :key="event._id" size="large">
          <template #icon>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-avatar v-bind="attrs" :image="event.image" v-on="on"></v-avatar>
              </template>
              <v-img :src="event.image" max-width="200"></v-img>
            </v-tooltip>
          </template>
          <template #opposite>
            <span>{{ event.createdAt }} update</span>
          </template>

          <v-card class="rounded-xl"
            ><v-card-subtitle>{{ event.start }}</v-card-subtitle>
            <v-card-title>{{ event.title }} </v-card-title>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAxios } from '@/composables/axios'
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useRouter } from 'vue-router'
import EventCalendar from '@/components/EventCalendar.vue'

const router = useRouter()

// Import Swiper styles
import 'swiper/css'

import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

import '@/styles/homeSwiper.css'

// import required modules
import { EffectCoverflow, Autoplay, Mousewheel } from 'swiper/modules'

const modules = [EffectCoverflow, Autoplay, Mousewheel]

// 取貼文
const { api } = useAxios()
const posts = ref([])

const getPosts = async () => {
  try {
    const { data } = await api.get('/post/random')
    posts.value.push(...data.result)
    // console.log(posts.value)
  } catch (error) {
    console.log(error)
  }
}

getPosts()

// 輪播圖點擊事件
const onEventClick = (post) => {
  // console.log('活動ID', event)
  router.push('/post/' + post._id)
}

// 取最新活動資訊
const eventsData = ref([])
const latestEvents = ref([])

watch(eventsData, (newEvents) => {
  latestEvents.value = newEvents
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

console.log(latestEvents)
</script>

<style>
.vuecal__event {
  background: rgba(207, 207, 207, 0.2);
  backdrop-filter: hue-rotate(180deg) saturate(100%);
  border-radius: 30px;
  padding: 10px;
  box-shadow: 0px 20px 15px rgba(0, 0, 0, 0.1);
}

.vuecal__event:hover {
  background: rgba(207, 207, 207, 0.3);
  backdrop-filter: hue-rotate(80deg);
}
</style>

<style scoped>
.banner {
  background: url('@/assets/banner.png') center center;
}
</style>

<route lang="yaml">
meta:
  login: false
  admin: false
  title: '首頁'
</route>
