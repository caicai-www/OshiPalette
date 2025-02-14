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
    <v-main class="bg">
      <router-view> </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

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

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})
</script>

<style scoped>
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
