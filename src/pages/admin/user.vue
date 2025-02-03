<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">會員管理中心</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <v-data-table :items="users">
          <template #[`item.icon`]="{ value }">
            <v-img :src="value" height="50"></v-img>
          </template>

          <template #[`item.post`]="{ value }">
            <v-icon v-if="value" icon="mdi-check"></v-icon>
          </template>

          <template #[`item.reply`]="{ value }">
            <v-icon v-if="value" icon="mdi-check"></v-icon>
          </template>

          <template #[`item.createdAt`]="{ value }">
            {{ new Date(value).toLocaleString() }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAxios } from '@/composables/axios'
import { reactive } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'

const { apiAuth } = useAxios()
const createSnackbar = useSnackbar()

const users = reactive([])

const getUsers = async () => {
  try {
    const { data } = await apiAuth.get('/user')
    users.push(...data.result)
  } catch (error) {
    console.log('pages.user.getUsers:', error)
    createSnackbar({
      text: error?.response?.data?.message || '未知錯誤',
      snackbarProps: {
        color: 'red',
      },
    })
  }
}

getUsers()
</script>

<route lang="yaml">
meta:
  layout: admin
  login: true
  admin: true
  title: '管理後台'
</route>
