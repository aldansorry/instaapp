<script setup>
const props = defineProps({
  content: String,
  imageName: String,
  imagePreview: String,
  creating: Boolean,
})

const emit = defineEmits(['update:content', 'select-image', 'submit'])

const onChangeFile = (e) => {
  const [file] = e.target.files || []
  emit('select-image', { file })
}
</script>

<template>
  <section class="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 space-y-4 mb-3">
    <label class="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
      <input type="file" accept="image/*" class="hidden" @change="onChangeFile" />
      <span
        class="inline-flex items-center justify-center rounded-lg border border-emerald-100 bg-white px-3 py-2 hover:border-accent transition">
        Select image (required)
      </span>
      <span v-if="imageName" class="text-emerald-700 text-xs truncate max-w-[180px]">{{ imageName }}</span>
    </label>
    <div v-if="imagePreview" class="rounded-xl overflow-hidden border border-emerald-50">
      <img :src="imagePreview" alt="preview image" class="w-full object-cover max-h-[320px]" />
    </div>
    <textarea :value="content" rows="3"
      class="w-full rounded-xl border border-emerald-100 bg-white px-3 py-3 text-slate-800 placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition"
      placeholder="Write something..." @input="$emit('update:content', $event.target.value)"></textarea>
    <div class="flex justify-start">
      <button type="button" :disabled="creating"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 px-4 py-2 font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
        @click="$emit('submit')">
        {{ creating ? 'Loading...' : 'Post' }}
      </button>
    </div>
  </section>
</template>
