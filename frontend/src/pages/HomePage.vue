<script setup>
import { computed, onMounted, ref } from 'vue'
import HomeHeader from '@/components/HomeHeader.vue'
import AuthModal from '@/components/AuthModal.vue'
import { backendOrigin } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { useNotify } from '@/composables/useNotify'
const authStore = useAuthStore()
const { notify } = useNotify();

const showAuthModal = ref(false)
const authMode = ref('login')
const authLoading = ref(false)
const authError = ref('')

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const openAuth = (mode = 'login') => {
  authMode.value = mode
  showAuthModal.value = true
}

const closeAuth = () => {
  showAuthModal.value = false
  authError.value = ''
}

const submitAuth = async ({ mode, form }) => {
  authError.value = ''
  authLoading.value = true
  try {
    if (mode === 'login') {
      await authStore.login({ email: form.email, password: form.password })
    } else {
      await authStore.register({ name: form.name, email: form.email, password: form.password })
    }
    closeAuth()
    notify('success', `${mode == 'login' ? 'Login' : 'Register'} Success`);
  } catch (err) {
    authError.value =
      err?.response?.data?.message ||
      err?.response?.data ||
      err.message ||
      `${mode} gagal.`
  } finally {
    authLoading.value = false
  }
}

const requireAuth = () => {
  if (!isAuthenticated.value) {
    openAuth('login')
    return false
  }
  return true
}

const logout = async () => {
  await authStore.logout()
  notify('success', `Logged Out`);
}

onMounted(async () => {
  await authStore.init()
})
</script>

<template>
  <main class="max-w-lg min-h-screen mx-auto p-3 bg-white">
      <HomeHeader
        :user="user"
        :loading="authStore.loading"
        :is-authenticated="isAuthenticated"
        @login="openAuth('login')"
        @logout="logout"
      />
  </main>
  <AuthModal
    :show="showAuthModal"
    :mode="authMode"
    :loading="authLoading"
    :error="authError"
    @close="closeAuth"
    @change-mode="authMode = $event"
    @submit="submitAuth"
  />
</template>
