<template>
  <v-app>
    <EventCalendar />
  </v-app>
</template>

<script setup>
import EventCalendar from '@/components/EventCalendar.vue'
</script>


<route lang="yaml">
meta:
  login: false
  admin: false
  title: '活動月曆'
</route>
