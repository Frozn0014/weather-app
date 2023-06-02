<template>
  <div id="theme" :class="{ dark: theme === 'dark' }">
    <div id="background" class="min-h-screen bg-slate-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-300">
      <div class="container mx-auto h-screen items-center justify-center px-4 sm:flex">
        <div class="flex flex-col items-center gap-y-8">
          <h1 class="mt-16 font-mono text-8xl font-bold sm:mt-0">404</h1>
          <h2 class="text-center text-2xl">We couldn't find that page.</h2>
          <h3 class="text-lg">Maybe check the clouds?</h3>
          <button
            class="rounded elevation-6 bg-blue-500/50 px-3 py-1 font-semibold transition hover:scale-105"
            @click="back()"
          >
            <i class="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;Go back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      theme: localStorage.theme || 'light'
    };
  },
  methods: {
    back() {
      return history.back();
    }
  }
};
</script>
