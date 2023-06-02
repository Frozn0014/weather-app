<template>
  <div id="theme" :class="{ dark: theme === 'dark' }">
    <div id="background" class="min-h-screen bg-slate-100 dark:bg-zinc-800">
      <div class="container mx-auto flex min-h-screen items-center justify-center px-4 font-sans">
        <div
          class="absolute flex h-fit w-11/12 max-w-md flex-col items-center justify-start gap-y-4 rounded-3xl border-2 border-zinc-300/75 pt-4 dark:border-zinc-700 sm:w-2/3 md:w-1/2"
        >
          <h1
            class="border-b-2 from-cyan-200 to-cyan-500 text-3xl font-light text-slate-800 border-gradient-to-r dark:text-slate-200"
          >
            Create an account
          </h1>
          <img src="./assets/logo.png" alt="logo" class="mt-2 h-24 w-24" />
          <input
            type="text"
            placeholder="username"
            v-model="username"
            @input="validateUsername()"
            class="mt-2 w-2/3 rounded-lg bg-white px-2 font-mono ring-1 ring-slate-600 transition focus:outline-none focus:ring-2"
          />
          <p :hidden="!usernameErr" class="-my-2 text-xs text-red-500">
            <i class="fa-solid fa-circle-exclamation"></i> {{ usernameErrText }}
          </p>
          <input
            type="password"
            placeholder="password"
            v-model="password"
            @input="validatePassword()"
            class="w-2/3 rounded-lg bg-white px-2 font-mono ring-1 ring-slate-600 transition focus:outline-none focus:ring-2"
          />
          <p :hidden="!pwErr" class="-my-2 text-xs text-red-500">
            <i class="fa-solid fa-circle-exclamation"></i> {{ pwErrText }}
          </p>
          <a
            class="mt-4 cursor-pointer rounded-lg px-4 py-1 text-slate-200 ring-1 ring-cyan-300 transition hover:scale-105"
            @click="createAccount()"
            >Create account</a
          >
          <a
            class="mt-4 flex gap-x-4 rounded-lg bg-white px-4 py-1 font-medium ring-1 transition hover:scale-105"
            href="https://google.com"
            ><img src="./assets/google.svg" class="w-4" />Continue with Google</a
          >
          <p class="mt-6 text-sm text-slate-700 dark:text-slate-400">
            Already have an account?
            <a class="text-blue-500 dark:text-blue-400" href="/login">Log in</a>
          </p>
        </div>
      </div>
      <p class="absolute left-4 top-2 cursor-pointer text-slate-400" @click="back()">
        <i class="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;Back
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { themeStore } from './store';
export default {
  data() {
    return {
      username: '',
      password: '',
      email: '',
      phone: 0,
      usernameErr: false,
      usernameErrText: '',
      pwErr: false,
      pwErrText: '',
      api: 'https://frozen-weather-api.onrender.com'
    };
  },
  computed: {
    theme() {
      return themeStore().theme;
    }
  },
  methods: {
    validateUsername() {
      if (this.username.length < 4) {
        this.usernameErrText = 'Username must be at least 4 characters!';
        this.usernameErr = true;
        return false;
      } else {
        this.usernameErr = false;
        return true;
      }
    },
    validatePassword() {
      if (this.password.length < 6) {
        this.pwErrText = 'Password must be at least 6 characters!';
        this.pwErr = true;
        return false;
      } else {
        this.pwErr = false;
        return true;
      }
    },
    createAccount() {
      console.log('hi')
      if (this.validateUsername() && this.validatePassword()) {
        fetch(
          this.api +
            `/db/users/insert?user=${this.username}&pass=${this.password}&email=${this.email}&phone=${this.phone}`,
          { method: 'POST' }
        ).then((res) => {
          console.log(res)
          switch (res.status) {
            case 200:
              return res.json()
            case 403:
              this.usernameErrText = ''
          }
        }).then(data => {
          console.log(data)
        })
      }
    },
    back() {
      return history.back();
    }
  }
};
</script>
