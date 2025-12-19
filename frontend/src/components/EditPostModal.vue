<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  post: Object,
})

const emit = defineEmits(['close', 'save', 'change-image'])

const form = reactive({
  content: '',
  imagePreview: '',
})

watch(
  () => props.post,
  (val) => {
    if (val) {
      form.content = val.editContent || val.content || ''
      form.imagePreview = val.editImagePreview || ''
    } else {
      form.content = ''
      form.imagePreview = ''
    }
  },
  { immediate: true }
)

const onFileChange = (e) => {
  const [file] = e.target.files || []
  const preview = file ? URL.createObjectURL(file) : ''
  form.imagePreview = preview
  emit('change-image', { file, preview })
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-emerald-50/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
  >
    <div class="glass-card w-full max-w-2xl p-6 space-y-4 relative">
      <h3 class="text-xl font-semibold text-slate-900">Edit Post</h3>
      <textarea
        v-model="form.content"
        rows="4"
        class="w-full rounded-xl border border-emerald-100 bg-white px-3 py-3 text-slate-800 placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition"
      ></textarea>
      <label class="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
        <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
        <span class="inline-flex items-center justify-center rounded-lg border border-emerald-100 bg-white px-3 py-2 hover:border-accent transition">
          Replace image (optional)
        </span>
      </label>
      <div v-if="form.imagePreview || post?.resolvedImageUrl" class="rounded-xl overflow-hidden border border-emerald-50">
        <img
          :src="form.imagePreview || post?.resolvedImageUrl"
          alt="preview edit"
          class="w-full object-cover max-h-[320px]"
        />
      </div>
      <div class="flex gap-2 justify-end">
        <button class="text-slate-600 underline" @click="$emit('close')">Batal</button>
        <button
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 px-4 py-2 font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-[1.01]"
          @click="$emit('save', form.content)"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>
