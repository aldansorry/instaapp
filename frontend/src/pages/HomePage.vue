<script setup>
import { ref } from 'vue'
import {
    HeartIcon,
    ChatBubbleLeftIcon,
} from '@heroicons/vue/24/solid'

const showComments = ref(false)
const liked = ref(false)
</script>

<template>
    <main class="">
        <div class="max-w-lg min-h-screen mx-auto p-2 bg-white">
            <h1 class="text-xl font-semibold tracking-wide text-slate-500">
                Insta
                <span class="text-emerald-500 font-bold">App</span>
            </h1>
            <div class="mt-8 space-y-6">

                <!-- Post Card -->
                <article class="
      bg-white rounded-2xl shadow-sm border border-slate-200
      overflow-hidden
    ">
                    <!-- Header -->
                    <div class="flex items-center justify-between px-5 py-4">
                        <div>
                            <p class="font-semibold text-slate-900">Budi Santoso</p>
                            <p class="text-sm text-slate-500">12 Mei 2025 • 10:32</p>
                        </div>
                    </div>

                    <!-- Image -->
                    <div class="w-full max-h-[360px] overflow-hidden bg-slate-100">
                        <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" alt="Post Image"
                            class="w-full object-cover" />
                    </div>

                    <!-- Content -->
                    <div class="px-5 py-4 space-y-4">
                        <p class="text-slate-800 leading-relaxed">
                            Hari ini belajar Vue + Tailwind. UI jadi jauh lebih rapi dan enak dilihat
                        </p>

                        <!-- Actions -->
                        <div class="flex items-center gap-4 text-sm">
                            <!-- Like -->
                            <button 
                                class="inline-flex items-center gap-2 font-medium transition"
                                @click="liked = !liked">
                                <HeartIcon class="h-5 w-5" :class="liked ? 'text-red-500' : 'text-slate-400'" />
                                <span :class="liked ? 'text-red-600' : 'text-slate-500'">
                                    {{ liked ? 'Unlike' : 'Like' }}
                                </span>
                            </button>
                            <span class="text-slate-500">
                                12 likes
                            </span>

                            <!-- Comment toggle -->
                            <button
                                class="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition"
                                @click="showComments = !showComments">
                                <ChatBubbleLeftIcon class="h-5 w-5" />
                                <span>
                                    {{ showComments ? 'Tutup komentar' : 'Lihat komentar' }}
                                </span>
                            </button>
                        </div>
                    </div>

                    <!-- Comments -->
                    <!-- Comment Section -->
                    <div v-if="showComments" class="border-t border-slate-200">

                        <!-- Comment List -->
                        <div class="
      max-h-40 overflow-y-auto
      px-5 py-4 space-y-3
      bg-slate-50
    ">
                            <div class="rounded-lg bg-white px-3 py-2 text-sm">
                                <p class="font-semibold text-slate-900">Ani</p>
                                <p class="text-slate-700">Keren banget 🔥</p>
                            </div>

                            <div class="rounded-lg bg-white px-3 py-2 text-sm">
                                <p class="font-semibold text-slate-900">Rudi</p>
                                <p class="text-slate-700">Mantap!</p>
                            </div>
                        </div>

                        <!-- Comment Form -->
                        <div class="px-5 py-4 flex items-center gap-3 bg-white">
                            <input type="text" placeholder="Tulis komentar..." class="
        flex-1 rounded-xl border border-slate-300
        px-4 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-emerald-400/40
      " />
                            <button class="
        rounded-xl bg-emerald-500
        px-4 py-2 text-sm font-semibold text-white
        hover:bg-emerald-600
        transition
      ">
                                Kirim
                            </button>
                        </div>

                    </div>

                </article>

            </div>

        </div>
    </main>
</template>