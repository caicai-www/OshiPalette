<template>
  <v-container class="text-center">
    <h1 class="text-center justify-center py-6">我的照片牆/收藏</h1>

    <v-tabs v-model="currentTab" color="black" grow>
      <v-tab v-for="item in tabs" :key="item.text" :value="item.text">{{ item.title }}</v-tab>
    </v-tabs>

    <v-tabs-window v-model="currentTab">
      <!-- 照片頁面-->
      <v-tabs-window-item value="photo">
        <v-card>
          <v-card-text>這是照片頁面的內容</v-card-text>
        </v-card>
        <v-container>
          <v-toolbar>
            <v-row>
              <v-col cols="12" md="1" class="bg-warning">
                <v-btn variant="outlined" @click="openDialog(null)">新增貼文</v-btn>
              </v-col>
              <v-col cols="12" md="10">
                <color-option></color-option>
              </v-col>
            </v-row>
          </v-toolbar>

          <v-row class="mt-5">
            <v-col v-for="post in posts" :key="post._id" cols="12" md="4" lg="3">
              <post-card v-bind="post"></post-card>
            </v-col>
          </v-row>
        </v-container>
      </v-tabs-window-item>

      <!-- 收藏頁面 -->
      <v-tabs-window-item value="collection">
        <v-card>
          <v-card-text>這是收藏頁面的內容</v-card-text>
          <v-row class="mt-5">
            <v-col v-for="favorite in favorites" :key="favorite._id" cols="12" md="4" lg="3">
              <post-card v-bind="favorite.post"></post-card>
            </v-col>
          </v-row>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>

  <!-- Dialog 新增貼文、編輯貼文 -->
  <v-dialog v-model="dialog.open" persistent>
    <v-form :disabled="isSubmitting" @submit.prevent="submit">
      <v-card>
        <v-card-title>新增貼文</v-card-title>
        <v-card-text>
          <VueFileAgent
            ref="fileAgent"
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

          <v-text-field
            v-model="title.value.value"
            :label="'標題'"
            :error-messages="title.errorMessage.value"
          ></v-text-field>
          <v-textarea
            v-model="content.value.value"
            :label="'內容'"
            :error-messages="content.errorMessage.value"
          ></v-textarea>

          <!-- 顏色選單 -->
          <v-select
            v-model="colors.value.value"
            chips
            :items="colorOptions"
            :label="'顏色'"
            :error-messages="colors.errorMessage.value"
            item-value="value"
            item-title="text"
          >
            <template #selection="{ item }">
              <v-chip :color="item.value" dark>
                <v-avatar left>
                  <span
                    :style="{
                      backgroundColor: item.value,
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'inline-block',
                    }"
                  ></span>
                </v-avatar>
                {{ item.text }}
              </v-chip>
            </template>

            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-avatar size="20">
                    <span
                      :style="{
                        backgroundColor: item.value,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'inline-block',
                      }"
                    ></span>
                  </v-avatar>
                </template>
                {{ item.text }}
              </v-list-item>
            </template>
          </v-select>

          <!-- https://vuetifyjs.com/en/components/combobox/#advanced-custom-options -->
          <!-- 標籤tag選單  combobox-->
          <v-combobox
            v-model="tags.value.value"
            v-model:search="search"
            :error-messages="tags.errorMessage.value ? [tags.errorMessage.value] : []"
            :custom-filter="filter"
            :items="items"
            label="標籤"
            variant="solo"
            hide-selected
            multiple
          >
            <template #selection="{ item, index }">
              <v-chip
                v-if="item === Object(item)"
                :color="`${item.raw.color}-lighten-3`"
                :text="item.title"
                size="small"
                variant="flat"
                closable
                label
                @click:close="removeSelection(index)"
              ></v-chip>
            </template>
            <template #item="{ props, item }">
              <v-list-item v-if="item.raw.header && search">
                <span class="mr-3">Create</span>
                <v-chip :color="`${colors[nonce - 1]}-lighten-3`" size="small" variant="flat" label>
                  {{ search }}
                </v-chip>
              </v-list-item>
              <v-list-subheader v-else-if="item.raw.header" :title="item.title"></v-list-subheader>
              <v-list-item v-else @click="props.onClick">
                <v-text-field
                  v-if="editingItem === item.raw"
                  v-model="editingItem.title"
                  bg-color="transparent"
                  class="mr-3"
                  density="compact"
                  variant="plain"
                  autofocus
                  hide-details
                  @click.stop
                  @keydown.stop
                  @keyup.enter="edit(item.raw)"
                ></v-text-field>
                <v-chip
                  v-else
                  :color="`${item.raw.color}-lighten-3`"
                  :text="item.raw.title"
                  variant="flat"
                  label
                ></v-chip>
                <template #append>
                  <v-btn
                    :color="editingItem !== item.raw ? 'primary' : 'success'"
                    :icon="editingItem !== item.raw ? 'mdi-pencil' : 'mdi-check'"
                    size="small"
                    variant="text"
                    @click.stop.prevent="edit(item.raw)"
                  ></v-btn>
                </template>
              </v-list-item>
            </template>
          </v-combobox>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog">關閉視窗</v-btn>
          <v-btn type="submit" :loading="isSubmitting">確認送出</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAxios } from '@/composables/axios'
