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
              class="d-flex align-center justify-center sheet"
              :color="item.type === 'color' ? item.value : ''"
              height="150"
              style="position: relative; overflow: hidden"
            >
              <template v-if="item.type === 'image'">
                <v-img :src="item.value" height="100%" cover></v-img>
              </template>

              <template v-else>
                <div
                  style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <svg viewBox="0 0 120 120" width="100" height="100">
                    <!-- 愛心形狀 -->
                    <path
                      id="heartPath"
                      stroke="transparent"
                      :fill="item.value"
                      class="heart"
                      d="M107.551,55.676c10.765-13.352,9.95-32.948-2.451-45.35
           c-12.402-12.401-31.607-4.325-44.958,6.44L60,16.625
           C46.722,3.347,24.804-5.544,11.525,7.733c-13.278,13.278-13.278,34.806,0,48.083
           L59.609,103.9l48.083-48.083L107.551,55.676z"
                    />
                    <!-- 繞著愛心路徑的文字 -->
                    <text font-size="14" fill="white" font-weight="bold">
                      <textPath href="#heartPath" startOffset="0%">
                        Oshi Palette Oshi Palette Oshi Palette Oshi Palette
                      </textPath>
                    </text>
                  </svg>
                </div>
              </template>
            </v-sheet>
          </v-col>

          <template v-if="!isMobile">
            <v-col v-for="(item, index) in thirdColItems" :key="index" cols="12">
              <v-sheet
                class="d-flex align-center justify-center sheet"
                :color="item.type === 'color' ? item.value : ''"
                height="600"
                style="position: relative; overflow: hidden"
              >
                <template v-if="item.type === 'image'">
                  <v-img :src="item.value" height="100%" cover></v-img>
                </template>

                <template v-else>
                  <div
                    style="
                      position: absolute;
                      width: 100%;
                      height: 100%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <svg viewBox="0 0 120 120" width="300" height="300">
                      <!-- 愛心形狀 -->
                      <path
                        id="heartPath"
                        stroke="transparent"
                        :fill="item.value"
                        class="heart"
                        d="M107.551,55.676c10.765-13.352,9.95-32.948-2.451-45.35
           c-12.402-12.401-31.607-4.325-44.958,6.44L60,16.625
           C46.722,3.347,24.804-5.544,11.525,7.733c-13.278,13.278-13.278,34.806,0,48.083
           L59.609,103.9l48.083-48.083L107.551,55.676z"
                      />
                      <!-- 繞著愛心路徑的文字 -->
                      <text font-size="14" fill="white" font-weight="bold">
                        <textPath href="#heartPath" startOffset="0%">
                          Oshi Palette Oshi Palette Oshi Palette Oshi Palette
                        </textPath>
                      </text>
                    </svg>
                  </div>
                </template>
              </v-sheet>
            </v-col>
          </template>
        </v-row>
      </v-col>

      <!-- 第二欄  -->
      <v-col v-if="!isMobile" cols="12" md="4" class="d-flex">
        <v-row class="ma-n3">
          <v-col v-for="(item, index) in secondColItems" :key="index" cols="3">
            <v-sheet
              class="d-flex align-center justify-center sheet"
              :color="item.type === 'color' ? item.value : ''"
              height="150"
              style="position: relative; overflow: hidden"
            >
              <template v-if="item.type === 'image'">
                <v-img :src="item.value" height="100%" cover></v-img>
              </template>

              <template v-else>
                <div
                  style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <svg viewBox="0 0 120 120" width="100" height="100">
                    <!-- 愛心形狀 -->
                    <path
                      id="heartPath"
                      stroke="transparent"
                      :fill="item.value"
                      class="heart"
                      d="M107.551,55.676c10.765-13.352,9.95-32.948-2.451-45.35
           c-12.402-12.401-31.607-4.325-44.958,6.44L60,16.625
           C46.722,3.347,24.804-5.544,11.525,7.733c-13.278,13.278-13.278,34.806,0,48.083
           L59.609,103.9l48.083-48.083L107.551,55.676z"
                    />
                    <!-- 繞著愛心路徑的文字 -->
                    <text font-size="14" fill="white" font-weight="bold">
                      <textPath href="#heartPath" startOffset="0%">
                        Oshi Palette Oshi Palette Oshi Palette Oshi Palette
                      </textPath>
                    </text>
                  </svg>
                </div>
              </template>
            </v-sheet>
          </v-col>

          <v-col v-for="(item, index) in fourthColItems" :key="index" cols="12">
            <v-sheet
              class="d-flex align-center justify-center sheet"
              :color="item.type === 'color' ? item.value : ''"
              height="600"
              style="position: relative; overflow: hidden"
            >
              <template v-if="item.type === 'image'">
                <v-img :src="item.value" height="100%" cover></v-img>
              </template>
              <template v-else>
                <div
                  style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <svg viewBox="0 0 120 120" width="300" height="300">
                    <!-- 愛心形狀 -->
                    <path
                      id="heartPath"
                      stroke="transparent"
                      :fill="item.value"
                      class="heart"
                      d="M107.551,55.676c10.765-13.352,9.95-32.948-2.451-45.35
           c-12.402-12.401-31.607-4.325-44.958,6.44L60,16.625
           C46.722,3.347,24.804-5.544,11.525,7.733c-13.278,13.278-13.278,34.806,0,48.083
           L59.609,103.9l48.083-48.083L107.551,55.676z"
                    />
                    <!-- 繞著愛心路徑的文字 -->
                    <text font-size="14" fill="white" font-weight="bold">
                      <textPath href="#heartPath" startOffset="0%">
                        Oshi Palette Oshi Palette Oshi Palette Oshi Palette
                      </textPath>
                    </text>
                  </svg>
                </div>
              </template>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="4" class="d-flex ma-n3">
        <v-col cols="12">
          <v-sheet
            class="d-flex gradient-sheet"
            height="774"
            :style="{ background: randomGradient, position: 'relative', overflow: 'hidden' }"
          >
            <svg viewBox="0 0 120 120">
              <!-- 愛心路徑 -->
              <path
                id="heartPath2"
                d="M107.551,55.676c10.765-13.352,9.95-32.948-2.451-45.35
               c-12.402-12.401-31.607-4.325-44.958,6.44L60,16.625
               C46.722,3.347,24.804-5.544,11.525,7.733c-13.278,13.278-13.278,34.806,0,48.083
               L59.609,103.9l48.083-48.083L107.551,55.676z"
                fill="none"
                class="logo-heart"
                stroke="#000"
                stroke-width="2"
                stroke-linecap="round"
                :style="logoColor"
              />
            </svg>

            <!-- 彈出 "Oshipalette" 文字 -->
            <sheet-foooter id="popupText" class="popup-text" :style="logoColor"
              >Oshi Palette</sheet-foooter
            >
          </v-sheet>
        </v-col>
      </v-col>
    </v-row>
  </v-container>

  <!-- 輪播圖 -->
  <v-container :style="useStyle.homeSwiperBg" class="py-5 d-flex justify-center" fluid>
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

  <v-container :style="useStyle.homeCalendarBg" class="py-10" fluid>
    <h1 class="text-center">活動月曆</h1>
    <EventCalendar @update-events="(events) => (eventsData = events)" />
  </v-container>

  <!-- 最新消息 -->
  <v-container :style="useStyle.homeNewsBg" class="py-10" fluid>
    <h1 class="text-center pt-10">最新活動消息</h1>
    <v-timeline align="start" density="dense">
      <v-timeline-item
        v-for="event in latestEvents"
        :key="event._id"
        :size="$vuetify.display.smAndDown ? 'small' : 'large'"
      >
        <template #icon>
          <v-avatar>
            <v-img :src="event.image" cover></v-img>
          </v-avatar>
        </template>

        <template v-if="$vuetify.display.mdAndUp" #opposite>
          <span>{{ event.createdAt }} update</span>
        </template>

        <v-row>
          <v-col cols="12">
            <v-card class="rounded-xl glass-card"
              ><v-card-subtitle>{{ event.start }}</v-card-subtitle>
              <v-card-title v-if="!isMobile">{{ event.title }} </v-card-title>
              <v-card-subtitle v-if="isMobile">{{ event.title }} </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
  </v-container>

  <v-footer :style="useStyle.footerBg" height="75">
    <div class="w-100 text-center">© 2025 泰山網頁青年專班 專題設計 - 龔筱婷</div>
  </v-footer>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useAxios } from '@/composables/axios'
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useRouter } from 'vue-router'
import EventCalendar from '@/components/EventCalendar.vue'
import '@/styles/homeSwiper.css'
import { useThemeStore } from '@/stores/style'
import gsap from 'gsap'

