<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">會員管理中心</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <v-data-table :items="users" :headers="headers" :search="search" :filter-keys="['account']">
          <template #top>
            <v-toolbar>
              <v-text-field
                v-model="search"
                variant="underlined"
                class="pa-2 my-auto"
                density="comfortable"
                placeholder="搜尋會員名稱..."
                prepend-icon="mdi-account-search"
              ></v-text-field>
            </v-toolbar>
          </template>
          <template #[`item.icon`]="{ value }">
            <v-img :src="value" height="50"></v-img>
          </template>

          <template #[`item.post`]="{ value }">
            <v-icon v-if="value" icon="mdi-check"></v-icon>
            <v-icon v-else icon="mdi-close"></v-icon>
          </template>

          <template #[`item.reply`]="{ value }">
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

  <v-dialog v-model="dialog.open">
    <v-form :disabled="isSubmitting" @submit.prevent="submit">
      <v-card>
        <v-card-title>編輯會員</v-card-title>
        <v-card-text>
          <v-text-field v-model="account.value.value" label="帳號" readonly> </v-text-field>
          <v-text-field v-model="email.value.value" label="信箱" readonly> </v-text-field>
          <v-text-field v-model="name.value.value" label="暱稱" readonly> </v-text-field>
          <v-text-field v-model="birthdate.value.value" label="生日" readonly> </v-text-field>
          <v-text-field v-model="icon.value.value" label="頭像" readonly> </v-text-field>
          <v-checkbox v-model="post.value.value" label="發文"></v-checkbox>
          <v-checkbox v-model="reply.value.value" label="回覆"></v-checkbox>
        </v-card-text>
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
import { computed, reactive, ref } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const { apiAuth } = useAxios()
const createSnackbar = useSnackbar()

const users = reactive([])
const headers = computed(() => {
  return [
    { title: '頭像', key: 'icon', sortable: false },
    { title: 'ID', key: '_id', sortable: true },
    { title: '會員帳號', key: 'account', sortable: true },
    { title: '會員名稱', key: 'name', sortable: true },
    { title: '會員信箱', key: 'email', sortable: true },
    { title: '發文', key: 'post', sortable: true },
    { title: '留言', key: 'reply', sortable: true },
    { title: '註冊時間', key: 'createdAt', sortable: true },
    { title: '管理', key: 'edit', sortable: false },
  ]
})

const search = ref('')
const dialog = ref({
  open: false,
  id: '',
})

const schema = yup.object({
  account: yup.string().required(),
  email: yup.string().required(),
  name: yup.string().required(),
  birthdate: yup.date(),
  icon: yup.string(),
  post: yup.boolean(),
  reply: yup.boolean(),
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
})
const account = useField('account')
const email = useField('email')
const name = useField('name')
const birthdate = useField('birthdate')
const icon = useField('icon')
const post = useField('post')
const reply = useField('reply')

const openDialog = (item) => {
  if (item) {
    dialog.value.id = item._id
    account.value.value = item.account
    email.value.value = item.email
    name.value.value = item.name
    birthdate.value.value = item.birthdate
    icon.value.value = item.icon
    post.value.value = item.post
    reply.value.value = item.reply
  }
  dialog.value.open = true
}

const closeDialog = () => {
  resetForm()
  dialog.value.open = false
}

const submit = async (values) => {
  try {
    const fd = new FormData()
    fd.append('post', values.post)
    fd.append('reply', values.reply)

    console.log('發送資料:', Object.fromEntries(fd.entries()))

    await apiAuth.patch('/user/' + dialog.value.id, fd)

    users.splice(0, users.length)
    getUsers()

    createSnackbar({
      text: '編輯成功',
      snackbarProps: {
        color: 'blue',
      },
    })
    closeDialog()
  } catch (error) {
    console.log('page.user.submit:', error)
    createSnackbar({
      text: '編輯失敗',
      snackbarProps: {
        color: 'red',
      },
    })
  }
}

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
