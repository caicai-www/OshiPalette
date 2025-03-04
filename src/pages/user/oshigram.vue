<template>
  <v-container class="text-center">
    <h1 class="text-center justify-center py-6">我的照片牆/收藏</h1>

    <v-tabs v-model="currentTab" align-tabs="start">
      <v-tab
        v-for="item in tabs"
        :key="item.text"
        :value="item.text"
        :prepend-icon="item.icon"
        stacked
        class="tab-title"
        selected-class="selected"
        >{{ item.title }}
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="currentTab" class="tab-window">
      <!-- 照片頁面-->
      <v-tabs-window-item value="photo">
        <v-row>
          <v-col cols="12">
            <v-btn rounded="xl" class="button" @click="openDialog(null)">新增貼文</v-btn>

            <color-option @color-selected="filterPostsByColor"></color-option>
          </v-col>
        </v-row>

        <v-row class="mt-5 justify-center">
          <v-col v-for="post in filteredPosts" :key="post._id" cols="12" md="2" class="mx-2 my-2">
            <post-card v-bind="post"></post-card>
          </v-col>
        </v-row>
      </v-tabs-window-item>

      <!-- 收藏頁面 -->
      <v-tabs-window-item value="collection">
        <v-card-text>這是收藏頁面的內容</v-card-text>
        <v-row class="mt-5">
          <v-col
            v-for="favorite in favorites"
            :key="favorite._id"
            cols="12"
            md="2"
            class="mx-2 my-2"
          >
            <post-card v-bind="favorite.post"></post-card>
          </v-col>
        </v-row>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>

  <!-- Dialog 新增貼文、編輯貼文 -->
  <v-dialog v-model="dialog.open" persistent max-width="1200px">
    <v-form :disabled="isSubmitting" @submit.prevent="submit">
      <v-card :style="useStyle.containerStyle" class="bg pa-10 rounded-xl">
        <v-card-title>新增貼文</v-card-title>
        <v-row>
          <v-col cols="12" md="4">
            <VueFileAgent
              ref="fileAgent"
              v-model="fileRecords"
              v-model:raw-model-value="rawFileRecords"
              accept="image/jpeg,image/png"
              deletable
              max-size="1MB"
              :help-text="'點擊或拖曳圖片至此'"
              :error-text="{
                type: '檔案類型錯誤',
                size: '檔案大小超過限制',
              }"
            >
            </VueFileAgent>
          </v-col>
          <v-col cols="12" md="8">
            <v-card-text>
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
                  <v-chip :color="item.value">
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
                    <v-chip
                      :color="`${colors[nonce - 1]}-lighten-3`"
                      size="small"
                      variant="flat"
                      label
                    >
                      {{ search }}
                    </v-chip>
                  </v-list-item>
                  <v-list-subheader
                    v-else-if="item.raw.header"
                    :title="item.title"
                  ></v-list-subheader>
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
              </v-combobox> </v-card-text
          ></v-col>
        </v-row>

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
import { useThemeStore } from '@/stores/style'

const { apiAuth } = useAxios()
const createSnackbar = useSnackbar()
const useStyle = useThemeStore()

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
  if (!user.post) {
    createSnackbar({
      text: '無發文權限',
      snackbarProps: {
        color: 'red',
      },
    })
    return
  }
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
    { title: '我的貼文', text: 'photo', icon: 'mdi-image' },
    { title: '我的收藏', text: 'collection', icon: 'mdi-heart' },
  ]
})

// 貼文區
// 取資料
const getPost = async () => {
  try {
    const { data } = await apiAuth.get('/post')
    posts.value.push(...data.result)
    filteredPosts.value.push(...data.result)
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
    filteredPosts.value.splice(0, filteredPosts.value.length)
    getPost()
    createSnackbar({
      text: '成功新增貼文',
      snackbarProps: {
        color: 'green-darken-1',
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
    // console.log(favorites)
  } catch (error) {
    console.log('pages.user.oshigram.getFavorite', error)
  }
}

getFavorite()

// 過濾顏色
const filteredPosts = ref([])
const filterPostsByColor = (color) => {
  // console.log('選擇的顏色:', color) // 確保選擇顏色有傳進來
  if (!color) {
    filteredPosts.value = [...posts.value]
  } else if (color === 'all') {
    filteredPosts.value = [...posts.value]
  } else {
    filteredPosts.value = posts.value.filter(
      (post) => post.colors?.toLowerCase() === color.toLowerCase(),
    )
  }
  // console.log('過濾後的貼文:', filteredPosts.value) // 檢查過濾後的結果
}
console.log('所有貼文', filteredPosts)
</script>

<style scoped>
.tab-window {
  background: rgba(189, 189, 189, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
  backdrop-filter: hue-rotate(80deg) saturate(-20%) blur(15px);
  border-radius: 0px 10px 30px 30px;
  box-shadow: 0px 20px 15px rgba(0, 0, 0, 0.2);
  padding: 2rem;
}

.tab-title {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: rgba(189, 189, 189, 0.3);
  backdrop-filter: hue-rotate(80deg) saturate(-20%);
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

.selected {
  background: rgba(189, 189, 189, 0.3);
  backdrop-filter: hue-rotate(100deg) saturate(100%);
}

.bg {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>

<route lang="yaml">
meta:
  layout: user
  login: true
  title: '我的照片牆/收藏'
</route>
