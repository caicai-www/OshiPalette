<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">活動月曆管理</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <v-data-table
          class="glass-card pa-4"
          :items="calendar"
          :headers="headers"
          :search="search"
          items-per-page="20"
        >
          <template #top>
            <v-toolbar class="glass-card">
              <v-btn class="button rounded-xl" @click="openDialog(null)">新增活動</v-btn>
              <v-text-field
                v-model="search"
                variant="underlined"
                class="pa-2 my-auto"
                density="comfortable"
                placeholder="搜尋"
                prepend-icon="mdi-account-search"
              ></v-text-field>
            </v-toolbar>
          </template>
          <template #[`item.image`]="{ value }">
            <v-img :src="value" height="50"></v-img>
          </template>

          <template #[`item.start`]="{ value }">
            {{ new Date(value).toLocaleString().slice(0, 9) }}
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

  <v-dialog v-model="dialog.open" persistent max-width="1000px">
    <v-form :disabled="isSubmitting" @submit.prevent="submit">
      <v-card :style="useStyle.containerStyle" class="bg pa-10 rounded-xl">
        <v-card-title class="list_bg text-center">{{
          dialog.id ? '編輯活動' : '新增活動'
        }}</v-card-title>
        <v-card-text>
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

          <v-text-field
            v-model="start.value.value"
            type="date"
            label="開始日期"
            :error-messages="start.errorMessage.value"
          >
          </v-text-field>
          <v-text-field
            v-model="end.value.value"
            type="date"
            label="結束日期"
            :error-messages="end.errorMessage.value"
          >
          </v-text-field>

          <v-text-field
            v-model="title.value.value"
            type="text"
            label="活動名稱"
            :error-messages="title.errorMessage.value"
          >
          </v-text-field>

          <v-combobox
            v-model="location.value.value"
            label="活動地點"
            :items="[
              '台北大巨蛋',
              '台北小巨蛋',
              '台北音樂流行中心',
              'TICC 台北國際會議中心',
              '南港展覽館',
              '台大體育館',
              '新莊體育館',
              'Zepp New Taipei',
            ]"
            :error-messages="location.errorMessage.value"
          ></v-combobox>
          <v-textarea
            v-model="description.value.value"
            type="text"
            label="活動描述"
            :error-messages="description.errorMessage.value"
          >
          </v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn class="button rounded-xl" @click="closeDialog">取消</v-btn>
          <v-btn type="submit" :loading="isSubmitting" class="button rounded-xl">送出</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { useAxios } from '@/composables/axios'
import { computed, ref } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useThemeStore } from '@/stores/style'
import { VueFileAgent } from '@boindil/vue-file-agent-next'

const { apiAuth } = useAxios()
const createSnackbar = useSnackbar()
const useStyle = useThemeStore()

const calendar = ref([])
const headers = computed(() => {
  return [
    { title: '活動時間', key: 'start', sortable: true },
    { title: '活動圖片', key: 'image', sortable: false },
    { title: '活動名稱', key: 'title', sortable: true },
    { title: '活動地點', key: 'location', sortable: true },
    { title: '新增時間', key: 'createdAt', sortable: true },
    { title: '管理', key: 'edit', sortable: false },
  ]
})

const search = ref('')
const dialog = ref({
  open: false,
  id: '',
})

const getCalendar = async () => {
  try {
    const { data } = await apiAuth.get('/calendar')
    calendar.value = data.result
  } catch (error) {
    console.log('pages.calendar.getcalendar:', error)
    createSnackbar({
      text: error?.response?.data?.message || '未知錯誤',
      snackbarProps: {
        color: 'red',
      },
    })
  }
}

getCalendar()

const openDialog = (item) => {
  if (item) {
    dialog.value.id = item._id
    start.value.value = item.start.toLocaleString().split('T')[0]
    end.value.value = item.end.toLocaleString().split('T')[0]
    title.value.value = item.title
    location.value.value = item.location
    description.value.value = item.description
  }
  dialog.value.open = true
}

const closeDialog = () => {
  resetForm()
  dialog.value.id = ''
  dialog.value.open = false
  fileAgent.value.deleteFileRecord()
}

const schema = yup.object({
  start: yup.date().required('活動開始日期必填'),
  end: yup.date().required('活動結束日期必填'),
  title: yup.string().required('活動名稱必填'),
  location: yup.string().required('活動地點必填'),
  description: yup.string().required('活動描述必填'),
})

const fileAgent = ref(null)
const fileRecords = ref([])
const rawFileRecords = ref([])

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
})

const start = useField('start')
const end = useField('end')
const title = useField('title')
const location = useField('location')
const description = useField('description')

const submit = handleSubmit(async (values) => {
  if (fileRecords.value[0]?.error) return
  if (dialog.value.id.length === 0 && fileRecords.value.length === 0) {
    createSnackbar({
      text: '活動照片必填',
      snackbarProps: {
        color: 'red',
      },
    })
  }
  try {
    const fd = new FormData()
    fd.append('start', values.start)
    fd.append('end', values.end)
    fd.append('title', values.title)
    fd.append('location', values.location)
    fd.append('description', values.description)
    if (fileRecords.value.length > 0) {
      fd.append('image', fileRecords.value[0].file)
    }

    console.log(' 發送資料:', Object.fromEntries(fd.entries()))

    if (dialog.value.id.length > 0) {
      await apiAuth.patch('/calendar/' + dialog.value.id, fd)
    } else {
      await apiAuth.post('/calendar', fd)
    }

    closeDialog()
    calendar.value.splice(0, calendar.value.length)
    getCalendar()

    createSnackbar({
      text: dialog.value.id.length > 0 ? '新增成功' : '編輯成功',
      snackbarProps: {
        color: 'light-blue-darken-3',
      },
    })
  } catch (error) {
    console.log('page.user.calendar.submit:', error)
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
.bg {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>

<route lang="yaml">
meta:
  layout: admin
  login: true
  admin: true
  title: '管理後台'
</route>
