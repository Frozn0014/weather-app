<template>
  <div id="theme" :class="{ dark: theme === 'dark' }">
    <div
      id="background"
      class="min-h-screen bg-gradient-to-b from-light to-indigo-300/50 pb-16 dark:bg-dark"
    ></div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      theme: localStorage.theme || 'light'
    }
  }
}
</script>