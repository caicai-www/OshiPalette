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
      class="mySwiper2 my-2"
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
import { ref, watch, onMounted } from 'vue'
import EventCalendar from '@/components/EventCalendar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// SWIPER
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

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

// 在 mounted 中更新 swiper
onMounted(() => {
  thumbsSwiper.value && thumbsSwiper.value.update()
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

<style scoped>
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  height: 100%;
  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* body {
  background: #000;
  color: #000;
}

.swiper {
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}

.swiper-slide {
  background-size: cover;
  background-position: center;
} */

.mySwiper2 {
  height: 600px;
  width: 100%;
}

.mySwiper {
  height: 200px;
  box-sizing: border-box;
  padding: 10px 0;
}

.mySwiper .swiper-slide {
  width: 25%;
  height: 100%;
  opacity: 0.4;
}

.mySwiper .swiper-slide-thumb-active {
  opacity: 1;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

<route lang="yaml">
meta:
  login: false
  admin: false
  title: '活動月曆'
</route>
