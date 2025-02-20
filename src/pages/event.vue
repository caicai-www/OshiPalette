<template>
  <!-- 活動輪播圖 -->
  <v-container>
    <swiper
      :space-between="30"
      :centered-slides="true"
      :autoplay="{
        delay: 2500,
        disableOnInteraction: false,
      }"
      :pagination="{
        clickable: true,
      }"
      :navigation="true"
      :modules="modules"
      class="mySwiper"
    >
      <swiper-slide>Slide 1</swiper-slide>
      <swiper-slide>Slide 2</swiper-slide><swiper-slide>Slide 3</swiper-slide>
      <swiper-slide>Slide 4</swiper-slide><swiper-slide>Slide 5</swiper-slide>
      <swiper-slide>Slide 6</swiper-slide><swiper-slide>Slide 7</swiper-slide>
      <swiper-slide>Slide 8</swiper-slide><swiper-slide>Slide 9</swiper-slide>
    </swiper>
    <!-- <pre>{{ eventCalendarRef.events }}</pre> -->
  </v-container>
  <v-app>
    <!-- 活動月曆 -->
    <EventCalendar ref="eventCalendarRef" />
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EventCalendar from '@/components/EventCalendar.vue'

// SWIPER
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

import 'swiper/css/pagination'
import 'swiper/css/navigation'

import '@/styles/swiper.css'
// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

const modules = [Autoplay, Pagination, Navigation]

// 取子層資料
const eventCalendarRef = ref(null)
const eventsData = ref([])

onMounted(() => {
  if (eventCalendarRef.value) {
    eventsData.value = eventCalendarRef.value.events

    console.log(eventCalendarRef.value) // 檢查完整結構
    console.log(eventCalendarRef.value.events) // 檢查 events 的內容
    // console.log('Fetched events:', events.value)
  }
})
</script>

<route lang="yaml">
meta:
  login: false
  admin: false
  title: '活動月曆'
</route>
