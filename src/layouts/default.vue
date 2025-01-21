<template>
  <v-toolbar density="comfortable">
    <v-container fluid class="d-flex align-center gradient-toolbar">
      <v-btn to="/" :active="false">OshiPalette</v-btn>
      <v-btn v-for="nav of navs" :key="nav.to" :to="nav.to" :prepend-icon="nav.icon">
        {{ nav.text }}
      </v-btn>
      <v-spacer />
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props"> <v-icon left>mdi-account-circle</v-icon></v-btn>
        </template>
        <v-list>
          <v-list-item v-for="user of users" :key="user.to" :to="user.to" :prepend-icon="user.icon">
            <v-list-item-title>{{ user.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-container>
  </v-toolbar>

  <v-main>
    <router-view></router-view>
  </v-main>
</template>

<script setup>
import { computed } from 'vue'

const navs = computed(() => {
  return [
    { to: '/event', text: '活動月曆', icon: ' mdi-calendar-month' },
    { to: '/item', text: '推活小物', icon: ' mdi-emoticon-kiss-outline' },
    { to: '/photo', text: '照片牆', icon: ' mdi-image-album' },
  ]
})

const users = computed(() => {
  return [
    { to: '/register', text: '註冊', icon: 'mdi-account-plus' },
    { to: '/login', text: '登入', icon: 'mdi-login' },
  ]
})
</script>

<style>
.gradient-toolbar {
  background: linear-gradient(
    122deg,
    #ffa6a6,
    #f9a8d4,
    #decfff,
    #cff9ff,
    #b9ffb3,
    #fffcaf,
    #ffbf95
  );
  color: white;
}
</style>
