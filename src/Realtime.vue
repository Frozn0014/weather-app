<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Spinner from './components/Spinner.vue';
</script>

<template>
  <div id="theme" :class="{ dark: theme === 'dark' }">
    <div
      id="background"
      class="min-h-screen bg-light pb-16 dark:bg-dark"
    >
      <Navbar />
      <div class="container mx-auto px-4 font-sans">
        <div class="flex flex-col items-center justify-start">
          <div class="mt-12 flex h-10 w-3/4 flex-row lg:w-5/12">
            <a
              class="flex w-14 items-center justify-center rounded rounded-e-none border-2 border-e-0 border-slate-200 bg-slate-200 text-slate-600 dark:bg-slate-300 dark:border-slate-500"
              ><i class="fa-solid fa-magnifying-glass"></i
            ></a>
            <input
              type="text"
              placeholder="City / State / ZIP"
              v-model="search"
              class="w-full border-2 border-x-0 bg-slate-50 dark:border-slate-500 border-slate-200 px-2 focus:outline-none dark:bg-slate-200"
              @keypress="
                (event) => {
                  error = false;
                  if (event.key == 'Enter') {
                    if (!search) return;
                    getCurrentWeatherInfo(search);
                  }
                }
              "
            />
            <a
              class="flex w-16 cursor-pointer items-center dark:border-slate-500 justify-center rounded rounded-s-none border-2 border-s-0 border-slate-200 bg-emerald-400/75 font-bold text-slate-800 transition-[width] hover:w-24"
              @click="
                () => {
                  if (!search) return;
                  getCurrentWeatherInfo(search);
                }
              "
              >Go</a
            >
          </div>
          <a
            class="my-8 cursor-pointer rounded-lg bg-sky-600/30 p-2 font-medium elevation-4 dark:text-slate-200"
            :class="{ hidden: weatherData.available }"
            @click="getLocation()"
            >Use my current location</a
          >
          <Spinner size="md" :class="{ hidden: !loading }" />
          <div
            class="mt-8 flex w-2/3 flex-col items-center break-all rounded border-2 border-red-600/60 bg-red-500/40 p-2 text-center"
            :class="{ hidden: !error }"
          >
            <h4 class="text-xl font-medium">Error</h4>
            <h5>
              Could not find location <strong>{{ errorSearch }}</strong>
            </h5>
          </div>
          <div class="flex flex-col items-center" :class="{ hidden: !weatherData.available }">
            <h2 class="mt-8 text-center text-2xl font-semibold text-slate-800 dark:text-slate-300">
              <vue-custom-tooltip label="Not your location?">
                <i
                  class="fa-solid fa-location-dot cursor-pointer"
                  :class="{ hidden: !isCurrentLocation }"
                  @click="resetLocation()"
                ></i>
              </vue-custom-tooltip>
              {{ weatherData.location.region }}
            </h2>
            <h3 class="text-md text-center text-slate-600 dark:text-slate-400">{{ weatherData.location.country }}</h3>
            <h2 class="mt-8 text-center text-3xl text-slate-700 dark:text-slate-300">{{ weatherData.condition }}</h2>
            <img
              :src="weatherData.icon"
              :class="{ hidden: !weatherData.available }"
              class="mt-4 w-1/3"
            />
          </div>
          <div
            id="data"
            class="mt-2 grid w-11/12 place-items-center gap-y-8 align-middle xl:grid-cols-4 text-slate-600 dark:text-slate-300"
            :class="{ hidden: !weatherData.available }"
          >
            <h3 class="text-3xl font-light xl:text-2xl">
              <i class="fa-solid fa-temperature-three-quarters text-sky-400"></i
              >&nbsp;&nbsp;Temperature
            </h3>
            <div class="grid w-full grid-cols-2 md:w-2/3 lg:w-1/2 xl:w-full">
              <div
                class="flex w-full flex-wrap justify-center rounded-s-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold"
              >
                <p>&deg;C</p>
                &nbsp;
                <p :class="tempTextColor(weatherData.temp_c, 'C')">{{ weatherData.temp_c }}</p>
                <div class="h-0 basis-full"></div>
                <p class="text-sm">
                  Feels like &deg;C
                  <span :class="tempTextColor(weatherData.feelslike_c, 'C')">{{
                    weatherData.feelslike_c
                  }}</span>
                </p>
              </div>
              <div
                class="flex w-full flex-wrap justify-center rounded-e-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold "
              >
                <p>&deg;F</p>
                &nbsp;
                <p :class="tempTextColor(weatherData.temp_f, 'F')">{{ weatherData.temp_f }}</p>
                <div class="h-0 basis-full"></div>
                <p class="text-sm">
                  Feels like &deg;F
                  <span :class="tempTextColor(weatherData.feelslike_f, 'F')">{{
                    weatherData.feelslike_f
                  }}</span>
                </p>
              </div>
            </div>
            <h3 class="text-3xl font-light  xl:text-2xl">
              <i class="fa-solid fa-smog text-stone-500/75"></i>&nbsp;&nbsp;Humidity
            </h3>
            <div class="grid w-2/3 grid-cols-1 md:w-1/2 lg:w-1/3 xl:w-full">
              <div
                class="flex w-full flex-wrap justify-center rounded-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold "
              >
                <p>{{ weatherData.humidity }}&nbsp;%</p>
                <div class="h-0 basis-full"></div>
                <div class="h-2 w-full rounded-full bg-slate-500/50">
                  <div
                    class="h-2 rounded-full bg-slate-600 dark:bg-slate-300"
                    :style="{ width: `${weatherData.humidity}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <h3 class="text-3xl font-light  xl:text-2xl">
              <i class="fa-solid fa-cloud text-white"></i>&nbsp;&nbsp;Cloud Cover
            </h3>
            <div class="grid w-2/3 grid-cols-1 md:w-1/2 lg:w-1/3 xl:w-full">
              <div
                class="flex w-full flex-wrap justify-center rounded-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold "
              >
                <p>{{ weatherData.cloudCover }}&nbsp;%</p>
                <div class="h-0 basis-full"></div>
                <div class="h-2 w-full rounded-full bg-slate-500/50">
                  <div
                    class="h-2 rounded-full bg-slate-600 dark:bg-slate-300"
                    :style="{ width: `${weatherData.cloudCover}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <h3 class="text-3xl font-light  xl:text-2xl">
              <i class="fa-solid fa-cloud-showers-heavy text-sky-400"></i>&nbsp;&nbsp;Precipitation
            </h3>
            <div class="grid w-2/3 grid-cols-1 md:w-1/2 lg:w-1/3 xl:w-full">
              <div
                class="flex w-full flex-wrap justify-center rounded-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold "
              >
                <p>{{ weatherData.precip }}&nbsp;%</p>
                <div class="h-0 basis-full"></div>
                <div class="h-2 w-full rounded-full bg-slate-500/50">
                  <div
                    class="h-2 rounded-full bg-slate-600 dark:bg-slate-300"
                    :style="{ width: `${weatherData.precip}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <h3 class="text-3xl font-light  xl:text-2xl">
              <i class="fa-solid fa-wind text-sky-100"></i>&nbsp;&nbsp;Wind
            </h3>
            <div class="grid w-11/12 grid-cols-2 md:w-1/2 xl:w-full">
              <div
                class="flex w-full flex-wrap justify-center rounded-s-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold "
              >
                <div class="grid w-full grid-flow-col grid-cols-2 grid-rows-2 place-items-center">
                  <p>{{ weatherData.wind_mph }}</p>
                  <p class="text-sm">mph</p>
                  <p>{{ weatherData.wind_kph }}</p>
                  <p class="text-sm">kph</p>
                </div>
              </div>
              <div
                class="flex w-full flex-wrap items-center justify-center rounded-e-lg border-2 border-stone-400/50 p-2 text-center text-5xl font-bold "
              >
                <p>{{ weatherData.wind_dir }}</p>
              </div>
            </div>
            <h3 class="text-3xl font-light  xl:text-2xl">
              <i class="fa-solid fa-eye "></i>&nbsp;&nbsp;Visibility
            </h3>
            <div class="grid w-1/2 grid-cols-1 md:w-1/3 lg:w-1/4 xl:w-2/3">
              <div
                class="flex w-full flex-wrap justify-center rounded-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold "
              >
                <div class="grid w-full grid-flow-col grid-cols-2 grid-rows-2 place-items-center">
                  <p>{{ weatherData.vis_m }}</p>
                  <p class="text-sm">miles</p>
                  <p>{{ weatherData.vis_km }}</p>
                  <p class="text-sm">km</p>
                </div>
              </div>
            </div>
            <h3 class="text-3xl font-light  xl:text-2xl">
              <i class="fa-solid fa-cloud-sun text-amber-400/75"></i>&nbsp;&nbsp;UV index
            </h3>
            <div class="grid w-32 grid-cols-1">
              <div
                class="flex w-full flex-wrap justify-center rounded-lg border-2 border-stone-400/50 p-2 text-center text-2xl font-bold "
              >
                <p :class="uvTextColor()">{{ weatherData.uv }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      theme: localStorage.theme || 'light',
      api: `https://api.weatherapi.com/v1/current.json?key=a24feac5eafe4a288f8160227231805`,
      isCurrentLocation: false,
      search: '',
      loading: false,
      error: false,
      errorSearch: '',
      weatherData: {
        available: false,
        location: {
          region: '',
          country: ''
        },
        localtime: '',
        day: true,
        condition: '',
        icon: '',
        temp_c: 0,
        temp_f: 0,
        feelslike_c: 0,
        feelslike_f: 0,
        humidity: 0,
        cloudCover: 0,
        precip: 0,
        wind_mph: 0,
        wind_kph: 0,
        wind_dir: '',
        vis_m: 0,
        vis_km: 0,
        uv: 0,
        last_updated: ''
      }
    };
  },
  mounted() {
    if (localStorage.location) {
      this.isCurrentLocation = true;
      this.getCurrentWeatherInfo(localStorage.location);
    }
  },
  methods: {
    async getCurrentWeatherInfo(search: string) {
      await fetch(this.api + `&q=${search}`)
        .then((res) => res.json())
        .then((data) => {
          this.weatherData.location.region = data.location.region
            ? [data.location.name, data.location.region].join(', ')
            : data.location.name;
          this.weatherData.location.country = data.location.country;
          this.weatherData.localtime = data.location.localtime;

          this.weatherData.day = data.current.is_day === 1;

          this.weatherData.condition = data.current.condition.text;
          this.weatherData.icon =
            'https://' +
            (data.current.condition.icon as string).slice(2).replace('64x64', '128x128');

          this.weatherData.temp_c = data.current.temp_c;
          this.weatherData.temp_f = data.current.temp_f;
          this.weatherData.feelslike_c = data.current.feelslike_c;
          this.weatherData.feelslike_f = data.current.feelslike_f;
          this.weatherData.humidity = data.current.humidity;

          this.weatherData.cloudCover = data.current.cloud;
          this.weatherData.precip = data.current.precip_in;
          this.weatherData.wind_mph = data.current.wind_mph;
          this.weatherData.wind_kph = data.current.wind_kph;
          this.weatherData.wind_dir = data.current.wind_dir;
          this.weatherData.vis_m = data.current.vis_miles;
          this.weatherData.vis_km = data.current.vis_km;
          this.weatherData.uv = data.current.uv;

          this.weatherData.last_updated = data.current.last_updated;

          this.error = false;
          this.loading = false;
          this.weatherData.available = true;
        })
        .catch(() => {
          this.weatherData.available = false;
          this.errorSearch = this.search;
          this.error = true;
        });
    },
    tempTextColor(temp: number, unit: 'F' | 'C') {
      const temps = {
        '30': 'text-cyan-400',
        '40': 'text-sky-400',
        '50': 'text-amber-300',
        '60': 'text-amber-500',
        '70': 'text-orange-600',
        '80': 'text-red-500',
        '90': 'text-red-600'
      };

      if (unit === 'C') {
        temp = this.cToF(temp);
      }

      let closestTemp: number = 50;
      let minDif = Infinity;

      for (const tempIndex in temps) {
        const dif = Math.abs(Number(tempIndex) - temp);

        if (dif < minDif) {
          minDif = dif;
          closestTemp = Number(tempIndex);
        }
      }

      return temps[closestTemp as keyof null];
    },
    uvTextColor() {
      const uvs = {
        1: 'text-green-500',
        3: 'text-yellow-500',
        5: 'text-amber-400',
        6: 'text-orange-600',
        8: 'text-red-600'
      };

      let closestUV: number = 50;
      let minDif = Infinity;

      for (const uvIndex in uvs) {
        const dif = Math.abs(Number(uvIndex) - this.weatherData.uv);

        if (dif < minDif) {
          minDif = dif;
          closestUV = Number(uvIndex);
        }
      }

      return uvs[closestUV as keyof null];
    },
    cToF(c: number) {
      return c * (9 / 5) + 32;
    },
    getLocation() {
      if (navigator.geolocation) {
        this.loading = true;
        navigator.geolocation.getCurrentPosition((pos) => {
          localStorage.location = [
            pos.coords.latitude.toFixed(3),
            pos.coords.longitude.toFixed(3)
          ].join();
          this.isCurrentLocation = true;
          this.getCurrentWeatherInfo(localStorage.location);
        });
      }
    },
    resetLocation() {
      localStorage.removeItem('location');
      window.location.reload();
    }
  }
};
</script>
