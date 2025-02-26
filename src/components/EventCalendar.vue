<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" md="10">
        <vue-cal
          style="height: 1000px"
          :time="false"
          :selected-date="today"
          :disable-views="['years', 'year', 'week', 'day']"
          :show-all-day-events="true"
          :events-on-month-view="true"
          :events="events"
          :on-event-click="onEventClick"
        >
        </vue-cal
      ></v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// https://antoniandre.github.io/vue-cal-v4/

import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

import { ref } from 'vue'
import { useAxios } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'

const router = useRouter()

const { api } = useAxios()
const createSnackbar = useSnackbar()

const today = new Date()

const events = ref([])

const emit = defineEmits(['updateEvents'])

// 取得活動資料
const getEvent = async () => {
  try {
    const { data } = await api.get('/calendar')
    // console.log(data.result)
    events.value = data.result.map((event) => ({
      start: new Date(event.start).toISOString().split('T')[0],
      end: new Date(event.end).toISOString().split('T')[0],
      title: event.title, // 事件標題
      description: event.description, // 事件描述
      location: event.location, // 事件地點
      id: event._id,
      image: event.image,
      createdAt: new Date(event.createdAt).toISOString().split('T')[0],
    }))

    emit('updateEvents', events.value)

    // console.log(events.value)
  } catch (error) {
    console.log('components.eventCalendar:', error)
    createSnackbar({
      text: error?.response?.data?.message || '未知錯誤',
      snackbarProps: {
        color: 'red',
      },
    })
  }
}

getEvent()

// 點擊活動事件
const onEventClick = (event) => {
  // console.log('活動ID', event.id)
  router.push('/calendar/' + event.id)
}
</script>
