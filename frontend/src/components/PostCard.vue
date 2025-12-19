<script setup>
import { computed, ref } from 'vue'
import { HeartIcon, ChatBubbleLeftIcon, PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/solid";
const showComments = ref(false)
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  isAuthenticated: Boolean,
  currentUserId: Number,
  resolveImageUrl: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['like', 'comment', 'delete-comment', 'edit', 'delete'])

const commentInput = ref('')

const submitComment = () => {
  if (!commentInput.value.trim()) return
  emit('comment', props.post, commentInput.value.trim())
  commentInput.value = ''
}
</script>

<template>
  <article class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4">
      <div>
        <p class="font-semibold text-slate-900">
          {{ post.user?.name || 'Pengguna' }}
        </p>
        <p class="text-sm text-slate-500">
          {{ new Date(post.created_at).toLocaleString() }}
        </p>
      </div>

      <div v-if="isAuthenticated && currentUserId === post.user_id" class="flex items-center gap-3 text-sm">
        <div class="flex items-center gap-2">
          <!-- Edit -->
          <button class="
      inline-flex items-center justify-center
      h-8 w-8 rounded-lg
      text-emerald-600 hover:text-emerald-500
      hover:bg-emerald-50
      transition
    " @click="$emit('edit', post)" title="Edit">
            <PencilSquareIcon class="h-4 w-4" />
          </button>

          <!-- Delete -->
          <button class="
      inline-flex items-center justify-center
      h-8 w-8 rounded-lg
      text-red-500 hover:text-red-400
      hover:bg-red-50
      transition
    " @click="$emit('delete', post)" title="Delete">
            <TrashIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Image -->
    <div v-if="post.image_url" class="w-full max-h-[360px] overflow-hidden bg-slate-100">
      <img :src="resolveImageUrl(post.image_url)" alt="Post Image" class="w-full object-cover" />
    </div>

    <!-- Content -->
    <div class="px-5 py-4 space-y-4">
      <p class="text-slate-800 leading-relaxed whitespace-pre-line">
        {{ post.content }}
      </p>

      <!-- Actions -->
      <div class="flex items-center gap-6 text-sm">

        <!-- Like -->
        <button class="inline-flex items-center gap-2 font-medium transition"
          :class="isAuthenticated ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'" @click="$emit('like', post)">
          <HeartIcon class="h-5 w-5" :class="post.liked_by_user_exists ? 'text-red-500' : 'text-slate-400'" />
          <span :class="post.liked_by_user_exists ? 'text-red-600' : 'text-slate-500'">
            {{ post.likes_count || 0 }} Like
          </span>
        </button>

        <!-- Comment toggle -->
        <button class="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition"
          @click="showComments = !showComments">
          <ChatBubbleLeftIcon class="h-5 w-5" />
          <span>
            {{ showComments ? 'Hide Comment' : `${post.comments?.length || 0} Comment` }}
          </span>
        </button>

      </div>
    </div>

    <!-- Comment Section -->
    <div v-if="showComments" class="border-t border-slate-200">

      <!-- Comment List -->
      <div class="max-h-40 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50">
        <p v-if="!post.comments?.length" class="text-sm text-slate-500">
          There are no comments yet
        </p>

        <div v-for="comment in post.comments || []" :key="comment.id"
          class="rounded-lg bg-white px-3 py-2 text-sm flex justify-between gap-3">
          <div>
            <p class="font-semibold text-slate-900">
              {{ comment.user?.name || 'User' }}
            </p>
            <p class="text-slate-700">
              {{ comment.content }}
            </p>
          </div>

          <button v-if="isAuthenticated && currentUserId === comment.user_id" class="
    inline-flex items-center justify-center
    h-7 w-7 rounded-md
    text-red-500 hover:text-red-400
    hover:bg-red-50
    transition
  " @click="$emit('delete-comment', { post, comment })" title="Delete comment">
            <TrashIcon class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Comment Form -->
      <div class="px-5 py-4 flex items-center gap-3 bg-white">
        <input v-model="commentInput" type="text" :disabled="!isAuthenticated" placeholder="Add a comment…"
          class="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40 disabled:opacity-50"
          @keyup.enter="submitComment" />
        <button :disabled="!isAuthenticated"
          class="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition disabled:opacity-60"
          @click="submitComment">
          Send
        </button>
      </div>

    </div>
  </article>
</template>
