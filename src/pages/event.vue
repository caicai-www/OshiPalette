<template>
  <!-- 活動輪播圖 -->
  <v-container>
    <swiper
      :space-between="100"
      :centered-slides="true"
      :autoplay="{ delay: 2500, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      :navigation="true"
      :modules="modules"
      class="mySwiper"
    >
      <swiper-slide v-for="event in eventsData" :key="event.id">
        <img :src="event.image" class="event-image" />
      </swiper-slide>
    </swiper>
  </v-container>

  <!-- 活動月曆 -->
  <EventCalendar @update-events="(events) => (eventsData = events)" />
</template>

<script setup>
import { ref, watch } from 'vue'
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

const eventsData = ref([])

watch(eventsData, (newEvents) => {
  console.log('📢 監聽到 eventsData 變化:', newEvents)
  console.log(eventsData.value)
})

// onMounted(() => {
//   setTimeout(() => {
//     // 等待數據載入後再取值
//     console.log(eventCalendarRef.value.events)
//     if (eventCalendarRef.value) {
//       eventsData.value = eventCalendarRef.value.events
//     }
//     console.log(eventsData.value)
//   }, 500)
// })

// onMounted(() => {
//   if (eventCalendarRef.value) {
//     eventsData.value = eventCalendarRef.value.events

//     console.log(eventCalendarRef.value) // 檢查完整結構
//     console.log(eventCalendarRef.value.events) // 檢查 events 的內容
//     // console.log('Fetched events:', events.value)
//   }
// })
</script>

<style>
.vuecal__event {
  background: rgba(207, 207, 207, 0.2);
  backdrop-filter: hue-rotate(180deg) saturate(100%);
  border-radius: 30px;
  padding: 16px;
  box-shadow: 0px 20px 15px rgba(0, 0, 0, 0.1);
}

.vuecal__event:hover {
  background: rgba(207, 207, 207, 0.3);
  backdrop-filter: hue-rotate(80deg);
}
</style>

<route lang="yaml">
meta:
  login: false
  admin: false
  title: '活動月曆'
</route>
