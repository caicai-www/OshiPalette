<template>
  <v-container>
    <vue-cal
      selected-date="2019-02-11"
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
import 'vue-cal/dist/vuecal.css'

const events = [
  {
    start: '2019-02-12',
    end: '2019-02-12',
    title: 'Day off!',
    content: '<i class="icon material-icons">beach_access</i>',
    class: 'yellow-event',
    allDay: true,
  },
  {
    start: '2019-02-14',
    end: '2019-02-14',
    title: "Valentine's day",
    content: '<i class="icon material-icons">favorite_outline</i>',
    class: 'pink-event',
    allDay: true,
  },
]
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
