<template>
  <v-navigation-drawer permanent class="navi_bg position-fixed">
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
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/style'

const useStyle = useThemeStore()

const user = useUserStore()
const navs = computed(() => {
  return [
    { to: '/admin/user', text: '會員管理', icon: 'mdi-file-account' },
    { to: '/admin/post', text: '會員文章管理', icon: ' mdi-basket' },
    { to: '/admin/calendar', text: '活動月曆管理', icon: 'mdi-calendar-edit' },
    { to: '/', text: '回首頁', icon: 'mdi-home' },
  ]
})

// console.log(user.avatarSvg)
</script>
