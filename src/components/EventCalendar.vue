<template>
  <v-container>
    <vue-cal
      :selected-date="today"
      :time-from="7 * 60"
      :disable-views="['years', 'year', 'week', 'day']"
      :show-all-day-events="true"
      :events-on-month-view="true"
      :events="events"
    >
    </vue-cal>
  </v-container>
</template>

<script setup>
// https://antoniandre.github.io/vue-cal-v4/

import VueCal from 'vue-cal'
import { ref } from 'vue'
import { useAxios } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

const { api } = useAxios()
const createSnackbar = useSnackbar()

const today = new Date()

const events = ref([])

const getEvent = async () => {
  try {
    const { data } = await api.get('/calendar')
    events.value = data.result.map((event) => ({
      start: new Date(event.start).toISOString().split('T')[0],
      end: new Date(event.end).toISOString().split('T')[0],
      title: event.title, // 事件標題
      description: event.description, // 事件描述
      location: event.location, // 事件地點
      allDay: event.allDay, // 是否為全天事件
    }))
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
</script>

<style scoped>
.vuecal__cell-content {
  align-self: flex-start;
}
.vuecal__cell-date {
  text-align: right;
  padding: 4px;
}

.vuecal--week-view .vuecal__bg .vuecal__event--all-day.pink-event,
.vuecal--day-view .vuecal__bg .vuecal__event--all-day.pink-event {
  right: 50%;
}
.vuecal--week-view .vuecal__bg .vuecal__event--all-day.leisure,
.vuecal--day-view .vuecal__bg .vuecal__event--all-day.leisure {
  left: 50%;
}
</style>