import PostCard from '@/components/PostCard.vue'
import ColorOption from '@/components/ColorOption.vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useSnackbar } from 'vuetify-use-dialog'
import { useUserStore } from '@/stores/user'

const { apiAuth } = useAxios()
const createSnackbar = useSnackbar()

const currentTab = ref('photo')
const posts = ref([])
const user = useUserStore()

// 上傳圖片 fileRAgent
const fileAgent = ref(null)
const fileRecords = ref([])
const rawFileRecords = ref([])

// dialog視窗
const dialog = ref({
  open: false,
  id: '',
})

const openDialog = (item) => {
  if (item) {
    dialog.value.id = item._id
    title.value.value = item.title
    content.value.value = item.content
    colors.value.value = item.colors
    tags.value.value = item.tags
  }
  dialog.value.open = true
}

const closeDialog = () => {
  resetForm()
  dialog.value.id = ''
  dialog.value.open = false
  fileAgent.value.deleteFileRecord()
}

// tabs分頁區

const tabs = computed(() => {
  return [
    { title: '照片', text: 'photo' },
    { title: '收藏', text: 'collection' },
  ]
})

// 貼文區
// 取資料
const getPost = async () => {
  try {
    const { data } = await apiAuth.get('/post')
    posts.value.push(...data.result)
    // console.log(data.result)
  } catch (error) {
    console.log('pages.user.oshigram.getPost', error)
  }
}

getPost()

const schema = yup.object({
  title: yup.string().required('標題必填').min(2, '標題太短').max(20, '標題太長'),
  content: yup.string().required('內容必填').min(2, '內容太短'),
  colors: yup
    .string()
    .required('顏色必填')
    .oneOf(
      ['red', 'pink', 'orange', 'blue', 'green', 'yellow', 'purple', 'white', 'black'],
      '顏色分類不存在',
    ),
  tags: yup.array().of(yup.string().required('每個標籤都必須是字符串')).max(5, '最多輸入五個標籤'),
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
})

const title = useField('title')
const content = useField('content')
const colors = useField('colors')
const tags = useField('tags')

const colorOptions = [
  {
    text: '紅色',
    value: 'red',
  },
  {
    text: '粉紅色',
    value: 'pink',
  },
  {
    text: '橘色',
    value: 'orange',
  },
  {
    text: '藍色',
    value: 'blue',
  },
  {
    text: '綠色',
    value: 'green',
  },
  {
    text: '黃色',
    value: 'yellow',
  },
  {
    text: '紫色',
    value: 'purple',
  },
  {
    text: '白色',
    value: 'white',
  },
  {
    text: '黑色',
    value: 'black',
  },
]

// comobox標籤選單
const removeSelection = (index) => {
  if (tags.value.value.length > index) {
    tags.value.value.splice(index, 1)
  }
}

const submit = handleSubmit(async (values) => {
  if (fileRecords.value.values[0]?.error) return
  if (dialog.value.id.length === 0 && fileRecords.value[0].error) {
    createSnackbar({
      text: '請上傳圖片',
      snackbarProps: {
        color: 'red',
      },
    })
    return
  }
  try {
    const fd = new FormData()
    fd.append('title', values.title)
    fd.append('content', values.content)
    fd.append('colors', values.colors)
    fd.append('author', user.id)
    values.tags.forEach((tag) => {
      fd.append('tags[]', tag) // 傳遞每個 tag 作為單獨的欄位
    })
    // console.log(values.tags)
    // console.log(tags.value.value)
    // console.log(user.id)

    if (fileRecords.value.length > 0) {
      fd.append('image', fileRecords.value[0].file)
    }

    await apiAuth.post('/post', fd)

    posts.value.splice(0, posts.value.length)
    getPost()
    createSnackbar({
      text: '成功新增貼文',
      snackbarProps: {
        color: 'green',
      },
    })

    closeDialog()
  } catch (error) {
    console.log('pages.user.oshigram:', error)
    createSnackbar({
      text: '新增貼文失敗',
      snackbarProps: {
        color: 'red',
      },
    })
  }
})

// 收藏區
const favorites = ref([])

const getFavorite = async () => {
  try {
    const { data } = await apiAuth.get('user/favorites')
    favorites.value = data.result
    console.log(favorites)
  } catch (error) {
    console.log('pages.user.oshigram.getFavorite', error)
  }
}

getFavorite()
</script>

<route lang="yaml">
meta:
  layout: user
  login: true
  title: '我的照片牆/收藏'
</route>
