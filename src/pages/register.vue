<template>
  <v-container>
    <v-card class="pa-10 mt-10 reg-log-bg" elevation="12">
      <v-row class="gradient">
        <v-col cols="12" md="7"></v-col>
        <v-col cols="12" md="5" class="bg-info my-0">
          <h1 class="text-center">註冊</h1>
          <v-form :disabled="isSubmitting" @submit.prevent="submit">
            <v-text-field
              v-model="account.value.value"
              label="帳號"
              minlength="4"
              maxlength="20"
              counter
              :error-messages="account.errorMessage.value"
              variant="outlined"
              prepend-inner-icon=" mdi-account-plus"
            />
            <v-text-field
              v-model="email.value.value"
              :error-messages="email.errorMessage.value"
              label="信箱"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
            />
            <v-text-field
              v-model="password.value.value"
              type="password"
              :error-messages="password.errorMessage.value"
              label="密碼"
              minlength="4"
              maxlength="20"
              counter
              prepend-inner-icon="mdi-lock"
              variant="outlined"
            />

            <v-text-field
              v-model="passwordConfirm.value.value"
              type="password"
              :error-messages="passwordConfirm.errorMessage.value"
              label="確認密碼"
              variant="outlined"
            />
            <v-btn type="submit" :loading="isSubmitting" rounded="xl" elevation="5"> 註冊</v-btn>
          </v-form>
          <p class="mt-5" @click="toLogin">已經有帳號了?</p></v-col
        >
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import validator from 'validator'
import * as yup from 'yup'
import { useAxios } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'

const { api } = useAxios()
const router = useRouter()
const createSnackbar = useSnackbar()

const schema = yup.object({
  account: yup
    .string()
    .required('使用者帳號必填')
    .min(4, '使用者帳號太短')
    .max(20, '使用者帳號太長')
    .test('isAlphanumeric', '帳號格式不符', (value) => validator.isAlphanumeric(value)),
  email: yup
    .string()
    .required('使用者信箱必填')
    .test('isEmail', '使用者信箱格式不符', (value) => validator.isEmail(value)),
  password: yup
    .string()
    .required('使用者密碼必填')
    .min(4, '使用者密碼太短')
    .max(20, '使用者密碼太長'),
  passwordConfirm: yup.string().oneOf([yup.ref('password')], '密碼不一致'),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
})

const account = useField('account')
const email = useField('email')
const password = useField('password')
const passwordConfirm = useField('passwordConfirm')

const submit = handleSubmit(async (values) => {
  try {
    await api.post('/user', {
      account: values.account,
      email: values.email,
      password: values.password,
    })
    createSnackbar({
      text: '註冊成功',
      snackbarProps: {
        color: 'info',
      },
    })
    router.push('/login')
  } catch (error) {
    console.log('pages.register.submit:', error)
    createSnackbar({
      text: error?.response?.data?.message || '未知錯誤',
      snackbarProps: {
        color: 'red',
      },
    })
  }
})

const toLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.reg-log-bg {
  border-radius: 50% 20% / 10% 40%;
  background: plum;
  padding: 20px;
  text-align: center;
  position: relative;
  /* border: 10px solid transparent;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
  border-image: url('@/assets/bg.jpg') 30 round; */
}

.gradient {
  background: linear-gradient(30deg, #decfff, #decfff00 80%),
    linear-gradient(157deg, #cff9ff, #cff9ff00 80%),
    linear-gradient(207deg, #b9ffb3, #b9ffb300 80%),
    linear-gradient(260deg, #fffcaf, #fffcaf00 80%), linear-gradient(312deg, #ffbf95, #ffbf9500 80%);
  color: rgb(134, 128, 119);
}
</style>

<route lang="yaml">
meta:
  title: '註冊'
</route>
