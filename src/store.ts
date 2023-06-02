import { defineStore } from 'pinia'

export const unitStore = defineStore('unit', {
  state: () => ({
    unit: localStorage.getItem('unit') || 'F'
  }),
  actions: {
    switchUnit() {
      this.unit = this.unit === 'C' ? 'F' : 'C';
      localStorage.setItem('unit', this.unit)
    }
  }
})

export const themeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'light'
  }),
  actions: {
    switchTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', this.theme)
    }
  }
})