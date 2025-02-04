<template>
  <v-navigation-drawer permanent class="bg-info">
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
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-main>
    <router-view> </router-view>
  </v-main>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const navs = computed(() => {
  return [
    { to: '/user', text: '個人資料', icon: 'mdi-badge-account' },
    { to: '/user/oshigram', text: '我的照片牆/收藏', icon: ' mdi-image-album' },
    { to: '/user/calendar', text: '我的活動月曆', icon: 'mdi-calendar-account' },
    { to: '/', text: '回首頁', icon: 'mdi-home' },
  ]
})
</script>
