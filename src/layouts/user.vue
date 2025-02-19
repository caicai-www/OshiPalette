<template>
  <v-app>
    <v-app-bar v-if="isMobile" app color="info" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app :permanent="!isMobile" class="navi_bg">
      <v-list>
        <v-list-item :title="user.account"> </v-list-item>
        <v-divider></v-divider>
      </v-list>
      <v-list>
        <v-list-item
          v-for="nav in navs"
          :key="nav.to"
          :prepend-icon="nav.icon"
          :title="nav.text"
          :to="nav.to"
          class="mb-5 mx-5 list_bg"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main :style="containerStyle" class="bg-watercolor">
      <router-view> </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import bgImage from '@/assets/bg.jpg'

const drawer = ref()
const isMobile = ref(false)

const user = useUserStore()
const navs = computed(() => {
  return [
    { to: '/user', text: '個人資料', icon: 'mdi-badge-account' },
    { to: '/user/oshigram', text: '我的照片牆/收藏', icon: ' mdi-image-album' },
    { to: '/user/calendar', text: '我的活動月曆', icon: 'mdi-calendar-account' },
    { to: '/', text: '回首頁', icon: 'mdi-home' },
  ]
})

const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 600
}

const colors = ['#ffa6a6', '#f9a8d4', '#decfff', '#cff9ff', '#b9ffb3', '#fffcaf', '#ffbf95']

// 計算屬性，用來生成隨機的漸層
const randomGradient = computed(() => {
  const numColors = Math.floor(Math.random() * 6) + 2
  const selectedColors = getRandomColors(numColors)
  const degree = Math.floor(Math.random() * 360)
  return `linear-gradient(${degree}deg, ${selectedColors.join(', ')})`
})

// 隨機選擇顏色
function getRandomColors(num) {
  const shuffledColors = [...colors]

  // 隨機打亂顏色陣列
  for (let i = shuffledColors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledColors[i], shuffledColors[j]] = [shuffledColors[j], shuffledColors[i]]
  }

  // 返回前 num 個顏色
  return shuffledColors.slice(0, num)
}

const containerStyle = computed(() => {
  return {
    background: `url(${bgImage}), ${randomGradient.value}`,
    backgroundSize: 'cover', // 使背景圖片完全覆蓋容器
    backgroundBlendMode: 'hard-light', // 混合模式
    backgroundPosition: 'center', // 背景居中
  }
})

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})
</script>

<style scoped>
.bg {
  background: url('@/assets/bg.jpg');

  background-blend-mode: hard-light;
}

.navi_bg {
  background: url('@/assets/navi_bg.png') center center;
}

.list_bg {
  background: url('@/assets/list.jpg'),
    linear-gradient(55deg, hsl(0, 100%, 83%), #f9a8d4, #decfff, #cff9ff, #b9ffb3, #fffcaf, #ffbf95);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-origin: padding-box;
  background-blend-mode: hard-light;
  mask: url('@/assets/list_mask.png') no-repeat center center;
  mask-size: cover;
}
</style>
