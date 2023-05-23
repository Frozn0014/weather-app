<template>
  <div class="flex h-16 w-full items-center bg-sky-300/50 pl-4 dark:bg-stone-800">
    <h1 class="pr-4 text-3xl font-semibold text-slate-700 dark:text-slate-300/95">Local Weather</h1>
    <i class="fa-solid fa-cloud-moon-rain text-3xl text-blue-400"></i>
    <a
      class="ml-auto cursor-pointer mr-4 flex h-7 w-16 items-center justify-start rounded-full bg-slate-400/75 px-0.5"
      @click="switchTheme()"
    >
      <div class="flex relative left-0 dark:left-9 transition-[left] ease-in-out duration-300 h-6 w-6 items-center justify-center rounded-full bg-slate-600">
        <i class="fa-solid absolute fa-sun fa-sm text-yellow-400 transition duration-300" :class="{ 'opacity-0': theme === 'dark' }"></i>
        <i class="fa-solid absolute fa-moon fa-md text-white transition duration-300" :class="{ 'opacity-0': theme === 'light' }"></i>
      </div>
    </a>
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
    switchTheme() {
      localStorage.theme = localStorage.theme === 'light' ? 'dark' : 'light';
      this.theme = localStorage.theme;
      document.getElementById('theme')?.classList.toggle('dark')
    }
  }
};
</script>
