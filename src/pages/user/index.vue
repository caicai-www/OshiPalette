<template>
  <v-container class="pa-5">
    <v-row class="justify-center">
      <v-col cols="12">
        <h1 class="text-center">個人資料</h1>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-form :disabled="isSubmitting" @submit.prevent="submit">
      <v-card class="pa-5">
        <v-row class="justify-center">
          <v-col cols="3">
            <p>頭像:</p>
            <VueFileAgent
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
          </v-col>
          <v-col cols="7">
            <v-row>
              <v-col cols="3">
                <v-list-subheader>暱稱:</v-list-subheader>
              </v-col>
              <v-col cols="5"
                ><v-text-field
                  v-model="name.value.value"
                  :error-messages="name.errorMessage.value"
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-list-subheader>生日:</v-list-subheader>
              </v-col>
              <v-col cols="5">
                <v-date-input
                  v-model="birthdate.value.value"
                  label="選擇生日"
                  prepend-icon=""
                  :error-messages="birthdate.errorMessage.value"
                  :max="new Date().toISOString().split('T')[0]"
                ></v-date-input>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn type="submit">更新</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAxios } from '@/composables/axios'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useForm, useField } from 'vee-validate'
import { VueFileAgent } from '@boindil/vue-file-agent-next'
import * as yup from 'yup'
import { useSnackbar } from 'vuetify-use-dialog'
import { useUserStore } from '@/stores/user'

const userinfo = reactive([])

const user = useUserStore()

const { apiAuth } = useAxios()
const createSnackbar = useSnackbar()

const getUserInfo = async () => {
  try {
    const { data } = await apiAuth.get('user/' + user.id)
    userinfo.push(...data.result)
  } catch (error) {
    console.log(error)
    createSnackbar({
      text: '未知錯誤',
      snackbarProps: {
        color: 'red',
      },
    })
  }
}

getUserInfo()

console.log(userinfo)

const schema = yup.object({
  name: yup.string().required('暱稱必填'),
  birthdate: yup.date().max(new Date(), '請填入正確日期'),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
})

const name = useField('name')
const birthdate = useField('birthdate')

const fileRecords = ref([])
const rawFileRecords = ref([])

const submit = handleSubmit(async (values) => {
  if (fileRecords.value.values[0]?.error) return
  try {
    const fd = new FormData()
    fd.append('name', values.name)
    fd.append('birthdate', values.birthdate)
    if (fileRecords.value.values.length > 0) {
      fd.append('icon', fileRecords.value.values[0].file)
    }
    console.log(fileRecords.value)
    await apiAuth.patch('user/' + user.id, fd)

    userinfo.splice(0, userinfo.length)

    createSnackbar({
      text: '更新成功',
      snackbarProps: {
        color: 'green',
      },
    })
  } catch (error) {
    console.log('pages.user.index:', error)
    createSnackbar({
      text: '更新失敗',
      snackbarProps: {
        color: 'red',
      },
    })
  }
})
</script>

<route lang="yaml">
meta:
  layout: user
  login: true
  title: '會員中心'
</route>
