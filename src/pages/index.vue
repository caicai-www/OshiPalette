<template>
  <!-- <v-banner class="banner" height="1100px"> 首頁 INDEX</v-banner> -->
  <!-- 調色盤網格 -->
  <v-container class="glass-card mt-5" fluid>
    <v-row class="flex-child justify-center">
      <v-col cols="12" md="4" class="d-flex">
        <v-row class="ma-n3">
          <!-- 第一欄 照片-->
          <v-col v-for="(item, index) in firstColItems" :key="index" cols="3">
            <v-sheet
              class="d-flex align-center justify-center"
              :color="item.type === 'color' ? item.value : ''"
              height="150"
            >
              <template v-if="item.type === 'image'">
                <v-img :src="item.value" max-width="100%" cover></v-img>
              </template>
              <template v-else>
                <!-- SVG 讓文字呈現水彩暈染 -->
                <svg width="100%" height="100%">
                  <defs>
                    <filter id="watercolor">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.02"
                        numOctaves="3"
                        result="noise"
                      >
                        <animate
                          attributeName="baseFrequency"
                          values="0.015; 0.02; 0.025; 0.015"
                          dur="5s"
                          repeatCount="indefinite"
                        />
                      </feTurbulence>
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
                      <feGaussianBlur stdDeviation="2" />
                    </filter>
                  </defs>

                  <!-- 水彩風格文字 -->
                  <text
                    x="50%"
                    y="50%"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-size="24"
                    font-weight="bold"
                    fill="rgba(0, 0, 0, 0.6)"
                    filter="url(#watercolor)"
                  >
                    文字還沒好
                  </text>
                </svg>
              </template>
            </v-sheet>
          </v-col>

          <v-col v-for="(item, index) in thirdColItems" :key="index" cols="12">
            <v-sheet
              class="d-flex align-center justify-center"
              :color="item.type === 'color' ? item.value : ''"
              height="600"
            >
              <template v-if="item.type === 'image'">
                <v-img :src="item.value" max-width="100%" cover></v-img>
              </template>

              <template v-else>
                <span>文字還沒好</span>
              </template>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>

      <!-- 第二欄  -->
      <v-col cols="12" md="4" class="d-flex">
        <v-row class="ma-n3">
          <v-col v-for="(item, index) in secondColItems" :key="index" cols="3">
            <v-sheet
              class="d-flex align-center justify-center"
              :color="item.type === 'color' ? item.value : ''"
              height="150"
            >
              <template v-if="item.type === 'image'">
                <v-img :src="item.value" max-width="100%" cover></v-img>
              </template>
              <template v-else>
                <span>文字還沒好</span>
              </template>
            </v-sheet>
          </v-col>

          <v-col v-for="(item, index) in fourthColItems" :key="index" cols="12">
            <v-sheet
              class="d-flex align-center justify-center"
              :color="item.type === 'color' ? item.value : ''"
              height="600"
            >
              <template v-if="item.type === 'image'">
                <v-img :src="item.value" max-width="100%" cover></v-img>
              </template>
              <template v-else>
                <span>文字還沒好</span>
              </template>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="4" class="d-flex ma-n3">
        <v-col cols="12">
          <v-sheet class="d-flex" color="bg-blue" height="774">
            <sheet-footer> 想放LOGO圖 但還沒好 </sheet-footer>
          </v-sheet>
        </v-col>
      </v-col>
    </v-row>
  </v-container>

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

  <!-- 最新消息 -->
  <v-container class="bg-blue py-10" fluid>
    <h1 class="text-center pt-10">最新活動消息</h1>

    <!-- timeline要做RWD 不然會出事 -->
    <v-card style="max-width: 1200px" class="mx-auto bg-transparent" elevation="0">
      <v-timeline align="start" density="dense">
        <v-timeline-item v-for="event in latestEvents" :key="event._id" size="large">
          <template #icon>
            <v-avatar v-bind="attrs" v-on="on">
              <v-img :src="event.image" cover></v-img>
            </v-avatar>
          </template>

          <template #opposite>
            <span>{{ event.createdAt }} update</span>
          </template>

          <v-card class="rounded-xl glass-card"
            ><v-card-subtitle>{{ event.start }}</v-card-subtitle>
            <v-card-title>{{ event.title }} </v-card-title>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-card>
  </v-container>

  <v-footer> 到底要不要做footer呢 </v-footer>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useAxios } from '@/composables/axios'
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useRouter } from 'vue-router'
import EventCalendar from '@/components/EventCalendar.vue'
import '@/styles/homeSwiper.css'

const router = useRouter()

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

// 首頁banner
const colors = ['#ffa6a6', '#f9a8d4', '#decfff', '#cff9ff', '#b9ffb3', '#fffcaf', '#ffbf95']
// 隨機生成 items 陣列
const generateItems = (count, usedImages) => {
  const images = posts.value.map((post) => post.image)
  const generatedItems = []
  for (let i = 0; i < count; i++) {
    const isImage = Math.random() > 0.2 // 50% 機率
    if (isImage && images.length > usedImages.size) {
      let randomImage
      do {
        randomImage = images[Math.floor(Math.random() * images.length)]
      } while (usedImages.has(randomImage))
      usedImages.add(randomImage)
      generatedItems.push({
        type: 'image',
        value: randomImage,
      })
    } else {
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      generatedItems.push({
        type: 'color',
        value: randomColor,
      })
    }
  }
  return generatedItems
}

const usedImages = new Set()

const firstColItems = computed(() => generateItems(4, usedImages))
const secondColItems = computed(() => generateItems(4, usedImages))
const thirdColItems = computed(() => generateItems(1, usedImages))
const fourthColItems = computed(() => generateItems(1, usedImages))

const thumbsSwiper = ref(null)

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
.banner {
  background: url('@/assets/banner.png') center center;
}

.water-mark {
  color: rgba(0, 0, 0, 0.3);
  mix-blend-mode: multiply;
}
</style>

<route lang="yaml">
meta:
  login: false
  admin: false
  title: '首頁'
</route>
