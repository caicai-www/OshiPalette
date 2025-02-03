<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">會員文章管理</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <v-data-table :items="posts" :headers="headers">
          <template #[`item.image`]="{ value }">
            <v-img :src="value" height="50"></v-img>
          </template>
          <!-- <template #[`item.author`]="{ value }">
            <v-img :src="value" height="50"></v-img>
          </template> -->
          <!-- v-chip -->
          <!-- https://vuetifyjs.com/en/components/chips/#color-and-variants -->
          <template #[`item.colors`]="{ value }">
            <v-chip :color="value" variant="flat"></v-chip>
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
import { useSnackbar } from 'vuetify-use-dialog'
import { reactive, computed } from 'vue'

const { apiAuth } = useAxios()
const createSnackbar = useSnackbar()

const posts = reactive([])
// 定義表格有哪些欄位
const headers = computed(() => {
  return [
    { title: '標題', key: 'title', sortable: true },
    { title: '作者', key: 'author', sortable: false },
    { title: '圖片', key: 'image', sortable: false },
    { title: '內容', key: 'content', sortable: false },
    { title: '標籤', key: 'tags', sortable: true },
    { title: '顏色', key: 'colors', sortable: true },
    { title: '上傳日期', key: 'createdAt', sortable: true },
  ]
})

const getPost = async () => {
  try {
    const { data } = await apiAuth.get('/post')
    posts.push(...data.result)
  } catch (error) {
    console.log('pages.admin.post:', error)
    createSnackbar({
      text: error?.response?.data?.message || '未知錯誤',
      snackbarProps: {
        color: 'red',
      },
    })
  }
}

getPost()
</script>

<route lang="yaml">
meta:
  layout: admin
  login: true
  admin: true
  title: '管理後台'
</route>
