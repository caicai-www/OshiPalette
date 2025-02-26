<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">會員文章管理</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <v-data-table :items="posts" :headers="headers" class="glass-card pa-4" :search="search">
          <template #top>
            <v-toolbar class="glass-card">
              <v-text-field
                v-model="search"
                variant="underlined"
                class="pa-2 my-auto"
                density="comfortable"
                placeholder="搜尋"
                prepend-icon="mdi-account-search"
              ></v-text-field>
            </v-toolbar>
          </template>

          <template #[`item.image`]="{ value }">
            <v-img :src="value" height="50"></v-img>
          </template>

          <template #[`item.author`]="{ value }">
            {{ value.name }}
          </template>

          <template #[`item.colors`]="{ value }">
            <v-chip :color="value" variant="flat"></v-chip>
          </template>

          <template #[`item.display`]="{ value }">
            <v-icon v-if="value" icon="mdi-check"></v-icon>
            <v-icon v-else icon="mdi-close"></v-icon>
          </template>

          <template #[`item.createdAt`]="{ value }">
            {{ new Date(value).toLocaleString() }}
          </template>

          <template #[`item.edit`]="{ item }">
            <v-btn
              icon="mdi-account-box-edit-outline"
              variant="text"
              @click="openDialog(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="dialog.open" max-width="1000px">
    <v-form :disabled="isSubmitting" @submit.prevent="submit">
      <v-card :style="useStyle.containerStyle" class="bg pa-10 rounded-xl">
        <v-card-title class="list_bg text-center mb-5">管理文章</v-card-title>
        <v-row>
          <v-col cols="12" md="6">
            <v-img :src="dialog.image"></v-img>
          </v-col>
          <v-col cols="12" md="6">
            <v-card-text>
              <v-text-field v-model="dialog.author" label="作者" readonly> </v-text-field>
              <v-text-field v-model="dialog.title" label="標題" readonly> </v-text-field>
              <v-text-field v-model="dialog.content" label="內容" readonly> </v-text-field>

              <v-checkbox
                v-model="display.value.value"
                label="是否顯示"
                :true-value="true"
                :false-value="false"
              ></v-checkbox>
            </v-card-text>
          </v-col>
        </v-row>

        <v-card-actions>
          <v-btn @click="closeDialog">取消編輯</v-btn>
          <v-btn type="submit" :loading="isSubmitting">確認編輯</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { useAxios } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { ref, reactive, computed } from 'vue'
import { useThemeStore } from '@/stores/style'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const { apiAuth } = useAxios()
const createSnackbar = useSnackbar()
const useStyle = useThemeStore()

const search = ref('')

const posts = reactive([])
// 定義表格有哪些欄位
const headers = computed(() => {
  return [
    { title: '作者', key: 'author', sortable: true },
    { title: '標題', key: 'title', sortable: true },
    { title: '圖片', key: 'image', sortable: false },
    { title: '內容', key: 'content', sortable: false },
    { title: '顏色', key: 'colors', sortable: true },
    { title: '上傳日期', key: 'createdAt', sortable: true },
    { title: '是否顯示', key: 'display', sortable: true },
    { title: '管理', key: 'edit', sortable: false },
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

// 編輯表單
const schema = yup.object({
  display: yup.boolean(),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
})

const display = useField('display')

const submit = handleSubmit(async (values) => {
  try {
    await apiAuth.patch('post/' + dialog.value.id, {
      display: values.display,
    })

    // 更新現在的 posts 陣列
    const index = posts.findIndex((post) => post._id === dialog.value.id)
    if (index !== -1) {
      posts[index].display = values.display
    }

    closeDialog()
    createSnackbar({
      text: '編輯顯示狀態成功',
      snackbarProps: {
        color: 'blue',
      },
    })
  } catch (error) {
    console.log('page.user.submit:', error)
    createSnackbar({
      text: '編輯顯示狀態失敗',
      snackbarProps: {
        color: 'red',
      },
    })
  }
})

// 編輯用dialog
const dialog = ref({
  open: false,
  id: '',
  title: '',
  author: '',
  image: '',
  content: '',
  colors: '',
  display: '',
})

const openDialog = (item) => {
  dialog.value.open = true
  dialog.value.id = item._id
  dialog.value.title = item.title
  dialog.value.author = item.author.name
  dialog.value.image = item.image
  dialog.value.content = item.content
  display.value.value = item.display
}

const closeDialog = () => {
  dialog.value.open = false
}
</script>

<route lang="yaml">
meta:
  layout: admin
  login: true
  admin: true
  title: '管理後台'
</route>
