<template>
  <v-container>
    <h1 class="text-center justify-center py-6">個人資料</h1>

    <v-form :disabled="isSubmitting" @submit.prevent="submit">
      <v-card class="glass-card pa-4">
        <v-row>
          <!-- 左側：大頭貼 -->
          <v-col cols="12" md="3" class="d-flex justify-center">
            <v-img cover :src="usericon"></v-img>
          </v-col>

          <!-- 右側：個人資訊 -->
          <v-col cols="12" md="9">
            <v-card-text>
              <v-text-field
                v-model="name.value.value"
                type="text"
                label="暱稱"
                :readonly="!isEdit"
                :error-messages="name.errorMessage.value"
                @keydown.enter="finishEdit"
              >
                <template #append>
                  <v-icon class="cursor-pointer" @click="toggleEdit">
                    {{ isEdit ? 'mdi-check' : 'mdi-pencil' }}
                  </v-icon>
                </template>
              </v-text-field>

              <v-text-field
                v-model="birthdate.value.value"
                type="date"
                label="生日"
                :error-messages="name.errorMessage.value"
              >
                <template #append> <v-icon class="cursor-pointer"> </v-icon> </template>
              </v-text-field>
              <!-- <v-date-input
                v-model="birthdate.value.value"
                label="生日"
                prepend-icon=""
              ></v-date-input> -->
            </v-card-text>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <VueFileAgent
              ref="fileAgent"
              v-model="fileRecords"
              v-model:raw-model-value="rawFileRecords"
              accept="image/jpeg,image/png"
              deletable
              max-size="1MB"
              :help-text="'點擊或拖曳頭像檔案至此'"
              :error-text="{
                type: '檔案類型錯誤',
                size: '檔案大小超過限制',
              }"
            >
            </VueFileAgent>
          </v-col>
        </v-row>

        <v-card-actions>
          <v-btn type="submit" :disabled="isEdit">更新</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { VueFileAgent } from '@boindil/vue-file-agent-next'

import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useSnackbar } from 'vuetify-use-dialog'
import { useAxios } from '@/composables/axios'

const { apiAuth } = useAxios()
const createSnackbar = useSnackbar()

const user = useUserStore()
const usericon = ref('')
const originalData = ref({ name: '', birthdate: '', image: '' })

const isEdit = ref(false)

const toggleEdit = () => {
  isEdit.value = !isEdit.value
}

const finishEdit = (event) => {
  event.preventDefault()
  if (isEdit.value) {
    isEdit.value = false
  }
}

const getIdInfo = async () => {
  try {
    const { data } = await apiAuth.get('/user/info')
    name.value.value = data.result.name
    birthdate.value.value = data.result.birthdate.toLocaleString().split('T')[0]
    usericon.value = data.result.image
    // console.log(birthdate.value.value)

    originalData.value = {
      name: data.result.name,
      birthdate: data.result.birthdate.toLocaleString().split('T')[0],
      image: data.result.image,
    }

    console.log(originalData.value)
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

getIdInfo()

const schema = yup.object({
  name: yup.string().required('暱稱必填'),
  birthdate: yup.date().max(new Date(), '請填入正確日期'),
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
})

const name = useField('name')
const birthdate = useField('birthdate')

const fileAgent = ref(null)
const fileRecords = ref([])
const rawFileRecords = ref([])

const submit = handleSubmit(async (values) => {
  if (isEdit.value) return
  if (fileRecords.value[0]?.error) return

  // // 確認資料有無更新
  const isDataChanged =
    values.name !== originalData.value.name ||
    values.birthdate !== originalData.value.birthdate ||
    (fileRecords.value.length > 0 && fileRecords.value[0].file !== originalData.value.image)

  if (!isDataChanged) {
    createSnackbar({
      text: '沒有新的更新內容',
      snackbarProps: {
        color: 'blue',
      },
    })
    return
  }

  try {
    const fd = new FormData()
    fd.append('name', values.name)
    fd.append('birthdate', values.birthdate)

    if (fileRecords.value.length > 0) {
      fd.append('image', fileRecords.value[0].file)
    }
    console.log(name.value.value, birthdate.value.value, fileRecords.value[0]?.file)
    await apiAuth.patch('user/' + user.id, fd)

    await getIdInfo()
    resetForm
    fileAgent.value.deleteFileRecord()

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

<style scoped>
.glass-card {
  background: rgba(207, 207, 207, 0.2);
  backdrop-filter: hue-rotate(80deg) saturate(-20%);
  border-radius: 30px;
  padding: 16px;
  box-shadow: 0px 20px 15px rgba(0, 0, 0, 0.1);
}
</style>

<route lang="yaml">
meta:
  layout: user
  login: true
  title: '個人資料'
</route>
