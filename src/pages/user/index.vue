<template>
  <v-container class="pa-5">
    <v-row class="justify-center">
      <v-col cols="12">
        <h1 class="text-center">個人資料</h1>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-form>
      <v-card class="pa-5">
        <v-row class="justify-center">
          <v-col cols="3">
            <p>頭像:</p>
            <VueFileAgent
              v-model="fileRecords"
              v-model:raw-model-value="rawFileRecords"
              accept="image/jpeg,image/png"
              deletable
              max-size="1MB"
              :help-text="'點擊或拖曳檔案至此'"
              :error-text="{
                type: '檔案類型錯誤',
                size: '檔案大小超過限制',
              }"
            >
            </VueFileAgent>
          </v-col>
          <v-col cols="7">
            <v-row>
              <v-col cols="3">
                <v-list-subheader>暱稱:</v-list-subheader>
              </v-col>
              <v-col cols="5"><v-text-field></v-text-field></v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-list-subheader>生日:</v-list-subheader>
              </v-col>
              <v-col cols="5">
                <v-date-input label="Date input" prepend-icon=""></v-date-input>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn type="submit">更新</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'

const fileRecords = ref([])
const rawFileRecords = ref([])
</script>

<route lang="yaml">
meta:
  layout: user
  login: true
  title: '會員中心'
</route>
