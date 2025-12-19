<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  mode: {
    type: String,
    default: 'login',
  },
  loading: Boolean,
  error: String,
})

const emit = defineEmits(['close', 'submit', 'change-mode'])

const form = reactive({
  name: '',
  email: '',
  password: '',
})

watch(
  () => props.mode,
  (mode) => {
    if (mode === 'login') {
      form.name = ''
    }
  }
)

const submit = () => {
  emit('submit', { mode: props.mode, form: { ...form } })
  
  form.name = '';
  form.email = '';
  form.password = '';
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-emerald-50/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    @click.self="$emit('close')"
  >
    <div class="glass-card w-full max-w-md p-6 space-y-4">
      <div class="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full p-1 text-sm">
        <button
          class="flex-1 py-2 rounded-full transition text-center"
          :class="mode === 'login' ? 'bg-emerald-400 text-slate-900 font-semibold shadow' : 'text-slate-600'"
          @click="$emit('change-mode', 'login')"
        >
          Login
        </button>
        <button
          class="flex-1 py-2 rounded-full transition text-center"
          :class="mode === 'register' ? 'bg-emerald-400 text-slate-900 font-semibold shadow' : 'text-slate-600'"
          @click="$emit('change-mode', 'register')"
        >
          Register
        </button>
      </div>

      <form class="space-y-3" @submit.prevent="submit">
        <div v-if="mode === 'register'" class="space-y-2">
          <label class="text-sm text-slate-700">Name</label>
          <input
            v-model="form.name"
            type="text"
            name="name"
            required
            class="w-full rounded-xl border border-emerald-100 bg-white px-3 py-3 text-slate-800 placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition"
            placeholder="Input Name"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm text-slate-700">Email</label>
          <input
            v-model="form.email"
            type="email"
            name="email"
            required
            class="w-full rounded-xl border border-emerald-100 bg-white px-3 py-3 text-slate-800 placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition"
            placeholder="you@example.com"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm text-slate-700">Password</label>
          <input
            v-model="form.password"
            type="password"
            name="password"
            required
            class="w-full rounded-xl border border-emerald-100 bg-white px-3 py-3 text-slate-800 placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 px-4 py-3 font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Memproses...' : mode === 'login' ? 'Login' : 'Register' }}
        </button>
        <button
          type="button"
          class="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-100 px-4 py-3 font-semibold text-slate-700 transition hover:bg-emerald-50"
          @click="$emit('close')"
        >
          Close
        </button>
      </form>

      <p v-if="error" class="mt-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700">
        {{ error }}
      </p>
    </div>
  </div>
</template>
