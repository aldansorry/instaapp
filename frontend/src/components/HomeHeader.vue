<script setup>
const props = defineProps({
  user: Object,
  loading: Boolean,
  isAuthenticated: Boolean,
});

const emit = defineEmits(["login", "logout"]);
</script>

<template>
  <div class="flex items-center justify-between mb-3">
    <h1 class="text-xl font-semibold tracking-wide text-slate-500">
      Insta
      <span class="text-emerald-500 font-bold">App</span>
    </h1>
    <div>
      <button
        v-if="isAuthenticated"
        type="button"
        class="rounded-lg bg-gradient-to-r from-emerald-500 to-lime-400 px-3 py-2 font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:scale-[1.01]"
        @click="$emit('logout')"
      >
        Logout
      </button>
      <button
        v-else
        type="button"
        class="rounded-lg bg-gradient-to-r from-emerald-500 to-lime-400 px-3 py-2 font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:scale-[1.01]"
        @click="$emit('login')"
      >
        Login
      </button>
    </div>
  </div>
</template>
