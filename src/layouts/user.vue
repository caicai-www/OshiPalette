<template>
  <v-app>
    <v-app-bar v-if="isMobile" app color="bg" dark>
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
    <v-main :style="useStyle.containerStyle">
      <router-view> </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/style'

const useStyle = useThemeStore()

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
.bg {
  background: url('@/assets/bg.jpg');

  background-blend-mode: hard-light;
}
</style>
