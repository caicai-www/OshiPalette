<template>
  <!-- 活動輪播圖 -->
  <v-container>
    <swiper
      :style="{
        '--swiper-navigation-color': '#fff',
        '--swiper-pagination-color': '#fff',
      }"
      :space-between="10"
      :navigation="true"
      :thumbs="{ swiper: thumbsSwiper }"
      :modules="modules"
      :autoplay="{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }"
      loop
      class="mySwiper2"
    >
      <swiper-slide v-for="event in latestEvents" :key="event.id">
        <img :src="event.image" class="event-image" @click="onEventClick(event)" />
      </swiper-slide>
    </swiper>
    <swiper
      :space-between="10"
      :slides-per-view="4"
      :free-mode="true"
      :watch-slides-progress="true"
      :modules="modules"
      class="mySwiper"
      @swiper="setThumbsSwiper"
    >
      <swiper-slide v-for="event in latestEvents" :key="event.id">
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
import { useRouter } from 'vue-router'

const router = useRouter()

// SWIPER
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

import '@/styles/swiper.css'
// import required modules
import { FreeMode, Navigation, Thumbs, Autoplay } from 'swiper/modules'

const modules = [FreeMode, Navigation, Thumbs, Autoplay]

const eventsData = ref([])
const thumbsSwiper = ref(null)

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper
}

watch(eventsData, (newEvents) => {
  console.log('📢 監聽到 eventsData 變化:', newEvents)
  console.log(eventsData.value)
})

const onEventClick = (event) => {
  // console.log('活動ID', event)
  router.push('/calendar/' + event.id)
}

const latestEvents = ref([])

watch(eventsData, (newEvents) => {
  latestEvents.value = newEvents.sort((a, b) => new Date(b.start) - new Date(a.start)).slice(0, 10)
})
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

<route lang="yaml">
meta:
  login: false
  admin: false
  title: '活動月曆'
</route>
