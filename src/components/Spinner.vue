<script setup lang="ts">
const props = defineProps<{ size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }>();

const sizeMap = {
  xs: '20px',
  sm: '30px',
  md: '40px',
  lg: '50px',
  xl: '60px'
};

const size = sizeMap[props.size];
</script>

<template>
  <div
    class="relative animate-spin rounded-full border-8 border-blue-600 border-t-transparent"
    :style="{ width: size, height: size }"
  ></div>
</template>
