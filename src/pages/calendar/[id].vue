<template>
  <v-container>
    <!-- 活動資訊區 -->
    <v-card>
      <v-row>
        <v-col cols="12" md="7" class="bg-primary">
          <v-img :src="calendar.image" cover></v-img>
        </v-col>
        <v-col cols="12" md="5" class="bg-red">
          <v-card-item>
            <h3>{{ calendar.title }}</h3>
            <v-card-text>
              <v-icon icon="mdi-calendar"></v-icon>日期: {{ calendar.start }}
            </v-card-text>
            <v-card-text> <v-icon icon="mdi-clock"></v-icon>時間: {{ calendar.time }} </v-card-text>
            <v-card-text>
              <v-icon icon="mdi-map-marker"></v-icon>地點: {{ calendar.location }}
            </v-card-text>
            <v-btn>參加活動</v-btn>
          </v-card-item>
        </v-col>
      </v-row>
      <p class="bg-blue ma-10">{{ calendar.description }}</p>
    </v-card>

    <!-- 討論串區 -->
    <v-card>
      <h3 class="d-sm-inline-block me-10">Message Board</h3>
      <v-btn @click="openaddTopicDialog(null)">新增討論串</v-btn>
      <v-divider></v-divider>
      <v-list v-if="topics.length > 0">
        <v-list-item v-for="topic in topics" :key="topic._id">
          <v-list-item-content>
            <v-list-item-title @click="openTopicDialog(topic)">{{ topic.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <p v-else class="ma-5">尚無討論串</p>
    </v-card>

    <!-- 新增討論串dialog -->
    <v-dialog v-model="addTopicDialog.open" persistent max-width="600px">
      <v-form :disabled="isSubmitting" @submit.prevent="submitTopic">
        <v-card>
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
            <v-btn @click="closeaddTopicDialog">取消</v-btn>
            <v-btn type="submit" :loading="isSubmitting">送出</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- 開啟討論串內容 -->
    <v-dialog v-model="TopicDialog.open" max-width="800px">
      <v-card class="pa-10">
        <v-row>
          <v-col cols="12" md="3" class="bg-info">
            <v-img :src="TopicDialog.icon" cover></v-img>
            <p class="text-center">{{ TopicDialog.name }}</p>
          </v-col>
          <v-col cols="12" md="9" class="bg-warning">
            <h3>{{ TopicDialog.title }}</h3>
            <p class="ms-2 my-5">{{ TopicDialog.content }}</p>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col>
            <!-- 話題串留言內容 -->

            <v-list class="bg-info mt-10">
              <v-list-item v-for="topicReply in TopicDialog.reply" :key="topicReply" class="mb-2">
                <!-- <v-avatar>
                  <v-img :src="reply.user.image"></v-img>
                </v-avatar> -->
                <v-list-item-content>
                  <!-- <v-list-item-subtitle>{{ reply.user.name }}</v-list-item-subtitle> -->
                  <v-list-item-title>{{ topicReply.reply }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <!-- 話題串留言框 -->
            <v-form :disabled="isReplySubmitting" @submit.prevent="submitReply">
              <v-textarea
                v-model="reply.value.value"
                class="py-10"
                label="請輸入留言"
                :error-messages="reply.errorMessage.value"
              ></v-textarea>
              <v-btn type="submit" :loading="isReplySubmitting">送出</v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { reactive, ref } from 'vue'
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
  if (!user.post) {
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
  if (!user.isLoggedIn) {
    createSnackbar({
      text: '尚未登入，請先登入才能新增討論串',
      snackbarProps: {
        color: 'red',
      },
    })
    router.push('/login') // 導向登入頁
    return
  }

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
    console.log(topics)
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
</script>
