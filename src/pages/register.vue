<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">註冊</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <v-form :disabled="isSubmitting" @submit.prevent="submit">
          <v-text-field
            v-model="account.value.value"
            label="帳號"
            minlength="4"
            maxlength="20"
            counter
            :error-messages="account.errorMessage.value"
          />
          <v-text-field
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            label="信箱"
          />
          <v-text-field
            v-model="password.value.value"
            type="password"
            :error-messages="password.errorMessage.value"
            label="密碼"
            minlength="4"
            maxlength="20"
            counter
          />

          <v-text-field
            v-model="passwordConfirm.value.value"
            type="password"
            :error-messages="passwordConfirm.errorMessage.value"
            label="確認密碼"
          />
          <v-btn type="submit" :loading="isSubmitting">註冊</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import validator from 'validator'
import * as yup from 'yup'

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

const submit = handleSubmit((values) => {})
</script>