const useStyle = useThemeStore()
// console.log(useStyle.logoColor)

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
// const colors = ['#ffa6a6', '#f9a8d4', '#decfff', '#cff9ff', '#b9ffb3', '#fffcaf', '#ffbf95']

const randomColors = computed(() => {
  const usedColors = new Set()
  return Array.from({ length: 20 }, () => {
    let color
    do {
      const R = Math.floor(Math.random() * 255)
      const G = Math.floor(Math.random() * 255)
      const B = Math.floor(Math.random() * 255)
      color = `rgba(${R},${G},${B},0.2)`
    } while (usedColors.has(color))
    usedColors.add(color)
    return color
  })
})

console.log(randomColors.value)
// 隨機生成 items 陣列
const generateItems = (count, usedImages) => {
  const images = posts.value.map((post) => post.image)
  const generatedItems = []
  for (let i = 0; i < count; i++) {
    const isImage = Math.random() > 0.2 // 機率
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
      let randomColor
      do {
        randomColor = randomColors.value[Math.floor(Math.random() * randomColors.value.length)]
      } while (usedColors.has(randomColor))
      usedColors.add(randomColor)
      generatedItems.push({
        type: 'color',
        value: randomColor,
      })
    }
  }
  return generatedItems
}

const usedImages = new Set()
const usedColors = new Set()

