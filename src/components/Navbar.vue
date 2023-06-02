<script setup lang="ts">
const pages: { name: string; href: string }[] = [
  { name: 'Real Time', href: '/weather/realtime' },
  { name: 'Forecast', href: '/weather/forecast' }
];

const activePage = pages.find((p) => p.href === window.location.pathname);

document.title = 'Weather - ' + activePage!.name;
</script>

<template>
  <div class="flex h-16 w-full items-center bg-sky-300/50 pl-4 dark:bg-stone-800">
    <h1 class="pr-4 text-3xl font-semibold text-slate-800 dark:text-slate-300/95">Local Weather</h1>
    <i class="fa-solid fa-cloud-moon-rain text-3xl text-blue-400"></i>
    <div class="ml-8 flex h-full gap-4">
      <a
        v-for="page in pages"
        class="flex h-full w-24 items-center justify-center border-b-2 border-b-blue-300/75 text-slate-800 dark:border-blue-300/30 dark:text-slate-300"
        :class="{ '!border-b-blue-500': page.name === activePage?.name }"
        :href="page.href"
        >{{ page.name }}</a
      >
    </div>
    <a
      class="ml-auto mr-4 flex h-7 w-16 cursor-pointer items-center justify-start rounded-full bg-slate-400/75 px-0.5"
      @click="switchTheme()"
    >
      <div
        class="relative left-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-600 transition-[left] duration-300 ease-in-out dark:left-9"
      >
        <i
          class="fa-solid fa-sun fa-sm absolute text-yellow-400 transition duration-300"
          :class="{ 'opacity-0': theme === 'dark' }"
        ></i>
        <i
          class="fa-solid fa-moon fa-md absolute text-white transition duration-300"
          :class="{ 'opacity-0': theme === 'light' }"
        ></i>
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
      document.getElementById('theme')?.classList.toggle('dark');
    }
  }
};
</script>
