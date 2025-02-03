<template>
  <v-navigation-drawer permanent class="bg-info">
    <v-list>
      <v-list-item :prepend-avatar="user.icon" :title="user.account"></v-list-item>
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
    { to: '/admin/user', text: '會員管理', icon: 'mdi-file-account' },
    { to: '/admin/post', text: '會員文章管理', icon: ' mdi-basket' },
    { to: '/admin/calendar', text: '月曆活動管理', icon: 'mdi-calendar-edit' },
    { to: '/', text: '回首頁', icon: 'mdi-home' },
  ]
})
</script>
