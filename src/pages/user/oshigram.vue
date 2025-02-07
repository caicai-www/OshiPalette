<template>
  <v-card color="primary" class="text-center">
    <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-bold text-h5">我的照片牆/收藏</h1>
    </v-card-title>

    <v-tabs v-model="currentTab" color="black" grow>
      <v-tab v-for="item in tabs" :key="item" :value="item">{{ item.title }}</v-tab>
    </v-tabs>

    <v-tabs-window v-model="currentTab">
      <v-tabs-window-item v-for="item in tabs" :key="item" :value="item">
        <v-card flat>
          <v-card-text>
            {{ item.text }}
          </v-card-text>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue'

const currentTab = ref('照片')

const tabs = computed(() => {
  return [
    { title: '照片', text: 'photo' },
    { title: '收藏', text: 'collection' },
  ]
})
</script>

<route lang="yaml">
meta:
  layout: user
  login: true
  title: '會員中心'
</route>
