<script setup>
import { computed, onMounted, ref } from 'vue'
import HomeHeader from '@/components/HomeHeader.vue'
import PostComposer from '@/components/PostComposer.vue'
import PostCard from '@/components/PostCard.vue'
import EditPostModal from '@/components/EditPostModal.vue'
import AuthModal from '@/components/AuthModal.vue'
import { backendOrigin } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/post'
import { useConfirm } from '@/composables/useConfirm'
import { useNotify } from '@/composables/useNotify'

const authStore = useAuthStore()
const postStore = usePostStore()
const { confirm, confirmDeletePost, confirmDeleteComment } = useConfirm()
const { notify } = useNotify();

const creating = ref(false)
const newPost = ref('')
const newImage = ref(null)
const newImagePreview = ref('')
const editingPost = ref(null)

const showAuthModal = ref(false)
const authMode = ref('login')
const authLoading = ref(false)
const authError = ref('')

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const posts = computed(() => postStore.posts)
const postsLoading = computed(() => postStore.loading)
const error = computed(() => postStore.error)

const openAuth = (mode = 'login') => {
  authMode.value = mode
  showAuthModal.value = true
  document.title = `${mode == 'login' ? 'Login' : 'Register'} - InstaApp`;
}

const closeAuth = () => {
  showAuthModal.value = false
  authError.value = ''
  document.title = 'InstaApp';
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
    if (mode === 'login') {
      authError.value = `Invalid email or password`;
    } else {
      authError.value =
        err?.response?.data?.message ||
        err?.response?.data ||
        err.message ||
        `${mode} gagal.`
    }
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

const createPost = async () => {
  if (!requireAuth()) return
  if (!newPost.value.trim() || !newImage.value) {
    postStore.error = 'Write something and upload an image'
    return
  }
  creating.value = true
  try {
    const formData = new FormData()
    formData.append('content', newPost.value)
    formData.append('image', newImage.value)
    await postStore.createPost(formData)
    newPost.value = ''
    newImage.value = null
    newImagePreview.value = ''
    notify('success', 'Post Created');
  } catch (err) {
    // error state set in store
  } finally {
    creating.value = false
  }
}

const toggleLike = async (post) => {
  if (!requireAuth()) return
  await postStore.likePost(post)
}

const addComment = async (post, content) => {
  if (!requireAuth()) return
  await postStore.commentPost(post, content)
}

const deleteComment = async ({ post, comment }) => {
  if (!requireAuth()) return
  const confirmed = await confirmDeleteComment()
  if (!confirmed) return
  await postStore.deleteComment(post, comment)
  notify('success', 'Comment Deleted');
}

const startEdit = (post) => {
  editingPost.value = {
    ...post,
    resolvedImageUrl: resolveImageUrl(post.image_url),
    editContent: post.content,
    editImage: null,
    editImagePreview: '',
  }
}

const onEditImageChange = ({ file, preview }) => {
  if (editingPost.value) {
    editingPost.value.editImage = file || null
    editingPost.value.editImagePreview = preview || ''
  }
}

const savePost = async (content) => {
  if (!requireAuth() || !editingPost.value) return
  if (!content?.trim()) return
  await postStore.updatePost(editingPost.value, {
    content,
    image: editingPost.value.editImage,
  })
  editingPost.value = null
  notify('success', 'Post Edited');
}

const deletePost = async (post) => {
  if (!requireAuth()) return
  const confirmed = await confirmDeletePost()
  if (!confirmed) return
  await postStore.deletePost(post)
  notify('success', 'Post Deleted');
}

const logout = async () => {
  const confirmed = await confirm('Confirm Logout', 'Are you sure you want to log out of your account?')
  if (!confirmed) return;
  await authStore.logout()
  notify('success', `Logged Out`);
}

const onFileChange = ({ file }) => {
  let preview = file ? URL.createObjectURL(file) : ''
  newImage.value = file || null
  newImagePreview.value = preview || ''
}

const resolveImageUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (backendOrigin) return `${backendOrigin}${url}`
  return url
}

onMounted(async () => {
  document.title = 'InstaApp';
  await authStore.init()
  await postStore.fetchPosts()
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

      <PostComposer
        v-if="isAuthenticated"
        :content="newPost"
        :image-name="newImage?.name"
        :image-preview="newImagePreview"
        :creating="creating"
        @update:content="newPost = $event"
        @select-image="onFileChange"
        @submit="createPost"
      />

      <section class="space-y-4">
        <div v-if="error" class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700">
          {{ error }}
        </div>
        <div v-if="postsLoading" class="border border-slate-200 rounded-2xl p-3 bg-slate-100 text-center text-slate-500">Loading posts ...</div>
        <div v-else-if="!posts.length" class="border border-slate-200 rounded-2xl p-3 bg-slate-100 text-center text-slate-500">No posts yet. Be the first to share something!</div>

        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          :is-authenticated="isAuthenticated"
          :current-user-id="user?.id"
          :resolve-image-url="resolveImageUrl"
          @like="toggleLike"
          @comment="addComment"
          @delete-comment="deleteComment"
          @edit="startEdit"
          @delete="deletePost"
        />
      </section>
  </main>

  <EditPostModal
    v-if="editingPost"
    :show="!!editingPost"
    :post="editingPost"
    @close="editingPost = null"
    @save="savePost"
    @change-image="onEditImageChange"
  />

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
