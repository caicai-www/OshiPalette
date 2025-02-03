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
    const icon = ref('')
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
      role.value = data.role
    }

    const logout = () => {
      token.value = ''
      account.value = ''
      role.value = UserRole.USER
    }

    return {
      token,
      account,
      role,
      icon,
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
