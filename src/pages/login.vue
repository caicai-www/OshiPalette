<template>
  <v-container>
    <v-card class="pa-10 mt-10 reg-log-bg">
      <vue-particles
        id="tsparticles"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
        :options="useStyle.dynamicOptions"
        @particles-loaded="particlesLoaded"
      />
      <v-row>
        <v-col cols="6" style="position: relative; z-index: 1">
          <h1 class="text-center">登入</h1>
          <v-form :disabled="isSubmitting" @submit.prevent="submit">
            <v-text-field
              v-model="account.value.value"
              label="帳號"
              minlength="4"
              maxlength="20"
              counter
              :error-messages="account.errorMessage.value"
              prepend-inner-icon=" mdi-account-plus"
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

            <v-btn type="submit" :loading="isSubmitting" rounded="xl" elevation="5" class="button"
              >登入</v-btn
            >
          </v-form>
          <p class="mt-5 text-hover" @click="toRegister">還沒有帳號?</p>
        </v-col>
        <v-col cols="6"> </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { useThemeStore } from '@/stores/style'
import { useForm, useField } from 'vee-validate'
import validator from 'validator'
import * as yup from 'yup'
import { useAxios } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const { api } = useAxios()
const router = useRouter()
const createSnackbar = useSnackbar()
const user = useUserStore()
const useStyle = useThemeStore()

const schema = yup.object({
  account: yup
    .string()
    .required('使用者帳號必填')
    .min(4, '使用者帳號太短')
    .max(20, '使用者帳號太長')
    .test('isAlphanumeric', '帳號格式不符', (value) => validator.isAlphanumeric(value)),
  password: yup
    .string()
    .required('使用者密碼必填')
    .min(4, '使用者密碼太短')
    .max(20, '使用者密碼太長'),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
})

const account = useField('account')
const password = useField('password')

const submit = handleSubmit(async (values) => {
  try {
    const { data } = await api.post('/user/login', {
      account: values.account,
      password: values.password,
    })
    user.login(data.result)
    createSnackbar({
      text: '登入成功',
      snackbarProps: {
        color: 'info',
      },
    })
    router.push('/')
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

const toRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.bg {
  padding: 40px;
  border-radius: 10% 40% / 50% 20%;
  text-align: center;
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
  title: '登入'
</route>
