// Utilities
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import UserRole from '@/enums/UserRole'
import { useAxios } from '@/composables/axios'

export const useUserStore = defineStore(
  'user',
  () => {
    const { api } = useAxios()
    const token = ref('')
    const account = ref('')
    const id = ref('')
    const post = ref('')
    const reply = ref('')
    const favorite = ref([])
    const calendar = ref([])
    const role = ref(UserRole.USER)

    const isLoggedIn = computed(() => {
      return token.value.length > 0
    })

    const isAdmin = computed(() => {
      return role.value === UserRole.ADMIN
    })

    const login = (data) => {
      if (data.token) {
        token.value = data.token
      }
      account.value = data.account
      id.value = data.id
      // birthdate.value = data.birthdate
      role.value = data.role
      post.value = data.post
      reply.value = data.reply
      favorite.value = data.favorite
      calendar.value = data.calendar
    }

    const logout = () => {
      token.value = ''
      account.value = ''
      post.value = ''
      reply.value = ''
      id.value = ''
      role.value = UserRole.USER
      favorite.value.splice(0, favorite.value.length)
    }

    return {
      token,
      account,
      role,
      id,
      post,
      reply,
      favorite,
      calendar,
      isLoggedIn,
      isAdmin,
      login,
      logout,
    }
  },
  {
    persist: {
      key: 'oshi-user',
      pick: ['token'],
    },
  },
)
