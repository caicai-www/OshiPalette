<template>
  <v-container class="pa-5 bg-info">
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">個人資料</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="3" class="bg-secondary">大頭貼</v-col>
      <v-col cols="9" class="bg-primary">
        <v-row>
          <v-col cols="2">
            <v-list-subheader>暱稱:</v-list-subheader>
          </v-col>
          <v-col cols="5"><v-text-field></v-text-field></v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <v-list-subheader>生日:</v-list-subheader>
          </v-col>
          <v-col cols="5">
            <v-date-input label="Date input" prepend-icon=""></v-date-input>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">照片上傳</v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { VDateInput } from 'vuetify/labs/VDateInput'
</script>

<route lang="yaml">
meta:
  layout: user
  login: true
  title: '會員中心'
</route>
