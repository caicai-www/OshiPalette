<template>
  <v-container>
    <!-- 活動資訊區 -->
    <v-card class="glass-card">
      <v-row>
        <v-col v-if="isPortrait" cols="12" md="5" class="d-flex align-start">
          <img :src="calendar.image" class="img ms-10" @load="onImageLoad" />
        </v-col>
        <v-col v-if="!isPortrait" cols="12" md="7" class="d-flex align-start">
          <img :src="calendar.image" class="img ms-10" @load="onImageLoad" />
        </v-col>
        <v-col cols="12" md="4" class="ms-5">
          <v-card-item>
            <h3>{{ calendar.title }}</h3>
            <v-card-text>
              <v-icon icon="mdi-calendar"></v-icon>日期: {{ calendar.start }}
            </v-card-text>

            <v-card-text>
              <v-icon icon="mdi-map-marker"></v-icon>地點: {{ calendar.location }}
              <a
                :href="
                  'https://www.google.com/maps/search/?api=1&query=' +
                  encodeURIComponent(calendar.location)
                "
                target="_blank"
              >
                <v-icon>mdi-map-marker</v-icon>
              </a>
            </v-card-text>
            <v-btn v-if="!isJoin" class="button rounded-xl ma-5" @click="toggleEvent"
              >將活動加進行事曆</v-btn
            >
            <v-btn v-else class="button rounded-xl ma-5" @click="toggleEvent">取消參加活動</v-btn>
          </v-card-item>
          <p v-if="isPortrait" class="ma-10 description">{{ calendar.description }}</p>
        </v-col>
        <v-col v-if="!isPortrait" cols="12" md="12">
          <p class="ma-10 description">{{ calendar.description }}</p>
        </v-col>
      </v-row>
    </v-card>

    <!-- 討論串區 -->
    <v-card class="glass-card pt-10">
      <h2 class="d-sm-inline-block ma-5">Message Board</h2>
      <v-btn class="button rounded-xl ma-5" @click="openaddTopicDialog(null)">新增討論串</v-btn>
      <v-divider class="my-5"></v-divider>
      <v-list v-if="topics.length > 0" class="ma-5 bg-transparent">
        <v-list-item
          v-for="topic in topics"
          :key="topic._id"
          prepend-icon="mdi-chevron-down-box-outline"
        >
          <v-list-item-title class="text-decoration-underline" @click="openTopicDialog(topic)">{{
            topic.title
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <p v-else class="ma-5">尚無討論串</p>
    </v-card>

    <!-- 新增討論串dialog -->
    <v-dialog v-model="addTopicDialog.open" persistent max-width="600px">
      <v-form :disabled="isSubmitting" @submit.prevent="submitTopic">
        <v-card class="bg pa-10 rounded-xl">
          <v-card-title>新增討論串</v-card-title>

          <v-card-text>
            <v-text-field
              v-model="title.value.value"
              label="主旨"
              :error-messages="title.errorMessage.value"
            ></v-text-field>
            <v-textarea
              v-model="content.value.value"
              label="內容"
              :error-messages="content.errorMessage.value"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn class="button rounded-xl ma-5" @click="closeaddTopicDialog">取消</v-btn>
            <v-btn type="submit" :loading="isSubmitting" class="button rounded-xl ma-5">送出</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- 開啟討論串內容 -->
    <v-dialog v-model="TopicDialog.open" max-width="1000px">
      <v-card class="pa-15 bg rounded-xl">
        <v-row class="glass-card">
          <v-col cols="12" md="3">
            <v-img :src="TopicDialog.icon" height="100" class="mx-auto rounded-circle"></v-img>
            <p class="text-center">{{ TopicDialog.name }}</p>
          </v-col>
          <v-col cols="12" md="9">
            <h3>{{ TopicDialog.title }}</h3>
            <p class="ms-2 my-5">{{ TopicDialog.content }}</p>
          </v-col>
        </v-row>

        <v-row class="glass-card">
          <v-col>
            <!-- 話題串留言內容 -->

            <v-list v-if="TopicDialog.reply.length > 0" class="bg-transparent">
              <v-list-item
                v-for="topicReply in TopicDialog.reply"
                :key="topicReply"
                class="mb-5 d-flex flex-row-reverse"
              >
                <v-list-item-content class="d-flex flex-row-reverse">
                  <v-avatar v-if="topicReply.user.image === undefined" color="info">
                    <v-icon icon="mdi-account"> </v-icon>
                  </v-avatar>
                  <v-avatar v-else>
                    <v-img :src="topicReply.user.image"></v-img>
                  </v-avatar>

                  <v-list-item-title class="reply-card me-3">{{
                    topicReply.reply
                  }}</v-list-item-title>
                </v-list-item-content>

                <v-list-item-subtitle class="text-right mt-1">{{
                  topicReply.user.name
                }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <p v-else class="ma-5">尚無回覆，快來加入討論吧!</p>

            <!-- 話題串留言框 -->
            <v-form :disabled="isReplySubmitting" @submit.prevent="submitReply">
              <v-textarea
                v-model="reply.value.value"
                class="py-10"
                label="請輸入留言"
                :error-messages="reply.errorMessage.value"
              ></v-textarea>
              <v-btn type="submit" :loading="isReplySubmitting" class="button rounded-xl ma-5"
                >送出</v-btn
              >
            </v-form>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useAxios } from '@/composables/axios'
import { useRoute, useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'

import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

import { useUserStore } from '@/stores/user'

const { api, apiAuth } = useAxios()
const route = useRoute()
const router = useRouter()
const createSnackbar = useSnackbar()

const user = useUserStore()

// console.log(route.params.id)

// 取得活動
const calendar = ref({
  title: '',
  start: '',
  time: '',
  location: '',
  description: '',
  image: '',
})

const getCalendar = async () => {
  try {
    const { data } = await api.get('/calendar/' + route.params.id)
    calendar.value = data.result
    calendar.value.start = new Date(calendar.value.start).toLocaleString().split('T')[0].slice(0, 9)
  } catch (error) {
    console.log('pages.[id].getcalendar:', error)
    router.push('/')
    createSnackbar({
      text: error?.response?.data?.message || '未知錯誤',
      snackbarProps: {
        color: 'red',
      },
    })
  }
}

getCalendar()

// 新增討論串
const addTopicDialog = ref({
  open: false,
  id: '',
})

const openaddTopicDialog = () => {
  if (!user.isLoggedIn) {
    createSnackbar({
      text: '尚未登入，請先登入才能新增討論串',
      snackbarProps: {
        color: 'red',
      },
    })
    router.push('/login') // 導向登入頁
    return
  } else if (!user.post) {
    createSnackbar({
      text: '無發文權限',
      snackbarProps: {
        color: 'red',
      },
    })
    return
  }

  addTopicDialog.value.open = true
}

const closeaddTopicDialog = () => {
  resetForm()
  addTopicDialog.value.id = ''
  addTopicDialog.value.open = false
}

// 討論串的表單
const schema = yup.object({
  title: yup.string().required('話題串標題必填').max(20, '標題太長'),
  content: yup.string().required('話題串內容必填').max(200, '內容文字最多200字'),
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
})

const title = useField('title')
const content = useField('content')

const submitTopic = handleSubmit(async (values) => {
  try {
    await apiAuth.post('/calendarTopic', {
      title: values.title,
      content: values.content,
      user: user.id,
      calendar: route.params.id,
    })
    createSnackbar({
      text: '新增討論串成功',
      snackbarProps: {
        color: 'success',
      },
    })
    resetForm()
    addTopicDialog.value.open = false
    getTopics()
  } catch (error) {
    console.log('pages.calendar.[id].submit:', error)
    createSnackbar({
      text: error?.response?.data?.message || '新增討論串失敗',
      snackbarProps: {
        color: 'red',
      },
    })
  }
})

// 取討論串資料
const topics = reactive([])

const getTopics = async () => {
  try {
    const { data } = await api.get('/calendarTopic', { params: { calendar: route.params.id } })
    topics.splice(0, topics.length, ...data.result)
    if (TopicDialog.value.id) {
      const topic = topics.find((topic) => topic._id === TopicDialog.value.id)
      if (topic) {
        TopicDialog.value.reply = topic.reply
      }
    }
    // console.log(topics)
  } catch (error) {
    console.log('pages.calendar.[id].getTopics:', error)
    createSnackbar({
      text: error?.response?.data?.message || '未知錯誤',
      snackbarProps: {
        color: 'red',
      },
    })
  }
}

getTopics()

// console.log(topics)

// 開啟討論串內容
const TopicDialog = ref({
  open: false,
  id: '',
  title: '',
  content: '',
  name: '',
  icon: '',
  reply: [],
})

const openTopicDialog = (topic) => {
  TopicDialog.value.id = topic._id
  TopicDialog.value.title = topic.title
  TopicDialog.value.content = topic.content
  TopicDialog.value.reply = topic.reply
  TopicDialog.value.name = topic.user.name
  TopicDialog.value.icon = topic.user.image

  console.log(TopicDialog.value)

  TopicDialog.value.open = true
}

// 討論串回覆表單
const replySchema = yup.object({
  reply: yup.string().required('回覆內容必填').max(200, '內容最多200字'),
})

const {
  handleSubmit: handleReplySubmit,
  isSubmitting: isReplySubmitting,
  resetForm: resetReplyForm,
} = useForm({
  validationSchema: replySchema,
})

const reply = useField('reply')

const submitReply = handleReplySubmit(async (values) => {
  // console.log('回覆內容:', values.reply)

  if (!user.isLoggedIn) {
    createSnackbar({
      text: '尚未登入，請先登入才能回覆討論串',
      snackbarProps: {
        color: 'red',
      },
    })
    router.push('/login') // 導向登入頁
    return
  }

  if (!user.reply) {
    createSnackbar({
      text: '無留言權限',
      snackbarProps: {
        color: 'red',
      },
    })
    return
  }

  try {
    await apiAuth.patch('/calendarTopic/' + TopicDialog.value.id, {
      user: user.id,
      reply: values.reply,
    })

    createSnackbar({
      text: '成功新增回覆',
      snackbarProps: {
        color: 'success',
      },
    })
    resetReplyForm()
    await getTopics()
  } catch (error) {
    console.log('pages.calendar.[id].submitReply:', error)
    createSnackbar({
      text: error?.response?.data?.message || '回覆討論串失敗',
      snackbarProps: {
        color: 'red',
      },
    })
  }
})

// console.log(reply.value)

// 參加活動

const isJoin = computed(() => {
  return (
    user.calendar &&
    Array.isArray(user.calendar) &&
    user.calendar.some((item) => item.event.toString() === route.params.id)
  )
})
// console.log('route.params.id:', route.params.id) // 確認是否有值
// console.log('user.calendar:', user.calendar) // 確保是陣列
// console.log('isJoin:', isJoin) // computed 需用 `.value`
// console.log('isJoin:', isJoin.value) // computed 需用 `.value`

const toggleEvent = async () => {
  if (!user.isLoggedIn) {
    createSnackbar({
      text: '尚未登入，請先登入',
      snackbarProps: {
        color: 'red',
      },
    })
    router.push('/login')
    return
  }

  try {
    const { data } = await apiAuth.patch('user/calendar', {
      event: route.params.id,
    })

    user.calendar = data.result
    console.log(user.calendar)

    createSnackbar({
      text: isJoin.value ? '已將活動加進我的行事曆' : '已取消參加活動',
      snackbarProps: {
        color: 'light-blue-darken-3',
      },
    })

    // createSnackbar({
    //   text: isFavorite.value ? '收藏成功' : '已從我的收藏移除',
    //   snackbarProps: {
    //     color: 'info',
    //   },
    // })
  } catch (error) {
    console.log('pages.post.[id].toggleFavorites:', error)
    createSnackbar({
      text: error?.response?.data?.message || '未知錯誤',
      snackbarProps: {
        color: 'red',
      },
    })
  }
}

// 判斷圖片是否為長的
const isPortrait = ref(false)

const onImageLoad = (event) => {
  const img = event.target
  if (img) {
    isPortrait.value = img.naturalHeight > img.naturalWidth
    console.log(img.naturalHeight)
    console.log(img.naturalWidth)
    console.log(isPortrait.value)
  }
}
</script>

<style scoped>
.reply-card {
  background: rgba(207, 207, 207, 0.2);
  backdrop-filter: saturate(-50%);
  border-radius: 5px 5px 15px 30px;
  padding: 16px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
}

.description {
  white-space: pre-wrap;
}

.img {
  object-fit: contain;
  max-height: 100%;
  max-width: 100%;
}
</style>

<route lang="yaml">
meta:
  login: false
  admin: false
  title: '活動'
</route>
