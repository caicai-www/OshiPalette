<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="5" class="bg-info">
        <v-img :src="post.image"></v-img>
      </v-col>
      <v-col cols="12" md="7" class="bg-warning">
        <v-card>
          <v-row>
            <v-col cols="12" md="5" class="mt-5">
              <v-img
                :src="post.author.image"
                cover
                width="150"
                height="150"
                class="mx-auto rounded-circle"
              ></v-img>
              <p class="text-center">{{ post.author.name }}</p>
            </v-col>
            <v-col cols="12" md="7" class="bg-primary">
              <h2 class="ma-2">{{ post.title }}</h2>
              <p class="ma-2">{{ post.content }}</p>
              <v-chip v-for="tag in post.tags" :key="tag" class="ma-2">{{ tag }}</v-chip>
              <!--  新增收藏 -->
              <v-btn
                :color="isFavorite ? 'red' : 'grey'"
                prepend-icon="mdi-heart-plus"
                @click="addFavorite"
                >新增至我的收藏</v-btn
              >
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <h3 class="ma-2">Comments:</h3>
          <p class="ms-2 my-5">共{{ replys.length }}則留言</p>

          <!-- 評論區域 -->
          <v-list>
            <v-list-item v-for="reply in replys" :key="reply" class="mb-5">
              <v-avatar>
                <v-img :src="reply.user.image"></v-img>
              </v-avatar>

              <v-list-item-content>
                <v-list-item-subtitle>{{ reply.user.name }}</v-list-item-subtitle>
                <v-list-item-title>{{ reply.content }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-form :disabled="isSubmitting" @submit.prevent="submit">
            <v-textarea
              v-model="content.value.value"
              :error-messages="content.errorMessage.value"
              class="pa-2"
              label="新增留言"
            >
            </v-textarea
            ><v-btn type="submit" :loading="isSubmitting">送出</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useAxios } from '@/composables/axios'
import { useRoute, useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import { useUserStore } from '@/stores/user'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const { api, apiAuth } = useAxios()
const user = useUserStore()
const createSnackbar = useSnackbar()
const route = useRoute()
const router = useRouter()

const post = ref({
  title: '',
  content: '',
  author: '',
  image: '',
  tags: [],
  colors: '',
})

const getPost = async () => {
  try {
    const { data } = await api.get('/post/' + route.params.id)
    post.value = data.result
    // console.log('user._id:', user.id)
    // console.log('post._id:', post.value._id)
  } catch (error) {
    console.log('pages.[id].post:', error)
    router.push('/')
    createSnackbar({
      text: error?.response?.data?.message || '未知錯誤',
      snackbarProps: {
        color: 'red',
      },
    })
  }
}

getPost()

const schema = yup.object({
  content: yup.string().required('請輸入留言內容'),
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
})

const content = useField('content')

const submit = handleSubmit(async (values) => {
  try {
    const fd = new FormData()
    fd.append('user', user.id)
    fd.append('post', post.value._id)
    fd.append('content', values.content)

    await apiAuth.post('/postReply', fd)

    resetForm()

    createSnackbar({
      text: '回覆成功',
      snackbarProps: {
        color: 'green',
      },
    })
  } catch (error) {
    console.log('pages.post.[id]:', error)

    createSnackbar({
      text: '回覆失敗',
      snackbarProps: {
        color: 'red',
      },
    })
  }
})

// 回覆區
const replys = ref([])

const getReply = async () => {
  try {
    const { data } = await api.get('/postReply', {
      params: {
        post: route.params.id,
      },
    })

    replys.value = data.result
    getReply()
    // console.log('reply:', replys.value)
  } catch (error) {
    console.log('pages.[id].post:', error)
    createSnackbar({
      text: error?.response?.data?.message || '未知錯誤',
      snackbarProps: {
        color: 'red',
      },
    })
  }
}

getReply()

// 收藏區

const addFavorite = async () => {
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

  // 確認是否有收藏過
  const favoritePostIds = user.favorite?.map((fav) => fav.post) || []

  if (favoritePostIds.includes(post.value._id)) {
    createSnackbar({
      text: '此篇貼文已經收藏了!',
      snackbarProps: { color: 'red' },
    })
    return
  }

  try {
    const { data } = await apiAuth.patch('user/favorites', {
      post: post.value._id,
    })

    user.favorite = data.result
    console.log(user.favorite)

    createSnackbar({
      text: '收藏成功',
      snackbarProps: {
        color: 'info',
      },
    })
  } catch (error) {
    console.log('pages.post.[id].addFavorite:', error)
    createSnackbar({
      text: error?.response?.data?.message || '未知錯誤',
      snackbarProps: {
        color: 'red',
      },
    })
  }
}
</script>

<route lang="yaml">
meta:
  login: false
  admin: false
  title:
</route>
