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
        <v-list rounded="xl" class="pa-2">
          <template v-for="user of users" :key="user.to">
            <v-list-item v-if="user.show" rounded="xl" :to="user.to" :prepend-icon="user.icon">
              <v-list-item-title>{{ user.text }}</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item v-if="userstore.isLoggedIn" prepend-icon="mdi-logout" @click="logout">
            <v-list-item-title>登出</v-list-item-title>
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
import { useUserStore } from '@/stores/user'
import { useAxios } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

const userstore = useUserStore()
const { apiAuth } = useAxios()
const createSnackbar = useSnackbar()

const navs = computed(() => {
  return [
    { to: '/event', text: '活動月曆', icon: ' mdi-calendar-month' },
    { to: '/item', text: '推活小物', icon: ' mdi-emoticon-kiss-outline' },
    { to: '/photo', text: '照片牆', icon: ' mdi-image-album' },
  ]
})

const users = computed(() => {
  return [
    { to: '/register', text: '註冊', icon: 'mdi-account-plus', show: !userstore.isLoggedIn },
    { to: '/login', text: '登入', icon: 'mdi-login', show: !userstore.isLoggedIn },
    { to: '/member', text: '個人頁面', icon: 'mdi-account-details', show: userstore.isLoggedIn },
    {
      to: '/admin',
      text: '管理員頁面',
      icon: 'mdi-account-cog',
      show: userstore.isLoggedIn && userstore.isAdmin,
    },
  ]
})

const logout = async () => {
  try {
    await apiAuth.delete('/user/logout')
  } catch (error) {
    console.log('Layout.default.logout', error)
  }
  userstore.logout()
  createSnackbar({
    text: '已成功登出',
    snackbarProps: {
      color: 'blue',
    },
  })
}
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
