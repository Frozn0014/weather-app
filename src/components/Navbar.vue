<script setup lang="ts">
const pages: { name: string; href: string }[] = [
  { name: 'Real Time', href: '/weather/realtime' },
  { name: 'Forecast', href: '/weather/forecast' }
];

const activePage = pages.find((p) => p.href === window.location.pathname);

document.title = 'Frozen - ' + activePage!.name;

defineProps({
  cf: {
    type: Boolean,
    required: false
  }
});
</script>

<template>
  <div class="flex h-16 w-full items-center bg-sky-300/50 pl-4 dark:bg-zinc-900">
    <h1 class="pr-4 text-2xl font-semibold text-sky-700 dark:text-gradient-to-b from-cyan-400 to-white md:text-3xl">
      Frozen
    </h1>
    <img src="../assets/logo.png" class="w-10 md:w-12 h-10">
    <div class="hidden h-full w-full items-center md:flex">
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
        class="ml-auto mr-6 flex h-7 w-16 cursor-pointer items-center justify-start rounded-full bg-slate-100/75 px-0.5 dark:bg-slate-400/75"
        :class="{ hidden: !cf }"
        @click="switchUnit()"
      >
        <div
          class="relative left-0 flex h-6 w-6 select-none items-center justify-center rounded-full bg-slate-600 transition-[left] duration-300 ease-out"
          :class="{ 'left-9': unit === 'C' }"
        >
          <p
            class="absolute font-bold text-orange-400 transition duration-300"
            :class="{ 'opacity-0': unit === 'C' }"
          >
            &deg;F
          </p>
          <p
            class="absolute font-bold text-sky-400 transition duration-300"
            :class="{ 'opacity-0': unit === 'F' }"
          >
            &deg;C
          </p>
        </div>
      </a>
      <a
        class="mr-6 flex h-7 w-16 cursor-pointer select-none items-center justify-start rounded-full bg-slate-100/75 px-0.5 dark:bg-slate-400/75"
        :class="{ 'ml-auto': !cf }"
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
      <a
        class="mr-4 rounded-lg px-3 py-1 font-semibold text-slate-800 ring-1 ring-sky-600 transition hover:scale-105 dark:text-slate-100 dark:ring-cyan-300"
        href="/register"
        >Register</a
      >
    </div>
    <i
      id="menuBtn"
      class="fa-solid fa-bars fa-2xl z-40 ml-auto mr-4 text-white transition duration-300 ease-out md:hidden"
      @click="toggleMenu()"
    ></i>
    <div
      id="menu"
      class="fixed left-1/3 top-16 z-30 flex h-screen w-2/3 translate-x-full flex-col items-center justify-start gap-y-8 overflow-hidden bg-white/5 pt-16 backdrop-blur-xl transition duration-300"
    >
      <a
        v-for="page in pages"
        class="flex items-center justify-center border-b-2 border-b-blue-300/75 text-2xl font-medium text-slate-800 dark:border-blue-300/30 dark:text-slate-300"
        :class="{ '!border-b-blue-500': page.name === activePage?.name }"
        :href="page.href"
        >{{ page.name }}</a
      >
      <a
        class="flex h-8 w-20 cursor-pointer items-center justify-start rounded-full bg-slate-100/75 px-0.5 dark:bg-slate-400/75"
        :class="{ hidden: !cf }"
        @click="switchUnit()"
      >
        <div
          class="relative left-0 flex h-7 w-7 select-none items-center justify-center rounded-full bg-slate-600 transition-[left] duration-300 ease-in-out"
          :class="{ 'left-12': unit === 'C' }"
        >
          <p
            class="absolute font-bold text-orange-400 transition duration-300"
            :class="{ 'opacity-0': unit === 'C' }"
          >
            &deg;F
          </p>
          <p
            class="absolute font-bold text-sky-400 transition duration-300"
            :class="{ 'opacity-0': unit === 'F' }"
          >
            &deg;C
          </p>
        </div>
      </a>
      <a
        class="flex h-8 w-20 cursor-pointer items-center justify-start rounded-full bg-slate-100/75 px-0.5 dark:bg-slate-400/75"
        @click="switchTheme()"
      >
        <div
          class="relative left-0 flex h-7 w-7 select-none items-center justify-center rounded-full bg-slate-600 transition-[left] duration-300 ease-out dark:left-12"
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
      <a
        class="mr-4 rounded-lg px-4 py-2 font-semibold text-slate-800 ring-1 text-xl ring-sky-600 transition hover:scale-105 dark:text-slate-100 dark:ring-cyan-300"
        href="/register"
        >Register</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import { themeStore, unitStore } from '../store';
export default {
  computed: {
    theme() {
      return themeStore().theme;
    },
    unit() {
      return unitStore().unit;
    }
  },
  methods: {
    switchTheme() {
      themeStore().switchTheme();
    },
    switchUnit() {
      unitStore().switchUnit();
    },
    toggleMenu() {
      document.getElementById('menuBtn')?.classList.toggle('-rotate-90');
      document.getElementById('menu')?.classList.toggle('translate-x-full');
    }
  }
};
</script>