const firstColItems = computed(() => generateItems(4, usedImages, usedColors))
const secondColItems = computed(() => generateItems(4, usedImages, usedColors))
const thirdColItems = computed(() => generateItems(1, usedImages, usedColors))
const fourthColItems = computed(() => generateItems(1, usedImages, usedColors))

const thumbsSwiper = ref(null)

// 在 mounted 中更新 swiper
onMounted(() => {
  thumbsSwiper.value && thumbsSwiper.value.update()
})

// gsap動畫
const showText = ref(false)

onMounted(() => {
  const path = document.querySelector('#heartPath2')
  const pathLength = path.getTotalLength()

  gsap.fromTo(
    path,
    { strokeDasharray: pathLength, strokeDashoffset: pathLength },
    {
      strokeDashoffset: 0,
      duration: 3,
      ease: 'power2.out',
      onComplete: () => {
        showText.value = true // 當愛心畫完後，顯示文字
        gsap.fromTo(
          '#popupText',
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1.5, duration: 1, ease: 'elastic.out(1, 0.5)' },
        )
      },
    },
  )
})

// 產生隨機顏色
const getRandomColor = () => {
  const R = Math.floor(Math.random() * 255)
  const G = Math.floor(Math.random() * 255)
  const B = Math.floor(Math.random() * 255)
  return `rgba(${R},${G},${B},0.3)`
}

// 計算隨機漸層
const randomGradient = computed(() => {
  const color1 = getRandomColor()
  const color2 = getRandomColor()
  return `linear-gradient(45deg, ${color1}, ${color2})`
})

// 隨機產生logo顏色
const logoColor = computed(() => ({
  filter: `brightness(0) saturate(100%)
           invert(${Math.floor(Math.random() * 100)}%)
           sepia(${Math.floor(Math.random() * 100)}%)
           saturate(${Math.floor(Math.random() * 150) + 100}%)
           hue-rotate(${Math.floor(Math.random() * 360)}deg)
           brightness(${Math.floor(Math.random() * 45)}%)
           contrast(${Math.floor(Math.random() * 51) + 30}%)`,
}))

// 判斷是不是mobile
const isMobile = ref(false)

const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 800
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})
</script>

<style>
.vuecal__event {
  background: rgba(207, 207, 207, 0.2);
  backdrop-filter: hue-rotate(90deg) saturate(80%);
  border-radius: 30px;
  padding: 10px;
  box-shadow: 0px 20px 15px rgba(0, 0, 0, 0.1);
}

.vuecal__event:hover {
  background: rgba(207, 207, 207, 0.3);
  backdrop-filter: hue-rotate(180deg);
}
</style>

<style scoped>
.heart {
  filter: hue-rotate(80deg);
}

.logo-heart {
  mix-blend-mode: overlay;
  position: relative;
}

.sheet {
  border-radius: 15px;
  box-shadow: 0px 20px 15px rgba(0, 0, 0, 0.1);
}

.gradient-sheet {
  border-radius: 15px;
  box-shadow: 0px 20px 15px rgba(0, 0, 0, 0.1);
  background: url('../assets/bg.jpg');
  mix-blend-mode: hard-light;
}

/* 彈出的文字樣式 */
.popup-text {
  font-size: 24px;
  font-weight: bold;
  color: #151213;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0; /* 初始隱藏 */
  mix-blend-mode: overlay;
}
</style>

<route lang="yaml">
meta:
  login: false
  admin: false
  title: '首頁'
</route>
