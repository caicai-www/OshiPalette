<template>
  <v-container>
    <h1 class="text-center justify-center py-6">我的活動月曆</h1>
    <vue-cal
      style="height: 700px"
      :time="false"
      :selected-date="today"
      :disable-views="['years', 'year', 'week', 'day']"
      :show-all-day-events="true"
      :events-on-month-view="true"
      :events="events"
    >
    </vue-cal>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useAxios } from '@/composables/axios'

import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

const { apiAuth } = useAxios()

const today = new Date()
const events = ref([])

const getEvent = async () => {
  try {
    const { data } = await apiAuth.get('user/calendar')
    events.value = data.result.map((item) => ({
      start: new Date(item.event.start).toISOString().split('T')[0],
      end: new Date(item.event.end).toISOString().split('T')[0],
      title: item.event.title, // 事件標題
      description: item.event.description || '', // 事件描述，避免 undefined
      location: item.event.location || '', // 事件地點，避免 undefined
      id: item.event._id, // 事件的 _id
      image: item.event.image || '', // 事件圖片，避免 undefined
    }))
    console.log(events)
  } catch (error) {
    console.log('pages.user.calendar.getEvent', error)
  }
}

getEvent()
</script>

<style>
.vuecal__event {
  background: rgba(207, 207, 207, 0.2);
  backdrop-filter: hue-rotate(180deg) saturate(100%);
  border-radius: 30px;
  padding: 16px;
  box-shadow: 0px 20px 15px rgba(0, 0, 0, 0.1);
}

.vuecal__event:hover {
  background: rgba(207, 207, 207, 0.3);
  backdrop-filter: hue-rotate(80deg);
}
</style>

<route lang="yaml">
meta:
  layout: user
  login: true
  title: '我的活動月曆'
</route>
